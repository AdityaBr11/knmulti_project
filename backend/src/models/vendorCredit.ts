import { model } from "mongoose";
import { IVendorCredit, vendorCreditSchema } from "../db/schema/vendorCredit";

export const VendorCredit = model<IVendorCredit>(
  "VendorCredit",
  vendorCreditSchema
);
