import { Document, Schema, Types } from "mongoose";
import { SaleInvoice } from "../../models";

interface invoice {
  id: Types.ObjectId;
  paidAmount: number;
  withholdingTax: number;
  invoiceNumber: string,
  invoiceDate: Date;
  invoiceAmount: number;
}

interface ISalePayment extends Document {
  invoice: Array<invoice>;
  customer: Types.ObjectId;
  paymentDate: Date;
  paymentAmount: number;
  paymentMode: string;
  TdsTaxAcc: string;
  amountReceived: number;
  bankCharges: number;
  depositTo: string;
  excessAmount: number;
  // unUsedAmount: number;
  ifTax: boolean;
  notes: string;
  paymentNumber: string;
  reference: string;
  withholdingTax: number;
  pdf_url: string;
}

const salePaymentSchema = new Schema<ISalePayment>(
  {
    invoice: [{ 
      id: {type: Schema.Types.ObjectId, ref: "SaleInvoice" },
      paidAmount: { type: Number, default: 0 },
      withholdingTax: { type: Number, default: 0 },
      invoiceNumber: String,
      invoiceDate: Date,
      invoiceAmount: Number,
    }],
    customer: { type: Schema.Types.ObjectId, ref: "Customer" },
    paymentDate: Date,
    paymentAmount: Number,
    paymentMode: String,
    TdsTaxAcc: String,
    amountReceived: Number,
    bankCharges: { type: Number, default: 0 },
    depositTo: String,
    excessAmount: { type: Number, default: 0 },
    // unUsedAmount: { type: Number, default: 0 },
    ifTax: Boolean,
    notes: String,
    paymentNumber: String,
    reference: String,
    pdf_url: String,
    withholdingTax: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export { ISalePayment, salePaymentSchema };