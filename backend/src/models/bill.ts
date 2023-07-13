import { model } from "mongoose";
import { billSchema, IBill } from "../db/schema/bills";

export const Bill = model<IBill>("Bill", billSchema);
