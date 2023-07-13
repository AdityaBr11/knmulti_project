import { ISaleEstimate } from "../db/schema/saleEstimate";

const validateSalesEstimate = (estimate: ISaleEstimate) => {
  if (!estimate) return [{ message: "No data was provided" }];
  const errors: Array<{ message: string }> = [];
  if (!estimate.customer) errors.push({ message: "Customer and its details are required" });
  if (estimate.items[0].amount === 0)
    errors.push({ message: "Items are required" });
  return errors;
};

export default validateSalesEstimate;
