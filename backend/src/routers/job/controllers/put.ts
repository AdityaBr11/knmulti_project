import { Request, Response } from "express";
import { Job } from "../../../models";

export default async function controllerPut(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }
  const data = req.body;
  const job = await Job.findByIdAndUpdate(id, data);
  if (job) {
    res.status(200).json(job);
  } else {
    res.status(404).json({ message: "Job not found" });
  }
}
