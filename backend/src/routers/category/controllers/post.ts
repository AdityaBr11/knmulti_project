import { Request, Response } from "express";
import { Category } from "../../../models";
import { validateCategory } from "../../../validators";

export default async function controllerPost(req: Request, res: Response) {
  const data = req.body;
  const errors = validateCategory(data);
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }
  const category = Category.create(data);
  if (category) {
    res.status(201).json(category);
  } else {
    res.status(500).json({ message: "Something went wrong" });
  }
}
