// create an express get route for the vendorCredit model

import { Request, Response } from "express";
import { VendorCredit } from "../../../models/vendorCredit";

export default async function controllerGet(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const vendorCredit = await VendorCredit.findById(id);
    if (vendorCredit) {
      res.json(vendorCredit);
    } else {
      res.status(404).json({ error: "Vendor credit not found" });
    }
  } else {
    const credits = await VendorCredit.find();
    res.status(200).json(credits);
  }
}
