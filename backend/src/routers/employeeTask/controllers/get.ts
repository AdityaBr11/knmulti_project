// create ana express get route for goalType model

import { Request, Response } from "express";
import { EmployeeTask } from "../../../models";

export default async function controllerGet(req: Request, res: Response) {
  const employeeTask = await EmployeeTask.find();
  return res.status(200).send(employeeTask);
}
