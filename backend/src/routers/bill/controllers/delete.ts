// create an express delete route for the bill model

import { Request, Response } from "express";
import { Bill } from "../../../models/bill";

export default async function controllerDelete(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const bill = await Bill.findByIdAndDelete(id);
    if (bill) {
      res.json(bill);
    } else {
      res.status(404).json({ error: "Bill not found" });
    }
  } else {
    res.status(400).json({ error: "id is required" });
  }
}
