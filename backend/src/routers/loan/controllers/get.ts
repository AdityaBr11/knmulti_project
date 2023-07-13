// create an express route for loan model

import { Request, Response } from "express";
import { Loan } from "../../../models";

export default async function controllerGet(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const loan = await Loan.findById(id);
    if (loan) {
      res.status(200).json(loan);
    } else {
      res.status(404).json({ message: "Loan not found" });
    }
  } else {
    const loans = await Loan.find({});
    res.status(200).json(loans);
  }
}
