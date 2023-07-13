import { Request, Response } from "express";
import { Tax } from "../../../models/tax";
import validateTax from "../../../validators/validateTax";

export default async function controllerPut(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }
  const errors = validateTax(req.body);
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }
  const tax = await Tax.findByIdAndUpdate(id, req.body);
  if (tax) {
    res.status(200).json(tax);
  } else {
    res.status(404).json({ message: "Tax not found" });
  }
}
