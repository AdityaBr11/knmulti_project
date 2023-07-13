import { Document, Schema, Types } from "mongoose";
import { calculateNextTime } from "../../utils/nextTime";

interface IRecurringBill extends Document {
  vendorId : Types.ObjectId;
  projectId: Types.ObjectId;
  profileName: string;
  repeatEvery: {
    repeatNumber: number;
    repeatUnit: string;
  };
  billStartDate: Date;
  billEndDate: Date;
  billNextDate: Date;
  neverExpire: boolean;
  paymentTerms: string;
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
  taxType: string;
  taxAmount: number;
  adjustment: {
    adjustmentName: string;
    adjustmentValue: number;
  };
  total: number;
  balanceDue: number;
  status: string;
  notes: string;
}


const recurringBillSchema = new Schema<IRecurringBill>(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor" },
    projectId: { type: Schema.Types.ObjectId, ref: "Project" },
    profileName: String,
    repeatEvery: {
      repeatNumber: Number,
      repeatUnit: String
    },
    billStartDate: Date,
    billEndDate: Date,
    billNextDate: Date,
    neverExpire: Boolean,
    paymentTerms: String,
    discountType: String,
    transaction: [{
      itemDetails: String,
      account: String,
      quantity: Number,
      unit: { type: String, default: "pcs." },
      rate: Number,
      discount: {discountType: String, discountValue: Number,},
      customerDetails: { type: Schema.Types.ObjectId, ref: "Customer" },
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
    taxType: String,
    taxAmount: Number,
    adjustment: {
      adjustmentName: String,
      adjustmentValue: Number,
    },
    total: Number,
    balanceDue: Number,
    status: String,
    notes: String,
  },
  {
    timestamps: true
  }
);

recurringBillSchema.pre("save", async function(next){
  const nextTime = calculateNextTime(this.billStartDate, this.repeatEvery.repeatNumber, this.repeatEvery.repeatUnit);
  this.billNextDate = nextTime as any;
  next();
})


export { IRecurringBill, recurringBillSchema }