// create an epxress delete route for expoense modle

import { Request, Response } from "express";
import { Expense } from "../../../models/expense";

export default async function controllerDelete(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const expense = await Expense.findByIdAndDelete(id);
    if (expense) {
      res.json(expense);
    } else {
      res.status(404).json({ error: "Expense not found" });
    }
  } else {
    res.status(400).json({ error: "Expense id is required" });
  }
}
