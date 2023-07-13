import { Request, Response } from "express";
import { EmployeeType } from "../../../models";
import { validateEmployeeType } from "../../../validators";

export default async function controllerPost(
  req: Request,
  res: Response
): Promise<void> {
  const data = req.body;
  const errors = validateEmployeeType(data);
  if (errors.length) {
    res.status(400).json({ errors });
  }
  const leaveType = await EmployeeType.create(data);
  if (leaveType) res.status(201).json(leaveType);
  else res.status(500).json({ message: "Something went wrong" });
}
