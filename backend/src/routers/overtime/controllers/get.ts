import { Request, Response } from "express";
import { Overtime } from "../../../models";

export default async function controllerGet(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  if (!id) {
    const overtimes = await Overtime.find({});
    res.status(200).json(overtimes);
  } else {
    const overtime = await Overtime.find({ employee: id });
    if (overtime) {
      res.status(200).json(overtime);
    } else {
      res.status(404).json({ message: "Overtime not found" });
    }
  }
}
