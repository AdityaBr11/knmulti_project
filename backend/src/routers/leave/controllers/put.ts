// create an express put route for the leave model

import { Request, Response } from "express";
import { Leave } from "../../../models";

export default async function controllerPut(req: Request, res: Response) {
  const { id } = req.params;
  const data = req.body;
  const approval = await Leave.findByIdAndUpdate(id, data, {new: true});
  if (!approval) {
    return res.status(404).json({ message: "Approval not found" });
  }
  return res.status(200).json(approval);
}
