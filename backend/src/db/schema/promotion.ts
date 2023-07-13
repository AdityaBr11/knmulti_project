import { Document, Schema, Types } from "mongoose";

interface IPromotion extends Document {
  employee: number;
  previousPosition: Types.ObjectId;
  newPosition: Types.ObjectId;
  startDate: Date;
}

const promotionSchema = new Schema<IPromotion>(
  {
    employee: { type: Number, ref: "Employee" },
    previousPosition: { type: Schema.Types.ObjectId, ref: "Position" },
    newPosition: { type: Schema.Types.ObjectId, ref: "Position" },
    startDate: Date,
  },
  {
    timestamps: true,
  }
);

export { IPromotion, promotionSchema };
