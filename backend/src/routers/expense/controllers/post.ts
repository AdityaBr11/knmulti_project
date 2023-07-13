// create an experss post route for expense model

import { Request, Response } from "express";
import { Expense } from "../../../models/expense";

export default async function controllerPost(req: Request, res: Response) {
  const data = req.body;
  const expense = new Expense(data);
  expense.save((err, expense) => {
    if (err) return res.status(400).json(err);
    res.status(201).json(expense);
  });
}
