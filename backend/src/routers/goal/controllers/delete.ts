// create an express delete route for the goal controller

import { Request, Response } from "express";
import { Goal } from "../../../models";

export default async function controllerDelete(req: Request, res: Response) {
  const { id } = req.params;
  const goal = await Goal.findById(id);
  if (!goal) {
    return res.status(404).json({ message: "Goal not found" });
  }
  await goal.remove();
  return res.status(200).json(goal);
}
