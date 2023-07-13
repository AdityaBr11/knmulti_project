import { Document, Schema, Types } from "mongoose";
import { VendorBill } from "../../models/VendorBill";
import { generateBillPDF } from "../../utils/pdf-generation/generatePDF";
import putFile, { deleteFile } from "../../utils/s3";
import fs from 'fs';
import { VendorBillPayment } from "../../models/vendorBillPayment";

interface IVendorBillPayment extends Document {
  vendorId : Types.ObjectId;
  paymentNo: string;
  paymentMade: number;
  paymentDate: Date;
  paymentMode: string;
  paymentThrough: string;
  referenceId: string;
  vendorBill: {
    _id: Types.ObjectId;
    billNo: string;
    dueDate: Date; 
    billDate: Date;
    total: number;
    balanceDue: number;
    billPaymentDate: Date;
    billPaymentAmount: number;
    purchaseOrder: string;
  }[];
  amountPaid: number;
  totalPaymentAmount: number;
  amountRefunded: number;
  amountExcess: number;
  notes: string;
  fileInfos: {
    fileName: string;
    filePath: string;
  }[];
  pdf_url?:string;
}

const vendorBillPaymentSchema = new Schema<IVendorBillPayment>({
  vendorId: { type: Schema.Types.ObjectId, ref: "Vendor" },
  paymentNo: String,
  paymentMade: Number,
  paymentDate: Date,
  paymentMode: String,
  paymentThrough: String,
  referenceId: String,
  vendorBill: [{
    _id: { type: Schema.Types.ObjectId, ref: "VendorBill" },
    billNo: String,
    dueDate: Date, 
    billDate: Date,
    total: Number,
    balanceDue: Number,
    billPaymentDate: Date,
    billPaymentAmount: Number,
    purchaseOrder: String,
  }],
  amountPaid: Number,
  totalPaymentAmount: Number,
  amountRefunded: Number,
  amountExcess: Number,
  notes: String,
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

vendorBillPaymentSchema.pre("save", function (next) {
  if (this.isNew) {
    VendorBillPayment.countDocuments({}, (err: any, count: any) => {
      if (err) return next(err);
      this.paymentNo = `PYM-${Math.ceil(Math.random()*100000)}`;
      next();
    });
  } else next();
});

vendorBillPaymentSchema.pre("save", async function(next){
  try {
    
    if(this.vendorBill){
      this.vendorBill.forEach(async (vb) => {
        const vendorBill = await VendorBill.findById(vb._id);

        if(vb.billPaymentAmount != 0){
          let paymade = (vendorBill?.payments || 0) + vb.billPaymentAmount;
          let bal = (vendorBill?.balanceDue || 0) - vb.billPaymentAmount;

          if(vb.balanceDue <= 0){
            await VendorBill.findByIdAndUpdate(vb._id, { balanceDue: bal, payments: paymade, status: "PAID" }, { new: true });
          } else{
            await VendorBill.findByIdAndUpdate(vb._id, { balanceDue: bal, payments: paymade, status: "PARTIAL" }, { new: true });
          }

          // UPLOAD FILE TO CLOUD 
        const uploadedVendorBill = await VendorBill.findOne({_id : vb._id}).populate({path: "vendorId", select: "name billAddress"});
    
        await deleteFile(`${uploadedVendorBill._id}.pdf`);
      
        const pathToFile : any = await generateBillPDF(uploadedVendorBill.toJSON());
        const file = await fs.readFileSync(pathToFile);
        // console.log(pathToFile);
        await putFile(file, `${uploadedVendorBill._id}.pdf` );
    
        await VendorBill.findByIdAndUpdate(vb._id, {pdf_url : `https://knmulti.fra1.digitaloceanspaces.com/${uploadedVendorBill._id}.pdf`})
    
        await fs.rmSync(pathToFile);
        }
      })
    }
    next();
  } catch (err) {
    console.log(err);
  }
});

export { IVendorBillPayment, vendorBillPaymentSchema }