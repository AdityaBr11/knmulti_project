import { Document, Schema, Types } from "mongoose";
import { SaleInvoice, Customer } from "../../models";
import { Employee } from "../../models/employee";

interface Item {
  item: string;
  description: string;
  unitCost: string;
  quantity: string;
  amount: number;
}

interface CreditDetails {
  id: Types.ObjectId;
  credited: number;
}

interface PaymentReceived {
  id: Types.ObjectId;
  payment: string;
  paymentMode: string;
  amount: number;
}
// todo: add population function for credit notes
interface ISaleInvoice extends Document {
  amount: number;
  customer: Types.ObjectId;
  customerNotes: string;
  discount: string;
  dueDate: Date;
  employee: Number;
  project: Types.ObjectId;
  plot: String;
  grandTotal: number;
  paidAmount: number;
  withholdingTax: number;
  balance: number;
  invoice: string;
  invoiceDate: Date;
  expense: Types.ObjectId;
  estimate: Types.ObjectId;
  salesOrder: Types.ObjectId;
  deliveryChallan: Types.ObjectId;
  items: Item[];
  credits: number;
  creditDetails: [CreditDetails];
  paymentReceived: [PaymentReceived];
  pdf_url: String;
  orderNumber: string;
  termsAndConditions: string;
  terms: string;
  adjustments: number;
  taxType: string;
  taxationAmount: number;
  taxationPercentage: number;
  tcsTax: Types.ObjectId;
  tdsType: string;
  status: string;
  discountVarient: {
    discountType: string;
    discountValue: number;
  };
  //
}

const saleInvoiceSchema = new Schema<ISaleInvoice>(
  {
    employee: { type: Number, ref: "Employee" },
    project: { type: Schema.Types.ObjectId, ref: "Project" },
    plot: {type: String, default: ""},
    invoiceDate: Date,
    dueDate: Date,
    discount: String,
    amount: Number,
    terms: String,
    customerNotes: String,
    orderNumber: String,
    termsAndConditions: String,
    invoice: String,
    grandTotal: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    pdf_url: String,
    withholdingTax: { type: Number, default: 0 },
    balance: Number,
    paymentReceived: [
      {
        id: { type: Schema.Types.ObjectId, ref: "SalePayment" },
        payment: String,
        paymentMode: String,
        amount: Number,
      },
    ],
    adjustments: Number,
    taxType: String, 
    taxationAmount: Number,
    taxationPercentage: Number,
    tcsTax: { type: Schema.Types.ObjectId, ref: "Tax" },
    tdsType: String,
    expense: { type: Schema.Types.ObjectId, ref: "VendorExpense" },
    estimate: { type: Schema.Types.ObjectId, ref: "saleEstimate" },
    salesOrder: { type: Schema.Types.ObjectId, ref: "saleOrder" },
    deliveryChallan: { type: Schema.Types.ObjectId, ref: "deliveryChallan" },
    customer: { type: Schema.Types.ObjectId, ref: "Customer" },
    credits: { type: Number, default: 0 },
    discountVarient: {
      discountType: String,
      discountValue: Number,
    },
    creditDetails: [
      {
        id: { type: Schema.Types.ObjectId, ref: "CreditNotes" },
        credited: Number,
      },
    ],
    items: [
      {
        item: String,
        description: String,
        unitCost: String,
        quantity: String,
        amount: Number,
      },
    ],
    status: { type: String, default: "OPEN" },
  },
  { timestamps: true }
);

saleInvoiceSchema.pre("save", async function (next) {
  this.balance = this.grandTotal;
  next();
});

export { ISaleInvoice, saleInvoiceSchema };
