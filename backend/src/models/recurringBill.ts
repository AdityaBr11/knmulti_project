import { model } from "mongoose";
import { IRecurringBill, recurringBillSchema } from "../db/schema/recurringBill";


export const RecurringBill = model<IRecurringBill>('RecurringBill', recurringBillSchema);