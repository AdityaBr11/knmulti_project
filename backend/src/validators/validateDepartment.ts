import { IDepartment } from "../db/schema/department";

const validateDepartment = (data: IDepartment) => {
  if (!data) return [{ message: "No data was provided" }];
  const errors: Array<{ message: string }> = [];
  // if (!data.name) errors.push({ message: "Department name is required" });
  return errors;
};

export default validateDepartment;
