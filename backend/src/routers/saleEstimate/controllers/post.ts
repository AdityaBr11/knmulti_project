// create an express post route for the goal controller

import { Request, Response } from "express";
import { SaleEstimate } from "../../../models/saleEstimate";
import { generateSaleEstimatePDF } from "../../../utils/pdf-generation/generatePDF";
import validateSalesEstimate from "../../../validators/validateSaleEstimate";
import fs from 'fs';
import putFile from "../../../utils/s3";
import moment from "moment";
import { CustomerTimeline } from "../../../models/customerTimeline";

export default async function controllerPost(req: Request, res: Response) {
  const data = req.body;
  const errors = validateSalesEstimate(data);
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }
  try {
    const latest: any = await SaleEstimate.find({}).sort({_id: -1}).limit(1);
    if (latest.length > 0 && latest[latest.length-1].estimate) {
      data.estimate = `EST-${parseInt(latest[0].estimate.split('-')[1])+1}`;
    } else {
      data.estimate = 'EST-1';
    }
    const estimate : any  = await SaleEstimate.create(data);
    await CustomerTimeline.create({
      customer: estimate?.customer, 
      timelineType: "Estimate Created",
      description: `Estimate ${estimate?.estimate} created`,
      // link: "",
    });

    const uploadedEstimate = await SaleEstimate.findOne({ _id: estimate._id }).populate(["customer", "tax"]);
    // uploadedEstimate.estimateDate : string = await moment(uploadedEstimate?.estimateDate).format('YYYY-MM-DD') || moment().format('YYYY-MM-DD');
    const pathToFile = await generateSaleEstimatePDF(uploadedEstimate.toJSON())
    const file = await fs.readFileSync(pathToFile);
    await putFile(file, `${uploadedEstimate._id}.pdf`);
    const saleEstimate = await SaleEstimate.findByIdAndUpdate(
      uploadedEstimate._id, 
      { pdf_url: `https://knmulti.fra1.digitaloceanspaces.com/${uploadedEstimate._id}.pdf` },
      { new: true }
    ).populate({ path: 'customer', select: 'displayName billingAddress email' });
    await fs.rmSync(pathToFile);
    return res.status(200).json(saleEstimate);
  } catch (e) {
    return res.status(500).json({ msg: "Server Error: Sale Estimate data couldn't be created" });
  }
}
