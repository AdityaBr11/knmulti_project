import { IProject } from "../db/schema/project";

const verifyProject = (data: IProject) => {
  const errors = [];
  if (!data) errors.push({ message: "No data was provided" });
  if (!data.name) errors.push({ message: "Project name is required" });
  // if (!data.startDate)
  //   errors.push({ message: "Project start date is required" });
  // if (!data.type) errors.push({ message: "Project type is required" });
  // if (!data.costPerSqFeet)
  //   errors.push({ message: "Cost per sq feet is required" });
  // if (!data.description)
  //   errors.push({ message: "Project description is required" });
  return errors;
};

export default verifyProject;
