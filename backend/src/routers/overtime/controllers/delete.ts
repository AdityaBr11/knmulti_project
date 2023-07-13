import { Request, Response } from "express";
import { Overtime } from "../../../models";

export default async function controllerDelete(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }
  const overtime = await Overtime.findByIdAndDelete(id);
  if (overtime) {
    res.status(200).json(overtime);
  } else {
    res.status(404).json({ message: "Overtime not found" });
  }
}
