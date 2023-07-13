import { Request, Response } from "express";
import { DeliveryChallan } from "../../../models";

export default async function controllerGet(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const deliveryChallan = await DeliveryChallan.findById(id).populate('customer');
    if (!deliveryChallan) {
      return res.status(404).json({ message: "SaleEstimate not found" });
    }
    return res.status(200).json(deliveryChallan);
  }
  const deliveryChallan = await DeliveryChallan.find({}).populate('customer');
  return res.status(200).json(deliveryChallan);
}
