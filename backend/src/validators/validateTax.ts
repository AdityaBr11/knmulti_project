import { ITax } from "../db/schema/tax";

const validateTax = (tax: ITax) => {
  if (!tax) return [{ message: "No data was provided" }];
  const errors: Array<{ message: string }> = [];
  if (!tax.name) errors.push({ message: "Name is required" });
  if (!tax.type) errors.push({ message: "Type is required" });
  if (!tax.amount) errors.push({ message: "Amount is required" });
  if (!tax.status) errors.push({ message: "Status is required" });
  return errors;
};

export default validateTax;
