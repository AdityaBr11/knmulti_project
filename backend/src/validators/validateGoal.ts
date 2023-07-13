// validate the role interface

import { IGoal } from "../db/schema/goal";

const validateGoal = (goal: IGoal) => {
  if (!goal) return [{ message: "No data was provided" }];
  const errors: Array<{ message: string }> = [];
  // if (!goal.goalType) errors.push({ message: "Goal type is required" });
  if (!goal.subject) errors.push({ message: "Subject is required" });
  if (!goal.description) errors.push({ message: "Description is required" });
  if (!goal.startDate) errors.push({ message: "Start date is required" });
  if (!goal.endDate) errors.push({ message: "End date is required" });
  if (!goal.status) errors.push({ message: "Status is required" });
  return errors;
};

export default validateGoal;
