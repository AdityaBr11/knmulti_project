import { Document, Schema, Types } from "mongoose";
import { Stock } from "../../models/stock";

interface ISplitStock extends Document {
  stockId: Types.ObjectId;
  vendorId: Types.ObjectId;
  splitStockdate: Date;
  splitStockNo: string;
  projectId: Types.ObjectId;
  usedQuantity: number;
  consumedQuantity: number;
  LeftQuantity: number;
  referenceNo: string;
  purpose: string;
  notes: string;
  stockUsed: number;
}

const splitStockSchema = new Schema<ISplitStock>(
  {
    stockId: {
      type: Schema.Types.ObjectId,
      ref: "Stock",
    },
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
    },
    splitStockdate: Date,
    splitStockNo: String,
    projectId: { type : Schema.Types.ObjectId, ref: "Project" },
    usedQuantity: Number,
    consumedQuantity: Number,
    LeftQuantity: Number,
    referenceNo: String,
    purpose: String,
    notes: String,
    stockUsed: Number,
  }
);

splitStockSchema.pre("save", async function(next){
  const stk = await Stock.findById(this.stockId);
  if(stk){
    await Stock.findByIdAndUpdate(this.stockId, { leftQuantity : (stk?.leftQuantity - this.stockUsed) });
  }
  next();
});

splitStockSchema.pre("remove", async function(next){
  const stk = await Stock.findById(this.stockId);
  if(stk){
    const res = await Stock.findByIdAndUpdate(this.stockId, {leftQuantity : (stk?.leftQuantity + this.usedQuantity) });
  }
  next();
})

export { ISplitStock, splitStockSchema };