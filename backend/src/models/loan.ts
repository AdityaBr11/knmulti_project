import { model } from "mongoose";
import { ILoan, loanSchema } from "../db/schema/loan";

export const Loan = model<ILoan>("Loan", loanSchema);
