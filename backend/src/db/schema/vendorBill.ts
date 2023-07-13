import { Document, Schema, Types } from "mongoose";
import { VendorBill } from "../../models/VendorBill";
import { generateBillPDF } from "../../utils/pdf-generation/generatePDF";
import putFile, { deleteFile } from "../../utils/s3";
import fs from 'fs';
import { Stock } from "../../models/stock";

interface IVendorBill extends Document {
  vendorId : Types.ObjectId;
  billNo: string;
  orderNo: string;
  billDate: Date;
  dueDate: Date;
  paymentTerms: string;
  projectId: Types.ObjectId;
  discountType: string;
  transaction: {
    itemDetails: string;
    account: string;
    quantity: number;
    unit: string;
    rate: number;
    discount: {discountType: string; discountValue: number;};
    customerDetails: Types.ObjectId;
    amount: number;
  }[];
  subTotal: number;
  discount: {
    discountType: string;
    discountValue: number;
  };
  discountAccount: string;
  discountAmount: number;
  taxSystem: string;
  tcsTax: Types.ObjectId;
  taxType: string;
  taxAmount: number;
  adjustment: {
    adjustmentName: string;
    adjustmentValue: number;
  };
  total: number;
  credit: number;
  payments: number;
  balanceDue: number;
  status: string;
  notes: string;
  recurrBill?: Types.ObjectId;
  fileInfos: {
    fileName: string;
    filePath: string;
  }[];
  pdf_url?:string;
}


const vendorBillSchema = new Schema<IVendorBill>(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor" },
    billNo: String,
    orderNo: String,
    billDate: Date,
    dueDate: Date,
    paymentTerms: String,
    projectId: { type: Schema.Types.ObjectId, ref: "Project" },
    discountType: String,
    transaction: [{
      itemDetails: String,
      account: String,
      quantity: Number,
      unit: { type: String, default: "pcs." },
      rate: Number,
      discount: {discountType: String, discountValue: Number,},
      customerDetails: { type: Schema.Types.ObjectId, ref: "Vendor" },
      amount: Number,
    }],
    subTotal: Number,
    discount: {
      discountType: String,
      discountValue: Number,
    },
    discountAccount: String,
    discountAmount: Number,
    taxSystem: String,
    tcsTax: { type: Schema.Types.ObjectId, ref: "Tax" },
    taxType: String,
    taxAmount: Number,
    adjustment: {
      adjustmentName: String,
      adjustmentValue: Number,
    },
    total: Number,
    credit: { type : Number, default: 0},
    payments: { type : Number, default: 0},
    balanceDue: Number,
    status: String,
    notes: String,
    recurrBill: { type: Schema.Types.ObjectId, ref: "RecurringBill" },
    fileInfos: [{
      fileName: String,
      filePath: String,
    }],
    pdf_url : String,
  },
  {
    timestamps: true
  }
);

// vendorBillSchema.post("updateOne", function(next){
//   if(this.balanceDue <= 0){
//     this.status = "PAID";
//   }
//   console.log(this);
//   next();
// })



// vendorBillSchema.pre("updateOne", async function(next){
//     // UPLOAD FILE TO CLOUD 
    
//     const uploadedVendorBill = await VendorBill.findOne({_id : this._id}).populate({path: "vendorId", select: "name billAddress"});
  
//     await deleteFile(`${uploadedVendorBill._id}.pdf`);
  
//     const pathToFile : any = await generateBillPDF(uploadedVendorBill.toJSON());
//     const file = await fs.readFileSync(pathToFile);
//     // console.log(pathToFile);
//     await putFile(file, `${uploadedVendorBill._id}.pdf` );

//     await VendorBill.findByIdAndUpdate(this._id , {pdf_url : `https://knmulti.fra1.digitaloceanspaces.com/${uploadedVendorBill._id}.pdf`})

//     await fs.rmSync(pathToFile);

//   next();
// });

vendorBillSchema.post("save", async function(){
  if(this?.transaction?.length){
    let billtrx = this?.transaction;
    let updatedBilltrx = billtrx?.map(bt => {
      const upbt = {
        itemDetails: bt.itemDetails,
        stockNo: `STK-${Math.ceil(Math.random()*100000)}`,
        quantity: bt?.quantity,
        leftQuantity: bt?.quantity,
        unit: bt?.unit,
        vendorId: this?.vendorId,
        billId: this?._id,
        date: this?.billDate,
        projectId: this?.projectId
      }
      return upbt;
    });
    
    // const updtedBillWithTrx = { ...updatedBillData, transaction : updatedBilltrx }
    // setBillData(updtedBillWithTrx);

    const ustockData = [ ...updatedBilltrx ];

    const resArr = ustockData;
    // resArr.forEach(async (stk : any) => {
    //   const stock = await Stock.create(stk);
    //   // console.log(stock);
    // });

    await Stock.insertMany([ ...resArr ]);

    // const res = await httpService.post('/stock/billstock', ustockData);
    // await toast.success("Stock added");
  }

  // Stock

  if(this?.pdf_url === undefined || ""){
    // UPLOAD FILE TO CLOUD 
    const uploadedVendorBill = await VendorBill.findOne({_id : this._id}).populate({path: "vendorId", select: "name billAddress"});
  
    const pathToFile : any = await generateBillPDF(uploadedVendorBill.toJSON());
    const file = await fs.readFileSync(pathToFile);
    // console.log(pathToFile);
    await putFile(file, `${uploadedVendorBill._id}.pdf` );

    await VendorBill.findByIdAndUpdate(this._id , {pdf_url : `https://knmulti.fra1.digitaloceanspaces.com/${uploadedVendorBill._id}.pdf`})

    await fs.rmSync(pathToFile);
  }


  // next();
});

// vendorBillSchema.post("save", async function(next){
//   if(this?.pdf_url === undefined || ""){
//     // UPLOAD FILE TO CLOUD 
//     const uploadedVendorBill = await VendorBill.findOne({_id : this._id}).populate({path: "vendorId", select: "name billAddress"});
  
//     const pathToFile : any = await generateBillPDF(uploadedVendorBill.toJSON());
//     const file = await fs.readFileSync(pathToFile);
//     // console.log(pathToFile);
//     await putFile(file, `${uploadedVendorBill._id}.pdf` );

//     await VendorBill.findByIdAndUpdate(this._id , {pdf_url : `https://knmulti.fra1.digitaloceanspaces.com/${uploadedVendorBill._id}.pdf`})

//     await fs.rmSync(pathToFile);
//   }
//   next();
// });


export { IVendorBill, vendorBillSchema }