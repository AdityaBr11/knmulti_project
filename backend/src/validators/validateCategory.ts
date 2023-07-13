import { ICategory } from "../db/schema/category";

const validateCategory = (data: ICategory) => {
  if (!data) return [{ message: "No data was provided" }];
  const errors: Array<{ message: string }> = [];
  // if (!data.name) errors.push({ message: "Name is required" });
  // if (!data.description) errors.push({ message: "Description is required" });
  return errors;
};

export default validateCategory;
