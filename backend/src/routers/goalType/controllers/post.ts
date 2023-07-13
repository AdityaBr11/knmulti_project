// create an express post route for goalType model

import { Request, Response } from "express";
import { GoalType } from "../../../models";

export default async function controllerPost(req: Request, res: Response) {
  const data = req.body;
  const goalType = new GoalType(data);
  await goalType.save();
  return res.status(201).send(goalType);
}
