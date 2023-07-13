import { Document, Schema, Types } from "mongoose";
import { SplitStock } from "../../models/splitStock";

interface IStock extends Document {
  itemDetails: string;
  stockNo: string;
  quantity: number;
  leftQuantity: number;
  consumedQuantity: number;
  unit: string;
  billStatus: string;
  purpose: string;
  vendorId: Types.ObjectId;
  billId: Types.ObjectId;
  date: Date;
  projectId: Types.ObjectId;
}

const stockSchema = new Schema<IStock>(
  {
    itemDetails: String,
    stockNo: String,
    quantity: Number,
    leftQuantity: Number,
    consumedQuantity: { type: Number, default: 0 },
    unit: { type: String, default: "pcs." },
    billStatus: String,
    purpose: String,
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
    },
    billId: {
      type: Schema.Types.ObjectId,
      ref: "VendorBill",
    },
    date: Date,
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    }
  }, {
    toJSON: { virtuals : true },
    toObject: { virtuals : true }
  }
);

// stockSchema.pre("remove", async function(next){
//   const res = await SplitStock.deleteMany({ stockId : this._id });
//   console.log(res);
//   next();
// })

// stockSchema.virtual("splitStocks", {
//   ref: "SplitStock",
//   localField: "_id",
//   foreignField: "stockId",
//   justOne: false
// });

export { IStock, stockSchema };
