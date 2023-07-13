import { IDeliveryChallan } from "../db/schema/deliveryChallan";

const validateDeliveryChallan = (challan: IDeliveryChallan) => {
  if (!challan) return [{ message: "No data was provided" }];
  const errors: Array<{ message: string }> = [];
  if (!challan.customer) errors.push({ message: "Customer and its details are required" });
  // if (!challan.deliveryChallan) errors.push({ message: "Challan number is required" });
  if (!challan.challanDate) errors.push({ message: "Please enter a valid challan date" });
  if (!challan.challanType) errors.push({ message: "Please select a challan type" });
  if (challan.items[0].amount === 0)
    errors.push({ message: "Items are required" });
  return errors;
};

export default validateDeliveryChallan;
