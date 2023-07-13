import { Request, Response } from "express";
import path from "path";
import { PurchaseOrder } from "../../../models/purchaseOrder";
import { VendorBill } from "../../../models/VendorBill";
import { VendorBillPayment } from "../../../models/vendorBillPayment";
import { VendorCredit } from "../../../models/vendorCredit";
import { VendorExpense } from "../../../models/vendorExpense";
import { generateBillPDF, generatePurchaseMadePDF, generatePurchaseOrderPDF, generateVendorCreditPDF} from "../../../utils/pdf-generation/generatePDF";
// import uploadFileToCloud from "../../../utils/uploadToCloud"
import putFile from "../../../utils/s3"
import fs from 'fs';
import fileUpload, { UploadedFile } from "express-fileupload";
import { RecurringExpense } from "../../../models/recurringExpense";
import { RecurringBill } from "../../../models/recurringBill";
import { calculateNextTime } from "../../../utils/nextTime";
import moment from "moment";
import { VendorTimeline } from "../../../models/vendorTimeline";


export const vendorBillPost = async(req: Request, res: Response) => {
  try {
    const vendorBill : any = await VendorBill.create(req.body);
    // UPLOAD FILE TO CLOUD 
    // const uploadedVendorBill = await VendorBill.findOne({_id : vendorBill._id}).populate({path: "vendorId", select: "name billAddress"});
  
    // const pathToFile : any = await generateBillPDF(uploadedVendorBill.toJSON());
    // const file = await fs.readFileSync(pathToFile);
    // // console.log(pathToFile);
    // await putFile(file, `${uploadedVendorBill._id}.pdf` );

    // await VendorBill.updateOne({_id : vendorBill._id} , {pdf_url : `https://knmulti.fra1.digitaloceanspaces.com/${uploadedVendorBill._id}.pdf`})

    // await fs.rmSync(pathToFile);

    await VendorTimeline.create({
      vendor: vendorBill?.vendor, 
      timelineType: "Bill Created",
      description: `Vendor Bill ${vendorBill?.billNo} Created`,
      // link: "",
    });

    res.status(200).json(vendorBill);
    
  } catch (err) {
    console.log(err);
    // console.log(err?.message);
    res.status(500).json({ msg: "Server Error: Bill wasn't created" })
  }

}


export const vendorBillPaymentPost = async(req: Request, res: Response) => {
  try {
    const vendorBillPayment : any = await VendorBillPayment.create(req.body);

    // UPLOAD FILE TO CLOUD 
    const uploadedVendorBillPayment = await VendorBillPayment.findOne({_id : vendorBillPayment._id}).populate({path: "vendorId", select: "name billAddress email"});

    await VendorTimeline.create({
      vendor: uploadedVendorBillPayment?.vendorId?._id, 
      timelineType: "Bill Payment Created",
      description: `Vendor Bill Payment ${uploadedVendorBillPayment?.paymentNo} Created`,
      // link: "",
    });
  
    const pathToFile : any = await generatePurchaseMadePDF(uploadedVendorBillPayment.toJSON());
    const file = await fs.readFileSync(pathToFile);
    // console.log(pathToFile);
    await putFile(file, `${uploadedVendorBillPayment._id}.pdf` );

    await VendorBillPayment.updateOne({_id : vendorBillPayment._id} , {pdf_url : `https://knmulti.fra1.digitaloceanspaces.com/${uploadedVendorBillPayment._id}.pdf`})

    await fs.rmSync(pathToFile);

    res.status(200).json({...vendorBillPayment._doc , pdf_url : `https://knmulti.fra1.digitaloceanspaces.com/${uploadedVendorBillPayment._id}.pdf` });
    
  } catch (err) {
    res.status(500).json({ msg: "Server Error: Bill Payment cannot be processed" })
  }

}

export const vendorExpensePost = async(req: Request, res: Response) => {
  try {
    const vendorExpense = await VendorExpense.create(req.body);

    await VendorTimeline.create({
      vendor: vendorExpense?.vendorId, 
      timelineType: "Expense Created",
      description: `Vendor Expense ${vendorExpense?.expenseAccount} Created`,
      // link: "",
    });

    res.status(200).json(vendorExpense);
    
  } catch (err) {
    res.status(500).json({ msg: "Server Error: Expense Data wasn't able to stored" });
  }

}

