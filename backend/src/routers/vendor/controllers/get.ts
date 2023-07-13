// create an express get route for the vendor model

import { Request, Response } from "express";
import { Project, Vendor } from "../../../models";

export default async function controllerGet(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const populateObj = {
      path: "comments",
      populate: {
        path: "createdBy",
        select: "firstName lastName"
      }
    };
    const vendor = await (await Vendor.findById(id).populate("expenses projectList").populate(populateObj)).populate("timeline");
    if (vendor) {
      res.json(vendor);
    } else {
      res.status(404).json({ error: "Vendor not found" });
    }
  } else {
    const vendors = await Vendor.find(req.query).populate("expenses").sort({ updatedAt: 1 });
    res.json(vendors);
  }
}

