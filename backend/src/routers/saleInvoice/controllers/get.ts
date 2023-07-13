// export an express get controller for the saleINvoice model

import { Request, Response } from "express";
import { SaleInvoice } from "../../../models";

export async function controllerGetInvoice(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const saleInvoice = await SaleInvoice.findById(id)
      .populate("customer").populate({ path: "paymentReceived.id", select: "paymentNumber customer" })
    if (!saleInvoice) {
      return res.status(404).json({ message: "SaleInvoice not found" });
    }
    return res.status(200).json(saleInvoice);
  }
  const saleInvoices = await SaleInvoice.find({})
    .populate("customer").populate({ path: "paymentReceived.id", select: "paymentNumber customer" }).sort({ updatedAt: -1 })
  return res.status(200).json(saleInvoices);
};

export async function controllerGetInvoiceByCustomerId(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const invoices = await SaleInvoice.find({ where: { customer: id } }).sort({ updatedAt: -1 });
    if (!invoices) {
      return res.status(404).json({ message: "SaleInvoice not found" });
    }
    return res.status(200).json(invoices);
  }
  return res.status(500).json({ message: "No ID provided" });
}