export const vendorPurchaseOrderPost = async(req: Request, res: Response) => {
  try {
    const purchaseOrder : any = await PurchaseOrder.create(req.body);
    // UPLOAD FILE TO CLOUD 
    console.log(purchaseOrder,"purchaseOrder");
    const uploadedpurchaseOrder = await PurchaseOrder.findOne({_id : purchaseOrder._id}).populate({path: "vendorId", select: "name billAddress email"}).populate({path: "customerId", select: "displayName shippingAddress billingAddress"});

    await VendorTimeline.create({
      vendor: uploadedpurchaseOrder?.vendorId?._id, 
      timelineType: "Purchase Order Created",
      description: `Vendor Purchase Order ${uploadedpurchaseOrder?.purchaseOrderNo} Created`,
      // link: "",
    });
  
    const pathToFile : any = await generatePurchaseOrderPDF(uploadedpurchaseOrder.toJSON());
    const file = await fs.readFileSync(pathToFile);
    // console.log(pathToFile);
    await putFile(file, `${uploadedpurchaseOrder._id}.pdf` );

    await PurchaseOrder.updateOne({_id : purchaseOrder._id} , {pdf_url : `https://knmulti.fra1.digitaloceanspaces.com/${uploadedpurchaseOrder._id}.pdf`})
    
    await fs.rmSync(pathToFile);
    res.status(200).json({...purchaseOrder._doc , pdf_url : `https://knmulti.fra1.digitaloceanspaces.com/${uploadedpurchaseOrder._id}.pdf` });
    console.log(pathToFile,"pdf_url");
    // res.status(200).json(purchaseOrder);
    
  } catch (err) {
    res.status(500).json({ msg: "Server Error: Purchase Order Data wasn't able to stored" });
  }

}

export const vendorCreditPost = async(req: Request, res: Response) => {
  try {
    const vendorCredit : any = await VendorCredit.create(req.body);

    // res.status(200).json(vendorCredit);

    // UPLOAD FILE TO CLOUD 
    const uploadedVendorCredit = await VendorCredit.findOne({_id : vendorCredit._id}).populate({path: "vendorId", select: "name billAddress"});

    await VendorTimeline.create({
      vendor: uploadedVendorCredit?.vendorId?._id, 
      timelineType: "Vendor Credit Created",
      description: `Vendor Credit ${uploadedVendorCredit?.creditOrder} Created`,
      // link: "",
    });
  
    const pathToFile : any = await generateVendorCreditPDF(uploadedVendorCredit.toJSON());
    const file = await fs.readFileSync(pathToFile);
    // console.log(pathToFile);
    await putFile(file, `${uploadedVendorCredit._id}.pdf` );

    await VendorCredit.updateOne({_id : vendorCredit._id} , {pdf_url : `https://knmulti.fra1.digitaloceanspaces.com/${uploadedVendorCredit._id}.pdf`});

    await fs.rmSync(pathToFile);

    res.status(200).json({...vendorCredit._doc , pdf_url : `https://knmulti.fra1.digitaloceanspaces.com/${uploadedVendorCredit._id}.pdf` });
    
  } catch (err) {
    res.status(500).json({ msg: "Server Error: Vendor Credit Data wasn't able to stored" });
  }

}

export const vendorRecurringExpensePost = async(req: Request, res: Response) => {
  try {
    const vendorRecurringExpense = await RecurringExpense.create(req.body);
    let today = moment().format("YYYY-MM-DD");
    let expStart = moment(vendorRecurringExpense?.expenseStartDate).format("YYYY-MM-DD");
    if(expStart == today){
      const vendorExpense = {
        expenseDate: today,
        expenseAccount : vendorRecurringExpense?.expenseAccount,
        expenseAmount: vendorRecurringExpense?.expenseAmount,
        paymentThrough: vendorRecurringExpense?.paymentThrough,
        vendorId: vendorRecurringExpense?.vendorId,
        notes: vendorRecurringExpense?.notes,
        customerId: vendorRecurringExpense?.customerId,
        isBillable: vendorRecurringExpense?.isBillable,
        projectId: vendorRecurringExpense?.projectId,
        markUpBy: vendorRecurringExpense?.markUpBy,
        status: vendorRecurringExpense?.isBillable ? "UNBILLED" : "NON-BILLABLE",
        recurrExp: vendorRecurringExpense?._id
      }

      await VendorExpense.create(vendorExpense);
    }

    res.status(200).json(vendorRecurringExpense);
    
  } catch (err) {
    res.status(500).json({ msg: "Server Error: Recurring Expense Data wasn't able to stored" });
  }

}

