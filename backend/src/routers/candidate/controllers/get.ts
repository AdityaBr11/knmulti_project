// create an express get controller for candidate model

import { Request, Response } from "express";
import { Candidate } from "../../../models";

export default async function controllerGet(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const candidate = await Candidate.findById(id);
    if (candidate) {
      res.status(200).json(candidate);
    } else {
      res.status(404).json({ message: "Candidate not found" });
    }
  } else {
    const candidates = await Candidate.find({});
    res.status(200).json(candidates);
  }
}
