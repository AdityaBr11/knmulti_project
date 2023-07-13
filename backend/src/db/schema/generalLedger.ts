import { Document, Schema, Types } from "mongoose";

enum CURRENCY {
  INR = "INR",
  USD = "USD"
}

interface IGenralLedger extends Document {
  date : Date;
  journalId : string;
  referenceId : string;
  notes : string;
  journalType : string;
  currency : CURRENCY;
  category: string;
  clientName: {
    userId: string;
    name: string
  };
  employee: number;
  customer: Types.ObjectId;
  vendor: Types.ObjectId;
  transaction : {
    date : Date;
    description: string;
    // contact: string;
    debits: number;
    credits: number
  }[];
  total: number
}

const generalLedgerSchema = new Schema<IGenralLedger>(
  {
    date : { 
      type: Date
    },
    journalId : {
      type: String,
      required: [true, "please add journal Id"]
    },
    referenceId: String,
    notes : String,
    journalType: String,
    currency: {
      type: String,
      default: CURRENCY.INR,
      enum: Object.values(CURRENCY)
    },
    category: String,
    clientName: {
      userId: String,
      name: String
    },
    employee: { type: Number, ref: "Employee" },
    customer: { type: Schema.Types.ObjectId, ref: "Customer" },
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor" },
    transaction : [{
      date: Date,
      description: String,
      // contact: String,
      debits: Number,
      credits: Number
    }],
    total: Number
  }, {
    timestamps: true
  }
);

export { IGenralLedger, generalLedgerSchema };