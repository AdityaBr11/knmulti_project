// validate ovetime model

import { IOvertime } from "../db/schema/overtime";

const validateOvertime = (data: IOvertime) => {
  if (!data) return [{ message: "No data was provided" }];
  const errors: Array<{ message: string }> = [];
  // if (!data.employee) errors.push({ message: "Employee is required" });
  // if (!data.date) errors.push({ message: "Date is required" });
  // if (!data.hours) errors.push({ message: "Hours is required" });
  // if (!data.description) errors.push({ message: "Description is required" });
  return errors;
};

export default validateOvertime;
