import { Request, Response } from "express";
import { GoalType } from "../../../models";

export default async function controllerDelete(req: Request, res: Response) {
  const { id } = req.params;
  const goalType = await GoalType.findByIdAndDelete(id);
  if (!goalType) return res.status(404).send("GoalType not found");
  return res.status(200).send(goalType);
}
