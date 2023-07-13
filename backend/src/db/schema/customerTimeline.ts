import { Document, Schema, Types } from "mongoose";

interface ICustomerTimeline {
  customer: Types.ObjectId; 
  timelineType: string;
  // dateTime: Date;
  description: string;
  link: string;
  employee: number;
}

const customerTimelineSchema = new Schema<ICustomerTimeline>({
    customer: { type: Schema.Types.ObjectId, ref: "Customer" },
    timelineType: String,
    // dateTime: Date,
    description: String,
    link: String,
    employee: { type: Number, ref: "Employee"}
  },
  { timestamps: true }
);

export { ICustomerTimeline, customerTimelineSchema };