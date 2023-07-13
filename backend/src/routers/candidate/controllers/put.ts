// create an express put controller for candidate model

import { Request, Response } from "express";
import { Candidate } from "../../../models";
import { validateCandidate } from "../../../validators";

export default async function controllerPut(req: Request, res: Response) {
  const { id } = req.params;
  let data;
  if(req.body.status === "SELECTED"){
    data = { ...req.body, onBoarding: true }
  } else {
    data = req.body;
  }
  // const errors = validateCandidate(data);
  // if (errors.length) {
  //   res.status(400).json({ errors });
  //   return;
  // }
  const candidate = await Candidate.findByIdAndUpdate(id, data);
  if (candidate) {
    console.log("candidate",candidate);
    
    res.status(200).json(candidate);
  } else {
    res.status(404).json({ message: "Candidate not found" });
  }
}
