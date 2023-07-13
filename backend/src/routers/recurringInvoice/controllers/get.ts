import { Request, Response } from "express";
import { RecurringInvoice } from "../../../models/recurringInvoice";

export default async function controllerGet(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const invoice = await RecurringInvoice.findById(id).populate({path: 'customer', select: 'displayName billingAddress'});
    if (!invoice) {
      return res.status(404).json({ message: "SaleEstimate not found" });
    }
    return res.status(200).json(invoice);
  }
  const invoice = await RecurringInvoice.find({}).populate({path: 'customer', select: 'displayName'});
  return res.status(200).json(invoice);
}
