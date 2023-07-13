// create an express put route for the vendorCredit model

import { Request, Response } from "express";
import { VendorCredit } from "../../../models/vendorCredit";

export default async function controllerPut(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const vendorCredit = await VendorCredit.findByIdAndUpdate(id, req.body);
    if (vendorCredit) {
      res.json(vendorCredit);
    } else {
      res.status(404).json({ error: "Vendor credit not found" });
    }
  } else {
    res.status(400).json({ error: "Vendor credit id is required" });
  }
}
