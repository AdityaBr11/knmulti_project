// create an express delete controller for the salePayment modle

import { Request, Response } from "express";
import { RecurringInvoice } from "../../../models/recurringInvoice";

export default async function controllerDelete(req: Request, res: Response) {
  const { id } = req.params;
  const recurringINV = await RecurringInvoice.findByIdAndDelete(id);
  if (!recurringINV) {
    return res.status(404).json({ message: "Recurring Invoice not found" });
  }
  return res.status(200).json(recurringINV);
}
