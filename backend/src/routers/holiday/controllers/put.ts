// create a express put route for holiday model

import { Request, Response } from "express";
import { Holiday } from "../../../models/holiday";

export default async function controllerPut(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }
  const holiday = await Holiday.findByIdAndUpdate(id, req.body);
  if (holiday) {
    res.status(200).json(holiday);
  }
}
