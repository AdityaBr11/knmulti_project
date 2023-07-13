import { ILocation } from "../db/schema/location";

const validateLocation = (location: ILocation) => {
  if (!location) return [{ message: "No data was provided" }];
  const errors: Array<{ message: string }> = [];
  // if (!location.name) errors.push({ message: "Name is required" });
  return errors;
};

export default validateLocation;
