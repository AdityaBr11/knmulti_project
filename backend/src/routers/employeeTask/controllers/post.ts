import { Request, Response } from "express";
import { EmployeeTask } from "../../../models";
import { validateEmployeeTask } from "../../../validators";

export default async function controllerPost(
  req: Request,
  res: Response
): Promise<void> {
  const data = req.body;
  const errors = await validateEmployeeTask(data);
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }
  const employeeTask = await EmployeeTask.create(data);
  if (!employeeTask) {
    res.status(400).json({ errors: [{ message: "employee task not created" }] });
    return;
  }
  res.status(201).json(employeeTask);
}
