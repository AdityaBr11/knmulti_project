import { model } from "mongoose";
import { customerTimelineSchema, ICustomerTimeline } from "../db/schema/customerTimeline";

export const CustomerTimeline = model<ICustomerTimeline>("CustomerTimeline", customerTimelineSchema);