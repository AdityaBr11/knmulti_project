import { Document, Schema, Types } from "mongoose";
import { Vendor } from "../../models";
import { Expense } from "../../models/expense";
import { Bill } from "../../models/bill";

interface IBill extends Document {
  id: number;
  vendor: Types.ObjectId;
  expense: Types.ObjectId;
  paymentDate: Date;
  amount: number;
  paymentMode: string;
  createdBy: number;
}

const billSchema = new Schema<IBill>(
  {
    _id: Number,
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor" },
    expense: { type: Schema.Types.ObjectId, ref: "Expense" },
    paymentDate: Date,
    amount: Number,
    paymentMode: String,
    createdBy: { type: Number, ref: "Employee" },
  },
  {
    timestamps: true,
    _id: false,
  }
);

billSchema.pre("save", function (next) {
  if (this.isNew) {
    Bill.countDocuments({}, async (err: any, count: any) => {
      if (err) return next(err);
      this._id = count + 1;
      await Expense.findByIdAndUpdate(this.expense, { status: "Paid" }).catch(
        next
      );
      Vendor.findByIdAndUpdate(this.vendor, {
        $push: {
          bills: this._id,
        },
      })
        .then(() => {
          next();
        })
        .catch(next);
    });
  }
});

export { IBill, billSchema };
