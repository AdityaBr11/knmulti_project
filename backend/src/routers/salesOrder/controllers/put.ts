// create an express put route for the saleEstimate model

import { Request, Response } from "express";
import { SalesOrder } from "../../../models";
import { generateSalesOrderPDF } from "../../../utils/pdf-generation/generatePDF";
import putFile, { deleteFile } from "../../../utils/s3";
import validateSalesOrder from "../../../validators/validateSalesOrder";
import fs from 'fs';
import { CustomerTimeline } from "../../../models/customerTimeline";

export default async function controllerPut(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = req.body;

    const salesOrder: any = await SalesOrder.findByIdAndUpdate(id, data, { new: true });

    await CustomerTimeline.create({
      customer: salesOrder?.customer, 
      timelineType: "Sales Order Updated",
      description: `Sale Order ${salesOrder?.salesOrder} Updated`,
      // link: "",
    });

    const uploadedOrder = await SalesOrder.findOne({ _id: salesOrder._id }).populate('customer')

    await deleteFile(`${uploadedOrder._id}.pdf`);

    const pathToFile: any = await generateSalesOrderPDF(uploadedOrder.toJSON());
    const file = await fs.readFileSync(pathToFile);

    await putFile(file, `${uploadedOrder._id}.pdf`);
    const newOrder =  await SalesOrder.findByIdAndUpdate(uploadedOrder._id, { pdf_url: `https://knmulti.fra1.digitaloceanspaces.com/${uploadedOrder._id}.pdf` }).populate({ path: 'customer', select: 'displayName billingAddress email' });

    await fs.rmSync(pathToFile);
    
    if (!salesOrder) {
      return res.status(404).json({ message: "Sale Order not found" });
    }
    return res.status(200).json(newOrder);
  } catch (e) {
    res.status(500).json({ msg: "Server Error: Purchase Order Data wasn't able to update" });
  }

}
