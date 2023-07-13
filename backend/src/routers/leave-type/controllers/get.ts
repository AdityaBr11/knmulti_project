import { Request, Response } from "express";
import { LeaveType } from "../../../models/";

export default async function controllerGet(
  req: Request,
  res: Response
): Promise<void> {
  const leaveTypes = await LeaveType.find({});
  res.status(200).json(leaveTypes);
}
