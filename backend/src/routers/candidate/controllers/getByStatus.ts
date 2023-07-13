import { Request, Response } from "express";
import { Candidate } from "../../../models";

export default async function controllerGetByStatus(
  req: Request,
  res: Response
) {
  const { status } = req.params;
  const candidate = await Candidate.find({ status: status });

  res.status(200).json(candidate);
}
