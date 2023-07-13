// create an approval get request

import { Request, Response } from "express";
import { Approval } from "../../../models";

export async function controllerGetLeaves(req: Request, res: Response) {
  const approvals = await Approval.find({ type: "leave" });
  res.status(200).json(approvals);
}
