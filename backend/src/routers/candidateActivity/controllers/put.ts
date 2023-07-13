// create an express put route for calenderEvent model

import { Request, Response } from "express";
import { CandidateActivity } from "../../../models/candidateActivity";

export default async function controllerPut(req: Request, res: Response) {
  const { id } = req.params;
  const data = req.body;
  const activity = await CandidateActivity.findByIdAndUpdate(id, data);
  if (activity) {
    res.status(200).json(activity);
  } else {
    res.status(404).json({ message: "activity not found" });
  }
}
