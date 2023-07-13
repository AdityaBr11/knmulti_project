// create an express put route for the vendor model

import { Request, Response } from "express";
import { Vendor } from "../../../models";

export default async function controllerPut(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const vendor = await Vendor.findByIdAndUpdate(id, req.body);
    if (vendor) {
      res.json(vendor);
    } else {
      res.status(404).json({ error: "Vendor not found" });
    }
  } else {
    res.status(400).json({ error: "Vendor id is required" });
  }
}
