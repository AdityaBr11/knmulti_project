// Vendor schema is similar to customer schema.

import { Document, Schema, Types } from "mongoose";
import { Vendor } from "../../models";
import { VendorTimeline } from "../../models/vendorTimeline";

interface IVendor extends Document {
  name: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: number;
  mobile: number;
  website: string;
  vendorType: string;
  otherDetails: {
    pan: string;
    gst: string;
    openingBalance: number;
    paymentTerms: string;
    tds: string;
    currency: string;  
  };
  billAddress: {
    attention: string;
    address: string;
    city: string;
    state: string;
    pincode: number;
    country: string;
    phone: number;  
  };
  shipAddress: {
    attention: string;
    address: string;
    city: string;
    state: string;
    pincode: number;
    country: string;
    phone: number;  
  };
  personContact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: number;
    mobile: number;
  }[],
  comments: {
    comment: string;
    date: Date;
    createdBy: number;
  }[],
  projectList: Types.ObjectId[];
  vendorCredits: number[];
  expenses: number[];
  bills: number[];
  description: string;
  
  fileInfos: {
    fileName: string;
    filePath: string;
  }[];
}

const vendorSchema = new Schema<IVendor>(
  {
    name: String,
    firstName: String,
    lastName: String,
    company: String,
    email: String,
    phone: Number,
    mobile: Number,
    website: String,
    vendorType: String,
    otherDetails: {
      pan: String,
      gst: String,
      openingBalance: Number,
      paymentTerms: String,
      tds: String,
      currency: String
    },
    billAddress: {
      attention: String,
      address: String,
      city: String,
      state: String,
      pincode: Number,
      country: String,
      phone: Number
    },
    shipAddress: {
      attention: String,
      address: String,
      city: String,
      state: String,
      pincode: Number,
      country: String,
      phone: Number
    },
    personContact: [{
      firstName: String,
      lastName: String,
      email: String,
      phone: Number,
      mobile: Number
    }],
    comments: [{
      comment: String,
      date: Date,
      createdBy: { type: Number, ref: "Employee" },
    }],
    vendorCredits: [{ type: Number, ref: "VendorCredit" }],
    projectList: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    expenses: [{ type: Number, ref: "Expense" }],
    bills: [{ type: Number, ref: "Bill" }],
    description: String,
    fileInfos: [{
      fileName: String,
      filePath: String,
    }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

vendorSchema.pre("remove", async function (next) {
  console.log(`Timeline being removed from vendor ${this?._id}`);
  await VendorTimeline.deleteMany({ vendor: this._id });
  next();
})

// Reverse populate with virtuals 
vendorSchema.virtual('timeline', {
  ref: 'VendorTimeline',
  localField: '_id',
  foreignField: 'vendor',
  justOne: false
});

export { IVendor, vendorSchema };
