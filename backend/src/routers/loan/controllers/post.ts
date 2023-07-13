// create a express post route for loan model

import { Request, Response } from "express";
import { Loan } from "../../../models";
import { validateLoan } from "../../../validators";

export default async function controllerPost(req: Request, res: Response) {
  const data = req.body;
  const errors = validateLoan(data);
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }
  const loan = await Loan.create(data);
  if (loan) {
    res.status(201).json(loan);
  } else {
    res.status(500).json({ message: "Something went wrong" });
  }
}
