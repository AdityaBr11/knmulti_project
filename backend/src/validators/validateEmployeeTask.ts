import { IEmployeeTask } from "../db/schema/employeeTask";

const validateEmployeeTask = (data: IEmployeeTask) => {
  if (!data) return [{ message: "No data was provided" }];
  const errors: Array<{ message: string }> = [];
  return errors;
};

export default validateEmployeeTask;
