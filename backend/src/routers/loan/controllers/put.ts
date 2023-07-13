// create an express put route for loan model

import { Request, Response } from "express";
import { Loan } from "../../../models";
import { validateLoan } from "../../../validators";

export default async function controllerPut(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Invalid request" });
  }
  const data = req.body;
  const errors = validateLoan(data);
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }
  const loan = await Loan.findByIdAndUpdate(id, data);
  if (loan) {
    return res.status(200).json(loan);
  }
  return res.status(500).json({ message: "Something went wrong" });
}
