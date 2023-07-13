// create an express put route for the goal controller

import { Request, Response } from "express";
import { Goal } from "../../../models";
import { validateGoal } from "../../../validators";

export default async function controllerPut(req: Request, res: Response) {
  const { id } = req.params;
  const data = req.body;
  const errors = validateGoal(data);
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }
  const goal = await Goal.findByIdAndUpdate(id, data);
  if (!goal) {
    return res.status(404).json({ message: "Goal not found" });
  }
  return res.status(200).json(goal);
}
