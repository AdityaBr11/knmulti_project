import { Request, Response } from "express";
import path from "path";
import { PurchaseOrder } from "../../../models/purchaseOrder";
import { VendorBill } from "../../../models/VendorBill";
import { VendorBillPayment } from "../../../models/vendorBillPayment";
import { VendorCredit } from "../../../models/vendorCredit";
import { VendorExpense } from "../../../models/vendorExpense";
import { generateBillPDF, generatePurchaseMadePDF, generatePurchaseOrderPDF, generateVendorCreditPDF } from "../../../utils/pdf-generation/generatePDF";
// import uploadFileToCloud from "../../../utils/uploadToCloud"
import putFile, { deleteFile, updateFile } from "../../../utils/s3"
import fs from 'fs';
import { RecurringExpense } from "../../../models/recurringExpense";
import { RecurringBill } from "../../../models/recurringBill";
import { VendorTimeline } from "../../../models/vendorTimeline";
import moment from "moment";


export const vendorBillPut = async(req: Request, res: Response) => {
  try {
    const vendorBill : any = await VendorBill.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // If only related files are added 
    if(req.body.fileInfos){

      return res.status(200).json(vendorBill);

    } else {

      await VendorTimeline.create({
        vendor: vendorBill?.vendor, 
        timelineType: "Bill Updated",
        description: `Vendor Bill ${vendorBill?.billNo} Updated`,
        // link: "",
      });
      
      // UPLOAD FILE TO CLOUD 
      const uploadedVendorBill = await VendorBill.findOne({_id : vendorBill._id}).populate({path: "vendorId", select: "name billAddress"});
  
      await deleteFile(`${uploadedVendorBill._id}.pdf`);
    
      const pathToFile : any = await generateBillPDF(uploadedVendorBill.toJSON());
      const file = await fs.readFileSync(pathToFile);
      // console.log(pathToFile);
      await putFile(file, `${uploadedVendorBill._id}.pdf` );
  
      await VendorBill.findByIdAndUpdate(vendorBill._id, {pdf_url : `https://knmulti.fra1.digitaloceanspaces.com/${uploadedVendorBill._id}.pdf`})
  
      await fs.rmSync(pathToFile);
  
      // await updateFile(VendorBill, vendorBill, {path: "vendorId", select: "name billAddress"});
  
      res.status(200).json({...vendorBill._doc , pdf_url : `https://knmulti.fra1.digitaloceanspaces.com/${uploadedVendorBill._id}.pdf` });
    }
    
  } catch (err) {
    res.status(500).json({ msg: "Server Error: Bill wasn't created" })
  }

}

export const vendorBillPaymentPut = async(req: Request, res: Response) => {
  try {
    const vendorBillPayment : any = await VendorBillPayment.findByIdAndUpdate(req.params.id, req.body, { new : true });

    // If only related files are added 
    if(req.body.fileInfos){

      return res.status(200).json(vendorBillPayment);

    } else {

      await VendorTimeline.create({
        vendor: vendorBillPayment?.vendorId, 
        timelineType: "Bill Payment Updated",
        description: `Vendor Bill Payment ${vendorBillPayment?.paymentNo} Updated`,
        // link: "",
      });
      
      // UPLOAD FILE TO CLOUD 
      const uploadedVendorBillPay = await VendorBillPayment.findOne({_id : vendorBillPayment._id}).populate({path: "vendorId", select: "name billAddress"});
  
      await deleteFile(`${uploadedVendorBillPay._id}.pdf`);
    
      const pathToFile : any = await generatePurchaseMadePDF(uploadedVendorBillPay.toJSON());
      const file = await fs.readFileSync(pathToFile);
      // console.log(pathToFile);
      await putFile(file, `${uploadedVendorBillPay._id}.pdf` );
  
      await VendorBillPayment.updateOne({_id : vendorBillPayment._id} , {pdf_url : `https://knmulti.fra1.digitaloceanspaces.com/${uploadedVendorBillPay._id}.pdf`})
  
      await fs.rmSync(pathToFile);

  
      res.status(200).json({...vendorBillPayment._doc , pdf_url : `https://knmulti.fra1.digitaloceanspaces.com/${uploadedVendorBillPay._id}.pdf` });
    }
    
  } catch (err) {
    res.status(500).json({ msg: "Server Error: Bill Payment cannot be Updated" })
  }

}

