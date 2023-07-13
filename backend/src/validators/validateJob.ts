import { IJob } from "../db/schema/job";

const validateJob = (job: IJob) => {
  if (!job) return [{ message: "No data was provided" }];
  const errors: Array<{ message: string }> = [];
  if (!job.department) errors.push({ message: "Department is required" });
  if (!job.location) errors.push({ message: "Location is required" });
  if (!job.numberOfVacancies)
    errors.push({ message: "Number of vacancies is required" });
  // if (!job.experience) errors.push({ message: "Experience is required" });
  if (!job.salaryFrom) errors.push({ message: "Salary from is required" });
  if (!job.salaryTo) errors.push({ message: "Salary to is required" });
  if (!job.jobType) errors.push({ message: "Job type is required" });
  return errors;
};

export default validateJob;
