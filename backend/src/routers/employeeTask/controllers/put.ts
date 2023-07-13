// create an express put  route for goalType model

import { Request, Response } from "express";
import { EmployeeTask } from "../../../models";

export default async function controllerPut(req: Request, res: Response) {
  const { id } = req.params;
  const data = req.body;
  const employeeTask = await EmployeeTask.findByIdAndUpdate(id, data);
  if (!employeeTask) return res.status(404).send("employeeTask not found");
  return res.status(200).send(employeeTask);
}
