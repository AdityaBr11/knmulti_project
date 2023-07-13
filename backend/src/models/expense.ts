import { model } from "mongoose";
import { expenseSchema, IExpense } from "../db/schema/expense";

export const Expense = model<IExpense>("Expense", expenseSchema);
