import { Document, Schema, Types } from "mongoose";
import { CustomerTimeline } from "../../models/customerTimeline";

interface Address {
  attention: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipcode: string;
  Pzipcode: string;
  Pstate: string;  
  Pcity: string;
}

interface contactPersons {
  firstName: string;
  lastName: string;
  email: string;
  workPhone: string;
  phone: string;
}

interface comments {
  employee: number;
  comment: String;
  date: Date;
}

type invoiceId = Types.ObjectId 

interface ICustomer extends Document {
  customerType: string;
  customerId: string;
  salutation: string;
  isChecked:string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  workPhone: string;
  phone: string;
  companyName: string;
  website: string;
  pan: string;
  gst: string;
  openingBalance: number;
  paidBalance: number;
  withholdingTax: number;
  facebook: string;
  twitter: string;
  remarks: string;
  currentAssigned: number;
  createdBy: number;
  billingAddress: Address;
  shippingAddress: Address;
  contactPersons: Array<contactPersons>;
  invoices: Array<invoiceId>;
  lead: Types.ObjectId;
  comments: [comments];
  // not sure about these
  address: string;
  creditNotes: number[];
  description: string;
  project: Types.ObjectId[];
}

const customerSchema = new Schema<ICustomer>(
  {
    customerType: String,
    salutation: String,
  isChecked:String,
    firstName: String,
    lastName: String,
    displayName: String,
    email: String,
    workPhone: String,
    phone: String,
    companyName: String,
    website: String,
    pan: String,
    gst: String,
    openingBalance: { type: Number, default: 0 },
    paidBalance: { type: Number, default: 0 },
    withholdingTax: { type: Number, default: 0 },
    facebook: String,
    twitter: String,
    remarks: String,
    currentAssigned: { type: Number, ref: "Employee" },
    createdBy: { type: Number, ref: "Employee" },
    billingAddress: {
      attention: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      zipcode: String,
      phone: String,
      Pzipcode: String,
      Pstate: String,  
      Pcity:  String, 
    },
    shippingAddress: {
      attention: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      zipcode: String,
      phone: String,
      Pstate: String, 
      Pcity:  String,  
    },
    lead: { type: Schema.Types.ObjectId, ref: "Lead" },
    contactPersons: [
      {
        firstName: String,
        lastName: String,
        email: String,
        workPhone: String,
        phone: String,      
      },
    ],
    comments: [{
      employee: { type: Number, ref: "Employee" },
      comment: String,
      date: Date,
    }],
//  not sure about these
    creditNotes: [{ type: Number, ref: "CreditNote" }],
    invoices: [
      { type: Schema.Types.ObjectId, ref: "SaleInvoice" },
    ],
    description: String,
    project: [{ type: Schema.Types.ObjectId, ref: "Project" }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

customerSchema.pre("remove", async function (next) {
  // console.log(`Timeline being removed from customer ${this?._id}`);
  await CustomerTimeline.deleteMany({ customer: this._id });
  next();
})

// Reverse populate with virtuals 
customerSchema.virtual('timeline', {
  ref: 'CustomerTimeline',
  localField: '_id',
  foreignField: 'customer',
  justOne: false
});

export { ICustomer, customerSchema };
