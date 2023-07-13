// create an express put route for leave type model

import { Request, Response } from "express";
import { LeaveType } from "../../../models";
import { validateLeaveType } from "../../../validators";

export default async function controllerPut(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }
  const errors = validateLeaveType(req.body);
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }
  const leaveType = await LeaveType.findByIdAndUpdate(id, req.body);
  if (leaveType) {
    res.status(200).json(leaveType);
  }
}
