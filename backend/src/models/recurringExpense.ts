import { model } from "mongoose";
import { IRecurringExpense, recurringExpenseSchema } from "../db/schema/recurringExpense";


export const RecurringExpense = model<IRecurringExpense>('RecurringExpense', recurringExpenseSchema);