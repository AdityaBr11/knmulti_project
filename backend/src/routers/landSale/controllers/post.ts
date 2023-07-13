
import { Request, Response } from "express";
import { LandSale } from "../../../models/landSale";
import { VendorTimeline } from "../../../models/vendorTimeline";
import { PurchaseOrder } from "../../../models/purchaseOrder";
export default async function controllerPost(req: Request, res: Response) {
  try {
    const landSale = await LandSale.create(req.body);
    console.log("landSale created","landSalelandSale",landSale.vendorId);
    res.status(201).json(landSale);
    await VendorTimeline.create({
      vendor: landSale.vendorId, 
      timelineType: "Land purchase Created",
      // link: "",
    });
  } catch (err) {
    res.status(500).json({ msg : "land Sales wasn't created" })
  }
}