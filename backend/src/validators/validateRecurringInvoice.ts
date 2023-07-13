import { IRecurringInvoice } from "../db/schema/recurringInvoice";

const validateRecurringInvoice = (invoice: IRecurringInvoice) => {
  if (!invoice) return [{ message: "No data was provided" }];
  const errors: Array<{ message: string }> = [];
  if (!invoice.customer) errors.push({ message: "Customer and its details are required" });
  if (invoice.items[0].amount === 0)
    errors.push({ message: "Items are required" });
  if(!invoice.frequencyUnit) errors.push({ message: "Frequency must be specified"});
  if(!invoice.frequency) errors.push({ message: "Frequency must be specified" });
  if(!invoice.profileName) errors.push({ message: "Profile name must be specified"});
  if(!invoice.startDate) errors.push({ message: "Start date must be specified"});
  if(!invoice.endDate && !invoice.neverExpires) errors.push({ message: "End date must be specified"})
  return errors;
};

export default validateRecurringInvoice;