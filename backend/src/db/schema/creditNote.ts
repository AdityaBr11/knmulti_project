import { Document, Schema, Types } from "mongoose";
import { CreditNote, Customer } from "../../models";

interface Item {
  item: string;
  description: string;
  unitCost: string;
  quantity: string;
  amount: number;
}

interface InoviceDetails {
  id: Types.ObjectId;
  credited: number;
}

interface ICreditNote extends Document {
  customer: Types.ObjectId;
  creditDate: Date;
  creditNote: string;
  customerNotes: string;
  discount: string;
  grandTotal: number;
  items: Item[];
  amount: number;
  reference: string;
  subject: string;
  taxAmount: number;
  pdf_url: string;
  status: string;
  creditUsed: number;
  balance: number;
  tax: Types.ObjectId;
  invoiceDetails: [InoviceDetails];
  termsAndConditions: string;
  associatedInvoice: number;
  employee: number;
  discountVarient: {
    discountType: string;
    discountValue: number;
  };
}
//  todo: add population function for invoice
const creditNoteSchema = new Schema<ICreditNote>(
  {
    customer: { type: Schema.Types.ObjectId, ref: "Customer" },
    creditDate: Date,
    creditNote: String,
    customerNotes: String,
    discount: String,
    grandTotal: Number,
    amount: Number,
    status: { type: String, default: "OPEN" },
    taxAmount: Number,
    items: [
      {
        item: String,
        description: String,
        unitCost: String,
        quantity: String,
        amount: Number,
      },
    ],
    reference: String,
    creditUsed: { type: Number, default: 0 },
    balance: { type: Number },
    subject: String,
    tax: { type: Schema.Types.ObjectId, ref: "Tax" },
    invoiceDetails: [
      {
        id: { type: Schema.Types.ObjectId, ref: "SaleInvoice" },
        credited: Number,
      },
    ],
    pdf_url: String,
    termsAndConditions: String,
    associatedInvoice: {
      type: Number,
      ref: "SaleInvoice",
    },
    employee: {
      type: Number,
      ref: "Employee",
    },
    discountVarient: {
      discountType: String,
      discountValue: Number,
    },
  },
  {
    timestamps: true,
  }
);

// creditNoteSchema.pre("save", function (next) {
//   if (this.isNew) {
//     CreditNote.countDocuments({}, async (err: any, count: any) => {
//       if (err) {
//         return next(err);
//       }
//       this.id = count + 1;
//       Customer.findByIdAndUpdate(this.customer, {
//         $push: {
//           creditNotes: this.id,
//         },
//       })
//         .then(() => {
//           next();
//         })
//         .catch(next);
//     });
//   } else next();
// });

export { ICreditNote, creditNoteSchema };
