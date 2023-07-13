// create an express get route for the bill model

import { Request, Response } from "express";
import { Bill } from "../../../models/bill";

export default async function controllerGet(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const bill = await Bill.findById(id)
      .populate("vendor")
      .populate("createdBy")
      .populate("expense");
    if (bill) {
      res.json(bill);
    } else {
      res.status(404).json({ error: "Bill not found" });
    }
  } else {
    const bills = await Bill.find()
      .populate("vendor")
      .populate("createdBy")
      .populate("expense");
    res.json(bills);
  }
}
