import { IProvidentFund } from "../db/schema/providentFund";

const validateProvidentFund = (data: IProvidentFund) => {
  if (!data) return [{ message: "No data was provided" }];
  const errors: Array<{ message: string }> = [];
  // if (!data.employee) errors.push({ message: "Employee is required" });
  if (!data.date) errors.push({ message: "Date is required" });
  if (!data.type) errors.push({ message: "Type is required" });
  if (!data.amount) errors.push({ message: "Amount is required" });
  if (!data.description) errors.push({ message: "Description is required" });
  return errors;
};

export default validateProvidentFund;
