import { IInvestment } from "../db/schema/investment";

const validateInvestment = (investment: IInvestment) => {
  if (!investment) return [{ message: "No data was provided" }];
  const errors: Array<{ message: string }> = [];
  if (!investment.name) errors.push({ message: "Name is required" });
  if (!investment.for) errors.push({ message: "For is required" });
  if (!investment.date) errors.push({ message: "Date is required" });
  if (!investment.amount) errors.push({ message: "Amount is required" });
  if (!investment.paidBy) errors.push({ message: "PaidBy is required" });
  return errors;
};

export default validateInvestment;
