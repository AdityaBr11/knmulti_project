// create an express get router for calenderEvent model

import { Request, Response } from "express";
import { CandidateActivity } from "../../../models/candidateActivity";

export default async function controllerGet(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const candidateActivityData = await CandidateActivity.findById(id);
    if (candidateActivityData) {
      res.status(200).json(candidateActivityData);
    } else {
      res.status(404).json({ message: "Candidate not found" });
    }
  } else {
    const candidates = await CandidateActivity.find({});
    res.status(200).json(candidates);
  }
}
