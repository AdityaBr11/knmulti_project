
import { Request, Response } from "express";
import { SaleInvoice } from "../../../models";
import putFile, { deleteFile } from "../../../utils/s3";
import validateSaleInvoice from "../../../validators/validateSaleInvoice";
import fs from 'fs';
import { generateSaleInvoicePDF } from "../../../utils/pdf-generation/generatePDF";
import { CustomerTimeline } from "../../../models/customerTimeline";

export default async function controllerPut(req: Request, res: Response) {
  const { id } = req.params;
  const data = req.body;
  

  const saleInvoice: any = await SaleInvoice.findByIdAndUpdate(id, data, { new: true });
  await CustomerTimeline.create({
    customer: saleInvoice?.customer, 
    timelineType: "Invoice Updated",
    description: `Invoice ${saleInvoice?.invoice} Updated`,
    // link: "",
  });
  const uploadedInvoice = await SaleInvoice.findOne({ _id: saleInvoice._id }).populate('customer')

  await deleteFile(`${uploadedInvoice._id}.pdf`);
  console.log(uploadedInvoice,'sa')
  const pathToFile = await generateSaleInvoicePDF(uploadedInvoice.toJSON());
  const file = await fs.readFileSync(pathToFile);

  await putFile(file, `${uploadedInvoice._id}.pdf`);
  
  const invoice = await SaleInvoice.findByIdAndUpdate(uploadedInvoice._id, { pdf_url: `https://knmulti.fra1.digitaloceanspaces.com/${uploadedInvoice._id}.pdf` }, { new: true }).populate({ path: 'customer', select: 'displayName billingAddress email' });
  
  await fs.rmSync(pathToFile);

  if (!saleInvoice) {
    return res.status(404).json({ message: "Sale Invoice not found" });
  }
  return res.status(200).send(invoice);
}
