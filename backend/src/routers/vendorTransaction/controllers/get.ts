import { Types } from "mongoose";
import { Request, Response } from "express";
import { PurchaseOrder } from "../../../models/purchaseOrder";
import { RecurringBill } from "../../../models/recurringBill";
import { RecurringExpense } from "../../../models/recurringExpense";
import { VendorBill } from "../../../models/VendorBill";
import { VendorBillPayment } from "../../../models/vendorBillPayment";
import { VendorCredit } from "../../../models/vendorCredit";
import { VendorExpense } from "../../../models/vendorExpense";

export const getVendorBills = async (req: Request, res: Response) => {
  try {
    const vendorBills = await VendorBill.find(req.query).populate({path: "vendorId", select: "name billAddress email"}).populate({ path: "projectId", select: "name" }).sort({ updatedAt: 1 });

    res.status(200).json(vendorBills);
    
  } catch (err) {
    res.status(500).json({ msg: "Server error cannot fetch vendor's bills" });
  }
}

export const getVendorBillPayment = async (req: Request, res: Response) => {
  try {
    const vendorBillPayment = await VendorBillPayment.find(req.query).populate({path: "vendorId", select: "name billAddress email"}).sort({ updatedAt: 1 });

    res.status(200).json(vendorBillPayment);
    
  } catch (err) {
    res.status(500).json({ msg: "Server error cannot fetch vendor's bill payments" });
  }
}

export const getPatmentofBill = async (req: Request, res: Response) => { 
  try {
    
    const { vendorId, vendorBill }  = req.query;
    const vendorBillPayment = await VendorBillPayment.find({ vendorId }).populate({path: "vendorId", select: "name billAddress email"}).sort({ updatedAt: 1 });
    
    const vendorBillPaymentOfBill = vendorBillPayment.filter(vb => {
      const vendorBillIds = vb.vendorBill.map(vb => vb._id);
      const bool = vendorBillIds.filter(vbId => vbId.toString() === (vendorBill as any).toString()).length > 0;
      
      return bool;
    });
    res.status(200).json(vendorBillPaymentOfBill);
    
  } catch (err) {
    res.status(500).json({ msg: "Server error cannot fetch payments of bill" });
  }
}

export const getVendorExpense = async (req: Request, res: Response) => {
  try {
    const vendorExpense = await VendorExpense.find(req.query).populate({path: "vendorId", select: "name email billAddress"}).populate({path: "customerId", select: "displayName billingAddress email"}).sort({ updatedAt: 1 });

    res.status(200).json(vendorExpense);
    
  } catch (err) {
    res.status(500).json({ msg: "Server error cannot fetch vendor's Expenses" });
  }
}

export const getVendorPurchaseOrder = async (req: Request, res: Response) => {
  try {
    const purchaseOrder = await PurchaseOrder.find(req.query).populate({path: "vendorId", select: "name billAddress email"}).populate({path: "customerId", select: "displayName billingAddress email shippingAddress"}).populate({ path: "projectId", select: "name" }).sort({ updatedAt: 1 });

    res.status(200).json(purchaseOrder);
    
  } catch (err) {
    res.status(500).json({ msg: "Server error cannot fetch vendor's Purchase Order" });
  }
}

export const getVendorCredit = async (req: Request, res: Response) => {
  try {
    const vendorCredit = await VendorCredit.find(req.query).populate({path: "vendorId", select: "name billAddress email"}).sort({ updatedAt: 1 });

    res.status(200).json(vendorCredit);
    
  } catch (err) {
    res.status(500).json({ msg: "Server error cannot fetch vendor's Credit" });
  }
}

export const getCreditofBill = async (req: Request, res: Response) => { 
  try {
    
    const { vendorId, vendorBill }  = req.query;
    const vendorCredit = await VendorCredit.find({ vendorId }).populate({path: "vendorId", select: "name billAddress email"}).sort({ updatedAt: 1 });
    
    const vendorCreditOfBill = vendorCredit.filter(vb => {
      const vendorBillIds = vb.vendorBill.map(vb => vb?.billId);

      const bool = vendorBillIds.filter(vbId => vbId.toString() === (vendorBill as any).toString()).length > 0;
      
      return bool;
    });
    res.status(200).json(vendorCreditOfBill);
    
  } catch (err) {
    res.status(500).json({ msg: "Server error cannot fetch credits of bill" });
  }
}

export const getRecurringExpense = async (req: Request, res: Response) => {
  try {
    const recurringExpense = await RecurringExpense.find(req.query).populate({path: "vendorId", select: "name billAddress email"}).populate({path: "customerId", select: "displayName billingAddress email"}).populate({ path: "projectId", select: "name" }).populate({ path: "projectId", select: "name" }).sort({ updatedAt: 1 });

    res.status(200).json(recurringExpense);
    
  } catch (err) {
    res.status(500).json({ msg: "Server error cannot fetch vendor's Recurring Expenses" });
  }
}

export const getRecurringBill = async (req: Request, res: Response) => {
  try {
    const recurringBill = await RecurringBill.find(req.query).populate({path: "vendorId", select: "name billAddress email"}).populate({ path: "projectId", select: "name billingAddress email" }).sort({ updatedAt: 1 });

    res.status(200).json(recurringBill);
    
  } catch (err) {
    res.status(500).json({ msg: "Server error cannot fetch vendor's Recurring Bill" });
  }
}