// create a express post route for Calender event model

import { Request, Response } from "express";
import { CandidateActivity } from "../../../models/candidateActivity";

export default async function (req: Request, res: Response): Promise<void> {
  const data = req.body;
  const activity = await CandidateActivity.create(data);
  res.status(201).json(activity);
}