export const vendorRecurringBillPost = async(req: Request, res: Response) => {
  try {
    const vendorRecurringBill = await RecurringBill.create(req.body);
    let today = moment().format("YYYY-MM-DD");
    let billStart = moment(vendorRecurringBill?.billStartDate).format("YYYY-MM-DD");
    if(billStart == today){
      const vendorBill = {
        vendorId : vendorRecurringBill?.vendorId,
        projectId: vendorRecurringBill?.projectId,
        billNo: `BL-${Math.ceil(Math.random()*100000)}`,
        orderNo: `OD-${Math.ceil(Math.random()*100000)}`,
        billDate : vendorRecurringBill?.billStartDate,
        paymentTerms : vendorRecurringBill?.paymentTerms,
        discountType : vendorRecurringBill?.discountType,
        transaction : vendorRecurringBill?.transaction,
        subTotal: vendorRecurringBill?.subTotal,
        discount: vendorRecurringBill?.discount,
        discountAccount: vendorRecurringBill?.discountAccount,
        discountAmount : vendorRecurringBill?.discountAmount,
        taxSystem : vendorRecurringBill?.taxSystem,
        taxType : vendorRecurringBill?.taxType,
        taxAmount: vendorRecurringBill?.taxAmount,
        adjustment: vendorRecurringBill?.adjustment,
        total : vendorRecurringBill?.total,
        balanceDue: vendorRecurringBill?.total,
        status: "OPEN",
        notes: vendorRecurringBill?.notes,
        recurrBill: vendorRecurringBill?._id
      }
      await VendorBill.create(vendorBill);
    }

    res.status(200).json(vendorRecurringBill);
    
  } catch (err) {
    res.status(500).json({ msg: "Server Error: Recurring Bill Data wasn't able to stored" });
  }

}

// export const uploadVendorFileUp = async(req: Request, res: Response) => {
//   try { 

//     if(req.files === null){
//       return res.status(400).json({ msg: 'No file uploaded' });
//     }

//     const file = req.files?.file as fileUpload.UploadedFile;

//     const fileName = `purchasefile_${Date.now()}_${file?.name}`;

//     file?.mv(`${__dirname}/${fileName}`, err => {
//       console.error(err);
//       return
//     });
    
    
//     await putFile(`${__dirname}/${fileName}`, `${fileName}`, file );

//     fs?.unlink(`${__dirname}/${fileName}`, (err => {
//       if(err) { console.log(err)
//         return
//       }
//       else {
//         console.log("Folder file Deleted");
//       }
//     }));

//     res.status(200).json({ fileName: fileName, filePath: `https://knmulti.fra1.digitaloceanspaces.com/${fileName}` });
    
//   } catch (err) {
//     res.status(500).json({ msg: "Server Error: File was not uploaded" });
//   }

// }

export const uploadVendorFile = async(req: any, res: Response) => {
  try {
    // if(req.file === null){
    //   return res.status(400).json({ msg: 'No file uploaded' });
    // }

    // const fileName = req.file.filename;

    // const pathToFile = req.file.path;

    // const fileD = await fs.readFileSync(pathToFile);

    // await putFile(fileD, `${req.file.filename}` );

    // await fs.rmSync(pathToFile);

    // res.status(200).json({ fileName: fileName, filePath: `https://knmulti.fra1.digitaloceanspaces.com/${fileName}` });

    if (!req.files?.file) {
      return res.status(400).send({
        message: "No file was uploaded",
      });
    }

    const fileName = `purchasefile_${Math.ceil(Math.random() * 1000000)}_${(req.files!.file as UploadedFile).name}`

    const file = await putFile(
      (req.files!.file as UploadedFile).data,
      fileName,
      (req.files!.file as UploadedFile)
    );

    if (!file) {
      res.status(500).json({
        message: "Error uploading file",
      });
    }

    res.status(200).json({ fileName: fileName, 
      filePath: `https://knmulti.fra1.digitaloceanspaces.com/${fileName}` });
    
  } catch (err) {
    res.status(500).json({ msg: "Server Error: File was not uploaded" });
  }
}