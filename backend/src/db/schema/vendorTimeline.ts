import { Document, Schema, Types } from "mongoose";

interface IVendorTimeline {
  vendor: Types.ObjectId; 
  timelineType: string;
  // dateTime: Date;
  description: string;
  link: string;
  employee: number;
}

const vendorTimelineSchema = new Schema<IVendorTimeline>({
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor" },
    timelineType: String,
    // dateTime: Date,
    description: String,
    link: String,
    employee: { type: Number, ref: "Employee"}
  },
  { timestamps: true }
);

export { IVendorTimeline, vendorTimelineSchema };