export const vendorExpensePut = async(req: Request, res: Response) => {
  try {
    const vendorExpense = await VendorExpense.findByIdAndUpdate(req.params.id, req.body, { new : true });

    await VendorTimeline.create({
      vendor: vendorExpense?.vendorId, 
      timelineType: "Expense Updated",
      description: `Vendor Expense ${vendorExpense?.expenseAccount} Updated`,
      // link: "",
    });

    res.status(200).json(vendorExpense);
    
  } catch (err) {
    res.status(500).json({ msg: "Server Error: Expense Data wasn't Updated" });
  }

}

export const vendorPurchaseOrderPut = async(req: Request, res: Response) => {
  try {
    const purchaseOrder : any = await PurchaseOrder.findByIdAndUpdate(req.params.id, req.body, { new : true });

    // If only related files are added 
    if(req.body.fileInfos){

      return res.status(200).json(purchaseOrder);

    } else {

      await VendorTimeline.create({
        vendor: purchaseOrder?.vendorId, 
        timelineType: "Purchase Order Updated",
        description: `Vendor Purchase Order ${purchaseOrder?.purchaseOrderNo} Updated`,
        // link: "",
      });
      
      // UPLOAD FILE TO CLOUD 
      const uploadedpurchaseOrder = await PurchaseOrder.findOne({_id : purchaseOrder._id}).populate({path: "vendorId", select: "name billAddress"}).populate({path: "customerId", select: "displayName shippingAddress"});
  
      await deleteFile(`${uploadedpurchaseOrder._id}.pdf`);
    
      const pathToFile : any = await generatePurchaseOrderPDF(uploadedpurchaseOrder.toJSON());
      const file = await fs.readFileSync(pathToFile);
      // console.log(pathToFile);
      await putFile(file, `${uploadedpurchaseOrder._id}.pdf` );
  
      await PurchaseOrder.updateOne({_id : purchaseOrder._id} , {pdf_url : `https://knmulti.fra1.digitaloceanspaces.com/${uploadedpurchaseOrder._id}.pdf`})
  
      await fs.rmSync(pathToFile);
  
      // await updateFile(purchaseOrder, purchaseOrder, {path: "vendorId", select: "name billAddress"});
  
      res.status(200).json({...purchaseOrder._doc , pdf_url : `https://knmulti.fra1.digitaloceanspaces.com/${uploadedpurchaseOrder._id}.pdf` });
    }
    
  } catch (err) {
    res.status(500).json({ msg: "Server Error: Purchase Order Data wasn't able to update" });
  }

}

export const vendorCreditPut = async (req: Request, res: Response) => {
  try {
    const vendorCredit : any = await VendorCredit.findByIdAndUpdate(req.params.id, req.body, { new : true });

    // res.status(200).json(vendorCredit);

    // If only related files are added 
    if(req.body.fileInfos){

      return res.status(200).json(vendorCredit);

    } else {

      await VendorTimeline.create({
        vendor: vendorCredit?.vendorId, 
        timelineType: "Vendor Credit Updated",
        description: `Vendor Credit ${vendorCredit?.creditOrder} Updated`,
        // link: "",
      });
      
      // UPLOAD FILE TO CLOUD 
      const uploadedVendorCredit = await VendorCredit.findOne({_id : vendorCredit._id}).populate({path: "vendorId", select: "name billAddress"});
  
      await deleteFile(`${uploadedVendorCredit._id}.pdf`);
    
      const pathToFile : any = await generateVendorCreditPDF(uploadedVendorCredit.toJSON());
      const file = await fs.readFileSync(pathToFile);
      // console.log(pathToFile);
      await putFile(file, `${uploadedVendorCredit._id}.pdf` );
      // console.log(vendorCredit._id);
      await VendorCredit.updateOne({_id : vendorCredit._id} , {pdf_url : `https://knmulti.fra1.digitaloceanspaces.com/${uploadedVendorCredit._id}.pdf`})
  
      await fs.rmSync(pathToFile);
  
      // await updateFile(purchaseOrder, purchaseOrder, {path: "vendorId", select: "name billAddress"});
  
      res.status(200).json({...vendorCredit._doc , pdf_url : `https://knmulti.fra1.digitaloceanspaces.com/${uploadedVendorCredit._id}.pdf` });
    }
    
  } catch (err) {
    res.status(500).json({ msg: "Server Error: Credit Data wasn't Updated" });
  }
}

