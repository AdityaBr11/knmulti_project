import { Document, Schema, Types } from "mongoose";

interface Item {
  item: string;
  description: string;
  unitCost: string;
  quantity: string;
  amount: number;
}

interface ISalesOrder extends Document {
  employee: Number;
  project: String;
  orderDate: Date;
  shipmentDate: Date;
  delivery: string;
  discount: string;
  amount: number;
  paymentTerms: string;
  customerNotes: string;
  termsAndConditions: string;
  items: Item[];
  status: string;
  isInvoiced: boolean;
  pdf_url: string;
  // 
  salesOrder: string;
  reference: string;
  grandTotal: number;
  customer: Types.ObjectId; 
  //
  discountVarient: {
    discountType: string;
    discountValue: number;
  };
}

const salesOrderSchema = new Schema<ISalesOrder>(
  {
    employee: { type: Number, ref: "Employee" },
    project: { type: String, ref: "Project" },
    delivery: String,
    orderDate: Date,
    shipmentDate: Date,
    discount: String,
    amount: Number,
    paymentTerms: String,
    customerNotes: String,
    termsAndConditions: String,
    salesOrder: String,
    pdf_url: String,
    reference: String,
    grandTotal: Number,
    discountVarient: {
      discountType: String,
      discountValue: Number,
    },
    status: { type: String, default: 'OPEN' },
    isInvoiced: { type: Boolean, default: false },
    customer:  { type: Schema.Types.ObjectId, ref: "Customer" },
    items: [
      {
        item: String,
        description: String,
        unitCost: String,
        quantity: String,
        amount: Number,
      },
    ],
  },
  { timestamps: true }
);

export { ISalesOrder, salesOrderSchema };
