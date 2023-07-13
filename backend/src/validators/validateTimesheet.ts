import { ITimesheet } from "../db/schema/timesheet";

const validateTimesheet = (timesheet: ITimesheet) => {
  const errors: Array<{ message: string }> = [];
  if (!timesheet) return [{ message: "No data was provided" }];
  if (!timesheet.employee) errors.push({ message: "Employee Id is required" });
  if (!timesheet.date)
    errors.push({ message: "Data format error" });
  return errors;
};

export default validateTimesheet;
