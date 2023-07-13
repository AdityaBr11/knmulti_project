// create an express put controller for overtime model

import { Request, Response } from "express";
import { Overtime } from "../../../models";
import { validateOvertime } from "../../../validators";

export default async function controllerPut(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }
  const errors = validateOvertime(req.body);
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }
  const overtime = await Overtime.findByIdAndUpdate(id, req.body);
  if (overtime) {
    res.status(200).json(overtime);
  } else {
    res.status(500).json({ message: "Something went wrong" });
  }
}
