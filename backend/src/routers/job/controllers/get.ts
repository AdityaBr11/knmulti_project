// create an express job get controller for job model

import { Request, Response } from "express";
import { Job } from "../../../models";

export default async function controllerGet(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const job = await Job.findById(id).populate("location").populate("candidates");
    if (job) {
      res.status(200).json(job);
    } else { 
      res.status(404).json({ message: "Job not found" });
    }
  } else {
    const jobs = await Job.find({}).populate("location").populate("candidates");
    res.status(200).json(jobs);
  }
}
