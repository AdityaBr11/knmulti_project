import { ICandidate } from "../db/schema/candidate";

const validateCandidate = (candidate: ICandidate) => {
  if (!candidate) return [{ message: "No data was provided" }];
  const errors: Array<{ message: string }> = [];
  if (!candidate.name) errors.push({ message: "Name is required" });
  if (!candidate.message) errors.push({ message: "Message is required" });
  return errors;
};

export default validateCandidate;
