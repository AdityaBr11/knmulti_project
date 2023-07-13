// create a express post route for invest model

import { Request, Response } from "express";
import { Investment } from "../../../models";
import { validateInvestment } from "../../../validators";

export default async function controllerPost(req: Request, res: Response) {
  const data = req.body;
  const errors = validateInvestment(data);
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }
  const investment = await Investment.create(data);
  if (investment) {
    res.status(201).json(investment);
  } else {
    res.status(500).json({ message: "Something went wrong" });
  }
}
