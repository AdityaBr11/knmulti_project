import { Document, Schema, Types } from "mongoose";

interface Item {
  item: string;
  description: string;
  unitCost: string;
  quantity: string;
  amount: number;
}

interface IDeliveryChallan extends Document {
  challanDate: Date;
  discount: string;
  amount: number;
  challanType: string;
  customerNotes: string;
  termsAndConditions: string;
  items: Item[];
  deliveryChallan: string;
  reference: string;
  grandTotal: number;
  status: string;
  pdf_url: string;
  customer: Types.ObjectId; 
}

const deliveryChallanSchema = new Schema<IDeliveryChallan>(
  {
    challanDate: Date,
    discount: String,
    amount: Number,
    challanType: String,
    customerNotes: String,
    termsAndConditions: String,
    deliveryChallan: String,
    reference: String,
    grandTotal: Number,
    status: { type: String, default: 'DRAFT' },
    pdf_url: String,
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
  },
  { timestamps: true }
);

export { IDeliveryChallan, deliveryChallanSchema };
