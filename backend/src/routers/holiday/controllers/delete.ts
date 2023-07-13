import { Request, Response } from "express";
import { Holiday } from "../../../models/holiday";

export default async function controllerDelete(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  if (id) {
    const holiday = await Holiday.findByIdAndDelete(id);
    if (holiday) {
      res.status(200).json(holiday);
    } else {
      res.status(404).json({ message: "Holiday not found" });
    }
  } else {
    res.status(400).json({ message: "Invalid request" });
  }
}
