// create an express delete controller for candidate model

import { Request, Response } from "express";
import { Candidate } from "../../../models";

export default async function controllerDelete(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }
  const candidate = await Candidate.findByIdAndDelete(id);
  if (candidate) {
    res.status(200).json(candidate);
  } else {
    res.status(404).json({ message: "Candidate not found" });
  }
}