export const vendorRecurringExpensePut = async(req: Request, res: Response) => {
  try {
    const vendorRecurringExpense = await RecurringExpense.findByIdAndUpdate(req.params.id, req.body, { new : true });

    res.status(200).json(vendorRecurringExpense);
    
  } catch (err) {
    res.status(500).json({ msg: "Server Error: Recurring Expense Data wasn't Updated" });
  }

}

export const vendorRecurringBillPut = async(req: Request, res: Response) => {
  try {
    const vendorRecurringBill = await RecurringBill.findByIdAndUpdate(req.params.id, req.body, { new : true });

    res.status(200).json(vendorRecurringBill);
    
  } catch (err) {
    res.status(500).json({ msg: "Server Error: Recurring Bill Data wasn't Updated" });
  }
}

export const vendorCreditToBills = async(req: Request, res: Response) => {
  try {
    const creditToBillList = req.body;

    creditToBillList.forEach(async(ele : any) => {
      // await VendorBill.updateOne({_id : ele.id}, {credit : ele.creditPay, balanceDue : ele.balance}); 
      let vendorBill : any;
      if(Number(ele.balance) == 0){
        vendorBill = await VendorBill.findByIdAndUpdate(ele.id, {credit : ele.creditPay, balanceDue : ele.balance, status: "PAID"}, { new: true });
      }else{

        vendorBill = await VendorBill.findByIdAndUpdate(ele.id, {credit : ele.creditPay, balanceDue : ele.balance, status: "PARTIAL"}, { new: true });
      }

      // UPLOAD FILE TO CLOUD 
      const uploadedVendorBill = await VendorBill.findOne({_id : vendorBill._id}).populate({path: "vendorId", select: "name billAddress"});
  
      await deleteFile(`${uploadedVendorBill._id}.pdf`);
    
      const pathToFile : any = await generateBillPDF(uploadedVendorBill.toJSON());
      const file = await fs.readFileSync(pathToFile);
      // console.log(pathToFile);
      await putFile(file, `${uploadedVendorBill._id}.pdf` );
  
      await VendorBill.findByIdAndUpdate(vendorBill._id, {pdf_url : `https://knmulti.fra1.digitaloceanspaces.com/${uploadedVendorBill._id}.pdf`})
  
      await fs.rmSync(pathToFile);
    });

    const vendorCredit = await VendorCredit.findById(req.params.id);
    // const prevBillList = await [...vendorCredit?.vendorBill] || [];
    const prevBillList = vendorCredit?.vendorBill.length ? [ ...vendorCredit?.vendorBill ] : [];
    const billList = creditToBillList.map((ele : any) => ({billId : ele?.id, billNo: ele?.billNo, credit: ele?.creditPay, date: moment().format("YYYY-MM-DD")}));
    const updatedVendorCredit = await VendorCredit.findByIdAndUpdate(req.params.id, { vendorBill : [ ...prevBillList, ...billList ] }, { new : true });

    res.status(200).json(updatedVendorCredit);

  } catch (err) {
    res.status(500).json({ msg: "Server Error: Bill Credit Data wasn't Updated" });
  }
}