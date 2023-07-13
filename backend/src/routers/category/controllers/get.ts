import { Request, Response } from "express";
import { Category } from "../../../models";

export default async function controllerGet(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const category = await Category.findById(id);
    res.json(category);
  } else {
    const categories = await Category.find({});
    res.json(categories);
  }
}
