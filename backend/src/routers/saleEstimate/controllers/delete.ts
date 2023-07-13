// create an epxress delete controller for the saleEstimate model

import { Request, Response } from "express";
import { CustomerTimeline } from "../../../models/customerTimeline";
import { SaleEstimate } from "../../../models/saleEstimate";
import { deleteFile } from "../../../utils/s3";

export default async function controllerDelete(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const saleEstimate = await SaleEstimate.findByIdAndDelete(id);

    await CustomerTimeline.create({
      customer: saleEstimate?.customer, 
      timelineType: "Estimate Deleted",
      description: `Estimate ${saleEstimate?.estimate} Deleted`,
      // link: "",
    });

    if (!saleEstimate) {
      return res.status(404).json({ message: "SaleEstimate not found" });
    }
    await deleteFile(`${id}.pdf`);
    return res.status(200).json(saleEstimate);

  } catch (e) {
    return res.status(500).json({ msg: "Server Error: Estimate wasn't" })
  }
}
