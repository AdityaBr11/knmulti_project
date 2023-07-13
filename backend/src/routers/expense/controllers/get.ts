// create an express get route for the expense model

import { Request, Response } from "express";
import { Expense } from "../../../models/expense";

export default async function controllerGet(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const expense = await Expense.findById(id).populate("vendor");
    if (expense) {
      res.json(expense);
    } else {
      res.status(404).json({ error: "Expense not found" });
    }
  } else {
    const expenses = await Expense.find().populate("vendor");
    res.json(expenses);
  }
}
