import { Request, Response } from "express";
import { Loan } from "../../../models";

export default async function controllerDelete(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }
  const loan = await Loan.findByIdAndDelete(id);
  if (loan) {
    res.status(200).json(loan);
  } else {
    res.status(404).json({ message: "Loan not found" });
  }
}
