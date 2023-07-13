import { Request, Response } from "express";
import { ITask } from "../../../../../db/schema/task";
import { Task } from "../../../../../models";
import { verifyTask } from "../../../../../validators";

export default async function controllerPut(
  req: Request,
  res: Response
): Promise<any> {
  const { id } = req.params;
  const { userId } = req.query;
  const taskData = req.body;
  const errors: string[] = verifyTask(taskData);
  if (errors.length > 0) {
    return res.status(400).send(errors);
  }
  const task: ITask = await Task.findOne({ _id: id, users: userId }).populate(
    "project"
  );
  if (!task) {
    res.status(404).send("Task not found");
    return;
  }
  if ((task.project as any).leader.toString() !== userId) {
    return res.status(403).send("You are not the leader of this project");
  }
  task.status = taskData.status;
  task.markedAsDone = taskData.markedAsDone;
  task.markedAsDoneBy = taskData.markedAsDoneBy;
  task.users = taskData.users;
  task.description = taskData.description;
  await task.save();
  res.status(200).send(task);
}
