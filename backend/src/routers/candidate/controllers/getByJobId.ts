import { Request, Response } from "express";
import { Candidate } from "../../../models";

export default async function controllerGetByJobId(
  req: Request,
  res: Response
) {
  const { id } = req.params;
  if (id) {
    const candidate = await Candidate.find({ job: id });
    if (candidate) {
      res.status(200).json(candidate);
    } else {
      res
        .status(404)
        .json({ message: "No candidate found for the given job Id" });
    }
  } else {
    res.status(404).json({ message: "Empty job Id" });
  }
}
