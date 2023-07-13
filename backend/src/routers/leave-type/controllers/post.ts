import { Request, Response } from "express";
import { LeaveType } from "../../../models";
import { validateLeaveType } from "../../../validators";

export default async function controllerPost(
  req: Request,
  res: Response
): Promise<void> {
  const data = req.body;
  const errors = validateLeaveType(data);
  if (errors.length) {
    res.status(400).json({ errors });
  }
  const leaveType = await LeaveType.create(data);
  if (leaveType) res.status(201).json(leaveType);
  else res.status(500).json({ message: "Something went wrong" });
}
