import { Request, Response } from "express";
import path from "path";
import { PurchaseOrder } from "../../../models/purchaseOrder";
import { VendorBill } from "../../../models/VendorBill";
import { VendorBillPayment } from "../../../models/vendorBillPayment";
import { VendorCredit } from "../../../models/vendorCredit";
import { VendorExpense } from "../../../models/vendorExpense";
import { generateBillPDF } from "../../../utils/pdf-generation/generatePDF";
// import uploadFileToCloud from "../../../utils/uploadToCloud"
import putFile, { deleteFile, updateFile } from "../../../utils/s3"
import fs from 'fs';
import { RecurringExpense } from "../../../models/recurringExpense";
import { RecurringBill } from "../../../models/recurringBill";
import { VendorTimeline } from "../../../models/vendorTimeline";


export const vendorBilldelete = async(req: Request, res: Response) => {
  try {
    const vendorBill : any = await VendorBill.findById(req.params.id);

    if(!vendorBill){
      return res.status(404).json({ msg: "vendor bill not found" });
    }

    // DELETE FILE TO CLOUD 
    if(vendorBill?.fileInfos){
      await vendorBill?.fileInfos.forEach((f : any) => {
        if(f?.fileName){
          deleteFile(`${f?.fileName}`);
        }
      });
    }

    await VendorBill.findByIdAndDelete(req.params.id);

    await VendorTimeline.create({
      vendor: vendorBill?.vendor, 
      timelineType: "Bill Deleted",
      description: `Vendor Bill ${vendorBill?.billNo} Deleted`,
      // link: "",
    });

    // DELETE PDF TO CLOUD 
    await deleteFile(`${req.params.id}.pdf`);

    res.status(200).json({ msg: `${req.params.id} vendor bill has been deleted` });
    
  } catch (err) {
    res.status(500).json({ msg: "Server Error: Bill wasn't deleted" })
  }

}

export const vendorBillPaymentdelete = async(req: Request, res: Response) => {
  try {
    const vendorBillPayment : any = await VendorBillPayment.findById(req.params.id);

    if(!vendorBillPayment){
      return res.status(404).json({ msg: "vendor bill payment not found" });
    }

    // DELETE FILE TO CLOUD 
    if(vendorBillPayment?.fileInfos){
      await vendorBillPayment?.fileInfos.forEach((f : any) => {
        if(f?.fileName){
          deleteFile(`${f?.fileName}`);
        }
      });
    }

    await VendorBillPayment.findByIdAndDelete(req.params.id);

    await VendorTimeline.create({
      vendor: vendorBillPayment?.vendorId, 
      timelineType: "Bill Payment Deleted",
      description: `Vendor Bill Payment ${vendorBillPayment?.paymentNo} Deleted`,
      // link: "",
    });

    // DELETE FILE TO CLOUD 
    await deleteFile(`${req.params.id}.pdf`);

    res.status(200).json({ msg: `${req.params.id} vendor bill payment has been deleted` });
    
  } catch (err) {
    res.status(500).json({ msg: "Server Error: Bill payment wasn't deleted" })
  }

}

export const vendorPurchaseOrderdelete = async(req: Request, res: Response) => {
  try {

    const purchaseOrder : any = await PurchaseOrder.findById(req.params.id);

    if(!purchaseOrder){
      return res.status(404).json({ msg: "vendor purchase order not found" });
    }

    // DELETE FILE TO CLOUD 
    if(purchaseOrder?.fileInfos){
      await purchaseOrder?.fileInfos.forEach((f : any) => {
        if(f?.fileName){
          deleteFile(`${f?.fileName}`);
        }
      });
    }

    await PurchaseOrder.findByIdAndDelete(req.params.id);

    await VendorTimeline.create({
      vendor: purchaseOrder?.vendorId, 
      timelineType: "Purchase Order Deleted",
      description: `Vendor Purchase Order ${purchaseOrder?.purchaseOrderNo} Deleted`,
      // link: "",
    });

    // DELETE PDF TO CLOUD 
    await deleteFile(`${req.params.id}.pdf`);

    res.status(200).json({ msg: `${req.params.id} vendor purchase order has been deleted` });
    
  } catch (err) {
    res.status(500).json({ msg: "Server Error: purchase order wasn't deleted" })
  }

}

