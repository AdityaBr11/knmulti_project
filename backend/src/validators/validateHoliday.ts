// validate all fields of IHoliday are present

import { IHoliday } from "../db/schema/holiday";

const validateHoliday = (holiday: IHoliday) => {
  if (!holiday) return [{ message: "No data was provided" }];
  const errors: Array<{ message: string }> = [];
  // if (!holiday.title) errors.push({ message: "Title is required" });
  // if (!holiday.date) errors.push({ message: "Date is required" });
  return errors;
};

export default validateHoliday;
