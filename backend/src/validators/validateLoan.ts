import { ILoan } from "../db/schema/loan";

const validateLoan = (loan: ILoan) => {
  if (!loan) return [{ message: "No data was provided" }];
  const errors: Array<{ message: string }> = [];
  if (!loan.for) errors.push({ message: "For is required" });
  if (!loan.date) errors.push({ message: "Date is required" });
  if (!loan.amount) errors.push({ message: "Amount is required" });
  if (!loan.paidBy) errors.push({ message: "PaidBy is required" });
  if (!loan.status) errors.push({ message: "Status is required" });
  return errors;
};

export default validateLoan;
