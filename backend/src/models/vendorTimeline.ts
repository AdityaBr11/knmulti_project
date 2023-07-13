import { model } from "mongoose";
import { IVendorTimeline, vendorTimelineSchema } from "../db/schema/vendorTimeline";

export const VendorTimeline = model<IVendorTimeline>("VendorTimeline", vendorTimelineSchema);