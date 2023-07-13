// create an express get route for the goal model

import { Request, Response } from "express";
import { Goal } from "../../../models";

export default async function controllerGet(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const goal = await Goal.findById(id);
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }
    return res.status(200).json(goal);
  }
  const goals = await Goal.find({});
  return res.status(200).json(goals);
}
