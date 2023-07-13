// create an expres post route for the vendorCredit model

import { Request, Response } from "express";
import { VendorCredit } from "../../../models/vendorCredit";

export default async function controllerPost(req: Request, res: Response) {
  const data = req.body;
  const vendorCredit = new VendorCredit(data);
  vendorCredit.save((err: any, vendorCredit: any) => {
    if (err) return res.status(400).json(err);
    res.status(201).json(vendorCredit);
  });
}
