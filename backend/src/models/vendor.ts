import { model } from "mongoose";
import { IVendor, vendorSchema } from "../db/schema/vendor";

export const Vendor = model<IVendor>("Vendor", vendorSchema);
