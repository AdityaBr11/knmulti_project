import { Request, Router } from "express";


import { deleteVendorFile, vendorBilldelete, vendorBillPaymentdelete, vendorCreditdelete, vendorExpensedelete, vendorPurchaseOrderdelete, vendorRecurringBilldelete, vendorRecurringExpensedelete } from "./controllers/delete";
import { getCreditofBill, getPatmentofBill, getRecurringBill, getRecurringExpense, getVendorBillPayment, getVendorBills, getVendorCredit, getVendorExpense, getVendorPurchaseOrder } from "./controllers/get";
import { uploadVendorFile, vendorBillPaymentPost, vendorBillPost, vendorCreditPost, vendorExpensePost, vendorPurchaseOrderPost, vendorRecurringBillPost, vendorRecurringExpensePost } from "./controllers/post";
import { vendorBillPaymentPut, vendorBillPut, vendorCreditPut, vendorCreditToBills, vendorExpensePut, vendorPurchaseOrderPut, vendorRecurringBillPut, vendorRecurringExpensePut } from "./controllers/put";

const vendorTransaction = Router();

// const multer = require("multer");
// import { FileFilterCallback } from "multer";

// type DestinationCallback = (error: Error | null, destination: string) => void
// type FileNameCallback = (error: Error | null, filename: string) => void

// const storage = multer.diskStorage({
//   destination: function(req: Request, file: Express.Multer.File, cb : DestinationCallback) {
//     cb(null, './src/uploads/');
//   },
//   filename: function(req: Request, file: Express.Multer.File, cb: FileNameCallback) {
//     cb(null, `purchasefile_${Math.ceil(Math.random() * 1000000)}_${file.originalname}`);
//   }
// });

// const fileFilter = (
//   req: Request,
//   file: Express.Multer.File,
//   cb : FileFilterCallback
// ): void => {
//   if(
//     file.mimetype === 'image/jpeg' ||
//     file.mimetype === 'image/png' 
//   ) {
//     cb(null, true)
//   } else {
//     cb(null, false)
//   }
// }


// const upload = multer({ storage : storage, fileFilter: fileFilter });
// const upload = multer({ storage : storage });


// bills 
vendorTransaction.get('/getvendorbills', getVendorBills);
vendorTransaction.post('/createvendorbill', vendorBillPost);
vendorTransaction.put('/updatevendorbill/:id', vendorBillPut);
vendorTransaction.delete('/removevendorbill/:id', vendorBilldelete);

// bill Payment 
vendorTransaction.get('/getvendorbillpayment', getVendorBillPayment);
vendorTransaction.get('/getpaymentofbill', getPatmentofBill);
vendorTransaction.post('/createvendorbillpayment', vendorBillPaymentPost);
vendorTransaction.put('/updatevendorbillpayment/:id', vendorBillPaymentPut);
vendorTransaction.delete('/removevendorbillpayment/:id', vendorBillPaymentdelete);

// expense 
vendorTransaction.get('/getvendorexpense', getVendorExpense);
vendorTransaction.post('/createvendorexpense', vendorExpensePost);
vendorTransaction.put('/updatevendorexpense/:id', vendorExpensePut);
vendorTransaction.delete('/removevendorexpense/:id', vendorExpensedelete);

// Purchase Order 
vendorTransaction.get('/getvendorpurchaseorder', getVendorPurchaseOrder);
vendorTransaction.post('/createpurchaseorder', vendorPurchaseOrderPost);
vendorTransaction.put('/updatepurchaseorder/:id', vendorPurchaseOrderPut);
vendorTransaction.delete('/removepurchaseorder/:id', vendorPurchaseOrderdelete);

// Vendor Credit
vendorTransaction.get('/getvendorcredit', getVendorCredit);
vendorTransaction.post('/createvendorcredit', vendorCreditPost);
vendorTransaction.put('/updatevendorcredit/:id', vendorCreditPut);
vendorTransaction.delete('/removevendorcredit/:id', vendorCreditdelete);

vendorTransaction.put('/updatevendorcredittobills/:id', vendorCreditToBills);
vendorTransaction.get('/getcreditofbill', getCreditofBill);

// Recurring Expense 
vendorTransaction.get('/getrecurringexpense', getRecurringExpense);
vendorTransaction.post('/createrecurringexpense', vendorRecurringExpensePost);
vendorTransaction.put('/updaterecurringexpense/:id', vendorRecurringExpensePut);
vendorTransaction.delete('/removerecurringexpense/:id', vendorRecurringExpensedelete);

// Recurring Bill 
vendorTransaction.get('/getrecurringbill', getRecurringBill);
vendorTransaction.post('/createrecurringbill', vendorRecurringBillPost);
vendorTransaction.put('/updaterecurringbill/:id', vendorRecurringBillPut);
vendorTransaction.delete('/removerecurringbill/:id', vendorRecurringBilldelete);

// Upload File 
// vendorTransaction.post('/upload', upload.single('file'), uploadVendorFile);
vendorTransaction.post('/upload', uploadVendorFile);
vendorTransaction.delete('/removefile/:fileName', deleteVendorFile);

export default vendorTransaction;