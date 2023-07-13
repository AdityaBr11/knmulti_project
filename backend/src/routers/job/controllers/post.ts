// create an express job post controller for job model

import { Request, Response } from "express";
import { Job } from "../../../models";
import { validateJob } from "../../../validators";

export default async function controllerPost(req: Request, res: Response) {
  const data = req.body;
  const errors = validateJob(data);
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }
  const job = await Job.create(data);
  if (job) {
    res.status(201).json(job);
  } else {
    res.status(500).json({ message: "Something went wrong" });
  }
}
