import { Request, Response } from "express";
import { ITask } from "../../../../../db/schema/task";
import { Task } from "../../../../../models/task";

export default async function controllerDelete(
  req: Request,
  res: Response
): Promise<any> {
  const { id } = req.params;
  const { userId } = req.query;
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
  await task.remove();
  res.status(200).send(task);
}
