import { Request, Response } from "express";
import { SalesOrder } from "../../../models";

export default async function controllerGet(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const salesOrder = await SalesOrder.findById(id).populate('customer');
    if (!salesOrder) {
      return res.status(404).json({ message: "SaleEstimate not found" });
    }
    return res.status(200).json(salesOrder);
  }
  const salesOrder = await SalesOrder.find({}).populate('customer').sort({ updatedAt: -1 });
  return res.status(200).json(salesOrder);
}
