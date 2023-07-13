// validate sale payment

import { ISalePayment } from "../db/schema/salePayment";

const validatePayment = (payment: ISalePayment) => {
  if (!payment) return [{ message: "No data was provided" }];
  const errors: Array<{ message: string }> = [];
  if (!payment.paymentDate)
    errors.push({ message: "Payment date is required" });
  if (!payment.amountReceived) errors.push({ message: "Amount is required" });
  if (!payment.paymentMode)
    errors.push({ message: "Payment mode is required" });
  if (!payment.customer) errors.push({ message: "Customer is required" });
  // if (!payment.paymentNumber) errors.push({ message: "Payment number is required" });
  if (!payment.depositTo) errors.push({ message: "Deposit avenue is required" });
  return errors;
};

export default validatePayment;
