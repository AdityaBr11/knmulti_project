import { Document, Schema, Types } from "mongoose";

interface Item {
  item: string;
  description: string;
  unitCost: string;
  quantity: string;
  amount: number;
}

interface IRecurringInvoice extends Document {
  adjustments: number;
  amount: number;
  customer: Types.ObjectId;
  customerNotes: string;
  discount: string;
  employee: number;
  endDate: Date;
  frequencyUnit: string;
  frequency: number;
  grandTotal: number;
  items: Item[];
  neverExpires: boolean;
  orderNumber: string;
  project: Types.ObjectId;
  profileName: string;
  startDate: Date;
  nextDate: Date;
  termsAndConditions: string;
  childInvoices: [Types.ObjectId];
  status: string;
  discountVarient: {
    discountType: string;
    discountValue: number;
  };
  //
  paidAmount: number;
  withholdingTax: number;
  terms: string;
}

const recurringInvoiceSchema = new Schema<IRecurringInvoice>(
  {
    employee: { type: Number, ref: "Employee" },
    startDate: Date,
    nextDate: Date,
    endDate: Date,
    discount: String,
    amount: Number,
    terms: String,
    customerNotes: String,
    orderNumber: String,
    termsAndConditions: String,
    profileName: String,
    project: { type: Schema.Types.ObjectId, ref: "Project" },
    grandTotal: Number,
    paidAmount: { type: Number, default: 0 },
    withholdingTax: { type: Number, default: 0 },
    adjustments: Number,
    frequencyUnit: String,
    frequency: Number,
    status: { type: String, default: "ACTIVE" },
    neverExpires: { type: Boolean, default: false },
    customer: { type: Schema.Types.ObjectId, ref: "Customer" },
    discountVarient: {
      discountType: String,
      discountValue: Number,
    },
    items: [
      {
        item: String,
        description: String,
        unitCost: String,
        quantity: String,
        amount: Number,
      },
    ],
    childInvoices: [
      {
        id: { type: Schema.Types.ObjectId, ref: "SaleInvoice", default: "" },
      },
    ],
  },
  { timestamps: true }
);

export { IRecurringInvoice, recurringInvoiceSchema };
