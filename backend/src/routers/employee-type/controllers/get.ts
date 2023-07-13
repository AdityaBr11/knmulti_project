import { Request, Response } from "express";
import { EmployeeType } from "../../../models/";

export default async function controllerGet(
  req: Request,
  res: Response
): Promise<void> {
  const leaveTypes = await EmployeeType.find({});
  res.status(200).json(leaveTypes);
}
