// create an express delete route for the vendor credit model

import { Request, Response } from "express";
import { VendorCredit } from "../../../models/vendorCredit";

export default async function controllerDelete(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const vendorCredit = await VendorCredit.findByIdAndDelete(id);
    if (vendorCredit) {
      res.json(vendorCredit);
    } else {
      res.status(404).json({ error: "Vendor credit not found" });
    }
  } else {
    res.status(400).json({ error: "Vendor credit id is required" });
  }
}
