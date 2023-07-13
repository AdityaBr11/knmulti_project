import { Request, Response } from "express";
import { RecurringInvoice } from "../../../models/recurringInvoice";


export default async function controllerPut(req: Request, res: Response) {
  try {
    const recurringInvoice = await RecurringInvoice.findByIdAndUpdate(req.params.id, req.body, { new : true });

    res.status(200).json(recurringInvoice);
    
  } catch (err) {
    res.status(500).json({ msg: "Server Error: Recurring Invoice Data wasn't Updated" });
  }
}