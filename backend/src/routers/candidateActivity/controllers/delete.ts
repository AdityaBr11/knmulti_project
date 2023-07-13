// create an express delete router for calenderEvent model

import { Request, Response } from "express";
import { CandidateActivity } from "../../../models/candidateActivity";

export default async function controllerDelete(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const event = await CandidateActivity.findByIdAndDelete(id);
    if (event) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ message: "Activity not found" });
    }
  } else {
    res.status(400).json({ message: "Invalid request" });
  }
}
