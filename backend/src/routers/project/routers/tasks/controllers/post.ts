import { Request, Response } from "express";
import { ITask } from "../../../../../db/schema/task";
import { Task } from "../../../../../models";
import { verifyTask } from "../../../../../validators";

export default async function controllerPost(
  req: Request,
  res: Response
): Promise<any> {
  const taskData = req.body;
  const errors: string[] = verifyTask(taskData);
  if (errors.length > 0) {
    return res.status(400).send(errors);
  }
  const task: ITask = new Task(taskData);
  await task.save();
  res.status(200).send(task);
}
