// create a express post route for providentFund model

import { Request, Response } from "express";
import { ProvidentFund } from "../../../models";
import { validateProvidentFund } from "../../../validators";

export default async function controllerPost(req: Request, res: Response) {
  const data = req.body;
  const errors = validateProvidentFund(data);
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }
  const providentFund = await ProvidentFund.create(data);
  if (providentFund) {
    res.status(201).json(providentFund);
  } else {
    res.status(500).json({ message: "Something went wrong" });
  }
}
