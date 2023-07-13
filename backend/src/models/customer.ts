import { model } from "mongoose";
import { customerSchema, ICustomer } from "../db/schema/customer";

export const Customer = model<ICustomer>("Customer", customerSchema);
