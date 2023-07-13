// create an express post controller for candidate model

import { Request, Response } from "express";
import { Candidate } from "../../../models";
import { validateCandidate } from "../../../validators";

export default async function controllerPost(req: Request, res: Response) {
  const data = req.body;
  const errors = validateCandidate(data);
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }
  console.log("candidates",data,'errors',errors)
  const candidate = await Candidate.create(data);
  if (candidate) {
    console.log("candidates",candidate)
    res.status(201).json(candidate);
  } else {
    res.status(500).json({ message: "Something went wrong" });
  }
}
