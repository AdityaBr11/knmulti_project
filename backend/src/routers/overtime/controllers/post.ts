import { Request, Response } from "express";
import { Overtime } from "../../../models";
import { validateOvertime } from "../../../validators";

export default async function controllerPost(
  req: Request,
  res: Response
): Promise<void> {
  const errors = validateOvertime(req.body);
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }
  const overtime = await Overtime.create(req.body);
  if (overtime) {
    res.status(200).json(overtime);
  } else {
    res.status(500).json({ message: "Something went wrong" });
  }
}
