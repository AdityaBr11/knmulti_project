import { ISaleInvoice } from "../db/schema/saleInvoice";

const validateSaleInvoice = (invoice: ISaleInvoice) => {
  if (!invoice) return [{ message: "No data was provided" }];
  const errors: Array<{ message: string }> = [];
  if (!invoice.customer) errors.push({ message: "Customer and its details are required" });
  if (invoice.items[0].amount === 0)
    errors.push({ message: "Items are required" });
  return errors;
};

export default validateSaleInvoice;