export const vendorExpensedelete = async(req: Request, res: Response) => {
  try {

    const vendorExpense : any = await VendorExpense.findById(req.params.id);

    if(!vendorExpense){
      return res.status(404).json({ msg: "vendor expense not found" });
    }

    // DELETE FILE TO CLOUD 
    if(vendorExpense?.fileInfos){
      await vendorExpense?.fileInfos.forEach((f : any) => {
        if(f?.fileName){
          deleteFile(`${f?.fileName}`);
        }
      });
    }

    await VendorExpense.findByIdAndDelete(req.params.id);

    await VendorTimeline.create({
      vendor: vendorExpense?.vendorId, 
      timelineType: "Expense Deleted",
      description: `Vendor Expense ${vendorExpense?.expenseAccount} Deleted`,
      // link: "",
    });

    // DELETE FILE TO CLOUD 
    // await deleteFile(`${req.params.id}.pdf`);

    res.status(200).json({ msg: `${req.params.id} vendor expense has been deleted` });
    
  } catch (err) {
    res.status(500).json({ msg: "Server Error: purchase order wasn't deleted" })
  }

}

export const vendorCreditdelete = async(req: Request, res: Response) => {
  try {

    const vendorCredit : any = await VendorCredit.findById(req.params.id);

    if(!vendorCredit){
      return res.status(404).json({ msg: "vendor credit not found" });
    }

    // DELETE FILE TO CLOUD 
    if(vendorCredit?.fileInfos){
      await vendorCredit?.fileInfos.forEach((f : any) => {
        if(f?.fileName){
          deleteFile(`${f?.fileName}`);
        }
      });
    }

    await VendorCredit.findByIdAndDelete(req.params.id);

    await VendorTimeline.create({
      vendor: vendorCredit?.vendorId, 
      timelineType: "Vendor Credit Deleted",
      description: `Vendor Credit ${vendorCredit?.creditOrder} Deleted`,
      // link: "",
    });

    // DELETE FILE TO CLOUD 
    await deleteFile(`${req.params.id}.pdf`);

    res.status(200).json({ msg: `${req.params.id} vendor credit has been deleted` });
    
  } catch (err) {
    res.status(500).json({ msg: "Server Error: vendor credit wasn't deleted" })
  }

}

export const vendorRecurringExpensedelete = async(req: Request, res: Response) => {
  try {

    const vendorRecurringExpense  = await RecurringExpense.findById(req.params.id);

    if(!vendorRecurringExpense){
      return res.status(404).json({ msg: "vendor recurring expense not found" });
    }

    await RecurringExpense.findByIdAndDelete(req.params.id);

    res.status(200).json({ msg: `${req.params.id} vendor recurring expense has been deleted` });
    
  } catch (err) {
    res.status(500).json({ msg: "Server Error: recurring expense wasn't deleted" })
  }

}

export const vendorRecurringBilldelete = async(req: Request, res: Response) => {
  try {

    const vendorRecurringBill  = await RecurringBill.findById(req.params.id);

    if(!vendorRecurringBill){
      return res.status(404).json({ msg: "vendor recurring bill not found" });
    }

    await RecurringBill.findByIdAndDelete(req.params.id);

    res.status(200).json({ msg: `${req.params.id} vendor recurring bill has been deleted` });
    
  } catch (err) {
    res.status(500).json({ msg: "Server Error: recurring bill wasn't deleted" })
  }

}

export const deleteVendorFile = async(req: Request, res: Response) => {
  try {

    await deleteFile(req.params.fileName);

    res.status(200).json({
      fileName: req.params.fileName,
      msg: `Deleted : ${req.params.fileName}` });
    
  } catch (err) {
    res.status(500).json({ msg: "file was NOT deleted" })
  }
}