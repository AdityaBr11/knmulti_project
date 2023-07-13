import { Request, Response } from "express";
import { ITask } from "../../../../../db/schema/task";
import { Task } from "../../../../../models/task";

export default async function controllerGet(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) {
    const { userId, projectID } = req.query;
    if (!userId || !projectID) {
      res.status(400).json({
        message: "Bad request",
      });
      return;
    }
    const task: ITask[] = await Task.find({
      project: projectID,
      users: userId,
    });
    return res.status(200).send(task);
  }
  const task = await Task.findById(id);
  if (!task) {
    res.status(404).json({
      message: "Task not found",
    });
    return;
  }
  res.status(200).send(task);
}
