// create an express delete route for tax model

import { Request, Response } from "express";
import { Tax } from "../../../models/tax";

export default async function controllerDelete(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }
  const tax = await Tax.findByIdAndDelete(id);
  if (tax) {
    res.status(200).json(tax);
  } else {
    res.status(404).json({ message: "Tax not found" });
  }
}
