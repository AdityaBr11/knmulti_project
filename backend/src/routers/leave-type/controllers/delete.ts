// create an express delete route for leave type modle

import { Request, Response } from "express";
import { LeaveType } from "../../../models";

export default async function controllerDelete(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  if (id) {
    const leaveType = await LeaveType.findByIdAndDelete(id);
    if (leaveType) {
      res.status(200).json(leaveType);
    } else {
      res.status(404).json({ message: "Leave type not found" });
    }
  } else {
    res.status(400).json({ message: "Invalid request" });
  }
}
