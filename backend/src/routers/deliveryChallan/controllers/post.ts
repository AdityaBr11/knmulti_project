// create an express post route for the goal controller

import { Request, Response } from "express";
import { DeliveryChallan } from "../../../models";
import { generateDeliveryChallanPDF } from "../../../utils/pdf-generation/generatePDF";
import validateDeliveryChallan from "../../../validators/validateDeliveryChallan";
import fs from 'fs';
import putFile from "../../../utils/s3";

export default async function controllerPost(req: Request, res: Response) {
  const data = req.body;
  const errors = validateDeliveryChallan(data);
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }
  try {
    const latest: any = await DeliveryChallan.find({}).sort({_id: -1}).limit(1);
    if (latest.length > 0 && latest[latest.length-1].deliveryChallan) {
      data.deliveryChallan = `DC-${parseInt(latest[0].deliveryChallan.split('-')[1])+1}`;
    } else {
      data.deliveryChallan = 'DC-1';
    }
    const challan : any  = await DeliveryChallan.create(data);
    const uploadedChallan = await DeliveryChallan.findOne({ _id: challan._id }).populate(["customer"]);
    const pathToFile = await generateDeliveryChallanPDF(uploadedChallan.toJSON());
    const file = await fs.readFileSync(pathToFile);
    await putFile(file, `${uploadedChallan._id}.pdf`);
    const deliveryChalan = await DeliveryChallan.findByIdAndUpdate(uploadedChallan._id, { pdf_url: `https://knmulti.fra1.digitaloceanspaces.com/${uploadedChallan._id}.pdf` }, { new: true});
    await fs.rmSync(pathToFile);
    res.status(200).send(deliveryChalan);
  } catch (e) {
    res.status(500).json({ msg: "Server Error: Sale Estimate data couldn't be created" });
  }
}
