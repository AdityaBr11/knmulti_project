// create an express put  route for goalType model

import { Request, Response } from "express";
import { GoalType } from "../../../models";

export default async function controllerPut(req: Request, res: Response) {
  const { id } = req.params;
  const data = req.body;
  const goalType = await GoalType.findByIdAndUpdate(id, data);
  if (!goalType) return res.status(404).send("GoalType not found");
  return res.status(200).send(goalType);
}
