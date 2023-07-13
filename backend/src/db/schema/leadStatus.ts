import { Document, Schema, Types } from "mongoose";

interface ILeadStatus extends Document {
  name: string;
  position: number;
  allowed: [Types.ObjectId];
}

const leadStatusSchema = new Schema<ILeadStatus>(
  {
    name: String,
    position: { type: Number, unique: false },
    allowed: [{ type: Schema.Types.ObjectId, ref: 'LeadStatus' }],
  },
  { timestamps: true }
);

export { ILeadStatus, leadStatusSchema };
