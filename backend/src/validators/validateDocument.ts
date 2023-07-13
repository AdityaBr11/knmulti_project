import { IDocuments } from "../db/schema/documents";

const validateDocument = (data: IDocuments) => {
  if (!data) return [{ message: "No data was provided" }];
  const errors: Array<{ message: String }> = [];
  if (!data.user) errors.push({ message: "User ID is required" });
  return errors;
};

export default validateDocument;
