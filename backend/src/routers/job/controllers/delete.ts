// create an express job delete controller for job model

import { Request, Response } from "express";
import { Job } from "../../../models";

export default async function controllerDelete(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }
  const job = await Job.findByIdAndDelete(id);
  if (job) {
    res.status(200).json(job);
  } else {
    res.status(404).json({ message: "Job not found" });
  }
}
