// create an express get controller for the salePayment model

import { Request, Response } from "express";
import { SalePayment } from "../../../models/salePayment";

export default async function controllerGet(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const salePayment = await SalePayment.findById(id)
      .populate("customer")
      .populate("invoice");
    if (!salePayment) {
      return res.status(404).json({ message: "SalePayment not found" });
    }
    return res.status(200).json(salePayment);
  }
  const salePayments = await SalePayment.find(req.query)
    .populate('customer')
    .populate("invoice").sort({ updatedAt: -1 })
  return res.status(200).json(salePayments);
}


export const getPatmentofInv = async (req: Request, res: Response) => { 
  try {
    
    const { customerId, customerInv }  = req.query;
    const customerInvPayment = await SalePayment.find({ customer : customerId }).populate({path: "customer", select: "displayName billAddress email"}).sort({ updatedAt: -1 });
    
    const customerInvPaymentOfBill = customerInvPayment.filter(cInv => {
      const customerInvIds = cInv.invoice.map(cInv => cInv.id);
      const bool = customerInvIds.filter(cInvId => cInvId.toString() == (customerInv as any).toString()).length > 0;
      
      return bool;
    });
    res.status(200).json(customerInvPaymentOfBill);
    
  } catch (err) {
    res.status(500).json({ msg: "Server error cannot fetch payments of invoice" });
  }
}