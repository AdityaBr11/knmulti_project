// create ana express get route for goalType model

import { Request, Response } from "express";
import { GoalType } from "../../../models";

export default async function controllerGet(req: Request, res: Response) {
  const goalTypes = await GoalType.find();
  return res.status(200).send(goalTypes);
}
