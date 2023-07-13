import { Request, Response } from "express";
import { Category } from "../../../models";

export default async function controllerDelete(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }
  const category = await Category.findByIdAndDelete(id);
  if (category) {
    res.status(200).json(category);
  } else {
    res.status(500).json({ message: "Something went wrong" });
  }
}
