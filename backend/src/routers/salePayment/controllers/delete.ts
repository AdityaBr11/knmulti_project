// create an express delete controller for the salePayment modle

import { Request, Response } from "express";
import { CustomerTimeline } from "../../../models/customerTimeline";
import { SalePayment } from "../../../models/salePayment";
import { deleteFile } from "../../../utils/s3";

export default async function controllerDelete(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const salePayment = await SalePayment.findByIdAndDelete(id);

    await CustomerTimeline.create({
      customer: salePayment?.customer, 
      timelineType: "salePayment Deleted",
      description: `Sale Payment ${salePayment?.paymentNumber} Deleted`,
      // link: "",
    });

    if (!salePayment) {
      return res.status(404).json({ message: "SalePayment not found" });
    }
    await deleteFile(`${id}.pdf`);
    return res.status(200).json(salePayment);
  } catch (e) {
    console.log(e);
  }
}
