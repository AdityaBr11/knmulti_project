import { Document, Schema, Types } from "mongoose";
import { Vendor } from "../../models";
import { VendorCredit } from "../../models/vendorCredit";

interface IVendorCredit extends Document {
  vendorId: Types.ObjectId;
  creditOrder: string;
  orderNo: string;
  vendorCreditDate: Date;
  transaction: {
    itemDetails: string;
    account: string;
    quantity: number;
    unit: string;
    rate: number;
    discount: {discountType: string; discountValue: number;};
    amount: number;
  }[];
  vendorBill: {
    billId: Types.ObjectId;
    billNo: string;
    credit: number;
    date: Date;
  }[];
  subTotal: number;
  discount: {
    discountType: string;
    discountValue: number;
  };
  discountAccount: string;
  discountAmount: number;
  adjustment: {
    adjustmentName: string;
    adjustmentValue: number;
  };
  total: number;
  creditUsed: number;
  balance: number;
  notes: string;
  status: string;
  fileInfos: {
    fileName: string;
    filePath: string;
  }[];
  pdf_url?:string;
}

const vendorCreditSchema = new Schema<IVendorCredit>(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor" },
    creditOrder: String,
    orderNo: String,
    vendorCreditDate: Date,
    transaction: [{
      itemDetails: String,
      account: String,
      quantity: Number,
      unit: { type: String, default: "pcs." },
      rate: Number,
      amount: Number,
    }],
    vendorBill: [{
      billId: { type: Schema.Types.ObjectId, ref: "VendorBill" },
      billNo: String,
      credit: Number,
      date: Date
    }],
    subTotal: Number,
    discount: {
      discountType: String,
      discountValue: Number,
    },
    discountAccount: String,
    discountAmount: Number,
    adjustment: {
      adjustmentName: String,
      adjustmentValue: Number,
    },
    total: Number,
    creditUsed: Number,
    balance: Number,
    notes: String,
    status: String,
    fileInfos: [{
      fileName: String,
      filePath: String,
    }],
    pdf_url: String,
  },
  {
    timestamps: true
  }
);

// vendorCreditSchema.pre("save", function (next) {
//   if (this.isNew) {
//     VendorCredit.countDocuments({}, (err: any, count: any) => {
//       if (err) return next(err);
//       this._id = count + 1;
//       Vendor.findByIdAndUpdate(this.vendor, {
//         $push: {
//           vendorCredits: this._id,
//         },
//       })
//         .then(() => {
//           next();
//         })
//         .catch(next);
//     });
//   }
// });

export { IVendorCredit, vendorCreditSchema };
