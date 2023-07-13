// create a delete controller for leave

import { Request, Response } from "express";
import { Leave } from "../../../models/leave";

export default async function controllerDelete(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) return res.status(400).send({ error: "id is required" });
  const leave = await Leave.findByIdAndDelete(id);
  if (!leave) return res.status(404).json({ error: "Leave not found" });
  res.status(200).json(leave);
}
