import { IEmployee } from "../db/schema/employee";
import { isValidEmail } from "./validateEmail";

const validateEmployee = (employee: IEmployee) => {
  const errors: Array<{ message: string }> = [];
  if (!employee) return [{ message: "No data was provided" }];
  // if (!employee.email) errors.push({ message: "Email is required" });
  // if (employee.email && !isValidEmail(employee.email))
  //   errors.push({ message: "Email is invalid" });
  if (!employee.userName) errors.push({ message: "User name is required" });
  // if (!employee.firstName) errors.push({ message: "First name is required" });
  // if (!employee.lastName) errors.push({ message: "Last name is required" });
  // if (!employee.dob) errors.push({ message: "Date of birth is required" });
  // if (!employee.address) errors.push({ message: "Address is required" });
  // if (!employee.address?.addressLine1)
  //   errors.push({ message: "Address line 1 is required" });
  // if (!employee.address?.city) errors.push({ message: "City is required" });
  // if (!employee.address?.state) errors.push({ message: "State is required" });
  // if (!employee.address?.country)
  //   errors.push({ message: "Country is required" });
  // if (!employee.address?.postalCode)
  // errors.push({ message: "Postal code is required" });
  // if (!employee.mobileNo) errors.push({ message: "Mobile number is required" });
  // if (!employee.userAuthorites)
  //   errors.push({ message: "User authorites is required" });
  // if (!employee.jobRole) errors.push({ message: "Job role is required" });
  // if (!employee.workLocation)
  //   errors.push({ message: "Work location is required" });
  // if (!employee.salary) errors.push({ message: "Salary is required" });
  return errors;
};

export default validateEmployee;
