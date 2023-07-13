import { Document, Schema, Types } from "mongoose";
import { SaleEstimate } from "../../models/saleEstimate";

interface Item {
  item: string;
  description: string;
  unitCost: string;
  quantity: string;
  amount: number;
}

interface ISaleEstimate extends Document {
  employee: Number;
  project: String;
  plot: String;
  tax: Types.ObjectId;
  invoiceId: Types.ObjectId;
  isInvoiced: boolean;
  estimateDate: Date;
  expiryDate: Date;
  taxAmount: number;
  discount: number;
  adjustment: number;
  amount: number;
  customerNotes: string;
  termsAndConditions: string;
  items: Item[];
  status: string;
  // 
  estimate: string;
  reference: string;
  subject: string;
  grandTotal: number;
  customer: Types.ObjectId; 
  pdf_url?:string;
  discountVarient: {
    discountType: string;
    discountValue: number;
  };
}

const saleEstimateSchema = new Schema(
  {
    employee: { type: Number, ref: "Employee" },
    project: { type: String, ref: "Project" },
    plot: {type: String, default: ""},
    tax: { type: Schema.Types.ObjectId, ref: "Tax" },
    invoiceId: { type: Schema.Types.ObjectId, ref: "SaleInvoice" },
    isInvoiced: { type: Boolean, default: false},
    estimateDate: Date,
    expiryDate: Date,
    taxAmount: Number,
    discount: Number,
    adjustment: Number,
    amount: Number,
    customerNotes: String,
    termsAndConditions: String,
    estimate: String,
    reference: String,
    subject: String,
    status: { type: String, default: 'OPEN' },
    grandTotal: Number,
    discountVarient: {
      discountType: String,
      discountValue: Number,
    },
    customer: { type: Schema.Types.ObjectId, ref: "Customer" },
    items: [
      {
        item: String,
        description: String,
        unitCost: String,
        quantity: String,
        amount: Number,
      },
    ],
    pdf_url: String,
  },
  { timestamps: true },
);

saleEstimateSchema.pre("save", function (next) {
  if (this.isNew) {
    SaleEstimate.countDocuments({}, (err: any, count: any) => {
      if (err) return next(err);
      this._id = count + 1;
      next();
    });
  } else next();
});

export { ISaleEstimate, saleEstimateSchema };
