import { Request, Response } from "express";
import { Tax } from "../../../models/tax";

export default async function controllerGet(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const tax = await Tax.findById(id);
    if (tax) {
      res.status(200).json(tax);
    } else {
      res.status(404).json({ message: "Tax not found" });
    }
  } else {
    const taxes = await Tax.find({});
    res.status(200).json(taxes);
  }
}
