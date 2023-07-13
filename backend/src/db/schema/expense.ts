// make an expense schema similar to invoice

import { Document, Schema, Types } from "mongoose";
import { Vendor } from "../../models";
import { Expense } from "../../models/expense";

interface Item {
  item: string;
  description: string;
  unitCost: number;
  quantity: number;
  amount: number;
}

interface IExpense extends Document {
  id: number;
  vendor: Types.ObjectId;
  tax: number;
  expenseDate: Date;
  expiryDate: Date;
  taxAmount: number;
  discount: number;
  tds: number;
  total: number;
  otherInformation: string;
  type: string;
  items: Item[];
  createdBy: Types.ObjectId;
  status: string;
}

const expenseSchema = new Schema<IExpense>(
  {
    _id: Number,
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor" },
    tax: Number,
    expenseDate: Date,
    expiryDate: Date,
    taxAmount: Number,
    discount: Number,
    total: Number,
    tds: Number,
    otherInformation: String,
    type: String,
    createdBy: { type: Schema.Types.ObjectId, ref: "Employee" },
    status: {
      type: String,
      default: "Pending",
    },
    items: [
      {
        item: String,
        description: String,
        unitCost: Number,
        quantity: Number,
        amount: Number,
      },
    ],
  },
  { _id: false, timestamps: true }
);

expenseSchema.pre("save", function (next) {
  if (this.isNew) {
    Expense.countDocuments({}, (err: any, count: any) => {
      if (err) return next(err);
      this._id = count + 1;
      Vendor.findByIdAndUpdate(this.vendor, {
        $push: { expenses: this._id },
      })
        .then(() => {
          next();
        })
        .catch(next);
      next();
    });
  } else {
    next();
  }
});

export { IExpense, expenseSchema };
