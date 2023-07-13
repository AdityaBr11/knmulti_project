// create an express delete route for vendor model

import { Request, Response } from "express";
import { Vendor } from "../../../models";

export default async function controllerDelete(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const vendor = await Vendor.findByIdAndDelete(id);
    if (vendor) {
      res.json(vendor);
    } else {
      res.status(404).json({ error: "Vendor not found" });
    }
  } else {
    res.status(400).json({ error: "Vendor id is required" });
  }
}
