import { IClient } from "../db/schema/client";
import { isValidEmail } from "./validateEmail";
// validate client model

const validateClient = (data: IClient) => {
  if (!data) return [{ message: "No data was provided" }];
  const errors: Array<{ message: string }> = [];
  // if (!data.firstName) errors.push({ message: "First name is required" });
  // if (!data.lastName) errors.push({ message: "Last name is required" });
  // if (!data.email) errors.push({ message: "Email is required" });
  // if (data.email && !isValidEmail(data.email))
  //   errors.push({ message: "Email is invalid" });
  // if (!data.phone) errors.push({ message: "Phone is required" });
  // if (!data.company) errors.push({ message: "Company is required" });
  return errors;
};

export default validateClient;
