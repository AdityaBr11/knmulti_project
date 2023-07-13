// create an express put route for the saleEstimate model

import { Request, Response } from "express";
import { DeliveryChallan } from "../../../models";
import { generateDeliveryChallanPDF } from "../../../utils/pdf-generation/generatePDF";
import putFile, { deleteFile } from "../../../utils/s3";
import fs from 'fs';

export default async function controllerPut(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = req.body;
    
    const deliveryChallan: any = await DeliveryChallan.findByIdAndUpdate(id, data, { new: true });
    const uploadedChallan = await DeliveryChallan.findOne({ _id: deliveryChallan._id }).populate('customer')
  
    await deleteFile(`${uploadedChallan._id}.pdf`);
  
    const pathToFile = await generateDeliveryChallanPDF(uploadedChallan.toJSON());
    const file = await fs.readFileSync(pathToFile);
  
    await putFile(file, `${uploadedChallan._id}.pdf`);
    
    const challan = await DeliveryChallan.findByIdAndUpdate(uploadedChallan._id, { pdf_url: `https://knmulti.fra1.digitaloceanspaces.com/${uploadedChallan._id}.pdf` }, { new: true});
    
    await fs.rmSync(pathToFile);
    if (!deliveryChallan) {
      return res.status(404).json({ message: "SaleEstimate not found" });
    }
    return res.status(200).json(challan);
  } catch (e) {
    return res.status(500).json({ msg: "Server Error: Delivery Challan Data wasn't able to update" });
  }
}
