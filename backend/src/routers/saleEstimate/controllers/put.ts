// create an express put route for the saleEstimate model

import { Request, Response } from "express";
import { SaleEstimate } from "../../../models/saleEstimate";
import { generateSaleEstimatePDF } from "../../../utils/pdf-generation/generatePDF";
import putFile, { deleteFile } from "../../../utils/s3";
import fs from 'fs';
import { CustomerTimeline } from "../../../models/customerTimeline";
import moment from "moment";

export default async function controllerPut(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = req.body;
  
    const saleEstimate: any = await SaleEstimate.findByIdAndUpdate(id, data, { new: true });

    const uploadedEstimate = await SaleEstimate.findOne({ _id: saleEstimate._id }).populate('customer')
    
    await CustomerTimeline.create({
      customer: saleEstimate?.customer?._id, 
      timelineType: "Estimate Updated",
      // dateTime: moment().format('YYYY-MM-DD'),
      description: `Estimate ${saleEstimate?.estimate} updated`,
      // link: "",
    });
  
    await deleteFile(`${uploadedEstimate._id}.pdf`);
    
    const pathToFile = await generateSaleEstimatePDF(uploadedEstimate.toJSON());
    const file = await fs.readFileSync(pathToFile);
  
    await putFile(file, `${uploadedEstimate._id}.pdf`);
    
    const newEstimate = await SaleEstimate.findByIdAndUpdate(uploadedEstimate._id, { pdf_url: `https://knmulti.fra1.digitaloceanspaces.com/${uploadedEstimate._id}.pdf` }, { new: true }).populate({ path: 'customer', select: 'displayName billingAddress email' });
    
    await fs.rmSync(pathToFile);
  
    if (!saleEstimate) {
      return res.status(404).json({ message: "SaleEstimate not found" });
    }
    return res.status(200).json(newEstimate);
  } catch (e) {
    return res.status(500).json({ msg: "Server Error: Delivery Challan Data wasn't able to update" });
  }
}
