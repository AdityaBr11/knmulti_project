import { ITask } from "../db/schema/task";

const verifyTask = (task: ITask): string[] => {
  const errors: string[] = [];

  // if (!task.description) {
  //   errors.push("Task description is required");
  // }
  // if (!task.project) {
  //   errors.push("Task project is required");
  // }
  // if (!task.users) {
  //   errors.push("Task users is required");
  // }
  return errors;
};

export default verifyTask;
