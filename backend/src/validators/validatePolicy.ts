import { IPolicy } from "../db/schema/policy";

const validatePolicy = (policy: IPolicy) => {
  if (!policy) return [{ message: "No data was provided" }];
  const errors: Array<{ message: string }> = [];
  if (!policy.name) errors.push({ message: "Name is required" });
  if (!policy.description) errors.push({ message: "Description is required" });
  // if (!policy.department) errors.push({ message: "Department is required" });
  return errors;
};

export default validatePolicy;
