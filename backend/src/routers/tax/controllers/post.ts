import { Request, Response } from "express";
import { Tax } from "../../../models/tax";
import validateTax from "../../../validators/validateTax";

export default async function controllerPost(req: Request, res: Response) {
  const data = req.body;
  const errors = validateTax(data);
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }
  const tax = await Tax.create(data);
  if (tax) {
    res.status(201).json(tax);
  } else {
    res.status(500).json({ message: "Something went wrong" });
  }
}
