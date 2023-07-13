import { ISalesOrder } from "../db/schema/salesOrder";

const validateSalesOrder = (order: ISalesOrder) => {
  if (!order) return [{ message: "No data was provided" }];
  const errors: Array<{ message: string }> = [];
  if (!order.customer) errors.push({ message: "Customer and its details are required" });
  if (order.items[0].amount === 0)
    errors.push({ message: "Items are required" });
  return errors;
};

export default validateSalesOrder;
