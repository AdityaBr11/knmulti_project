// create a express post route for the vendor model

import { Request, Response } from "express";
import { Vendor } from "../../../models";
import { VendorTimeline } from "../../../models/vendorTimeline";
import { PurchaseOrder } from "../../../models/purchaseOrder";
export default async function controllerPost(req: Request, res: Response) {

  const data = req.body;
  const vendor = new Vendor(data);
  vendor.save((err, vendor) => {
    if (err) return res.status(400).json(err);
    res.status(201).json(vendor);
  });
  // console.log("jsj",res);
 
    // console.log("kaj",vendor,"vendor5858");
    await VendorTimeline.create({
      vendor: vendor.id, 
      timelineType: "Vendor added successfully",
      // link: "",
    });
}
