import { Request, Response } from "express";
import { EmployeeTask } from "../../../models";

export default async function controllerDelete(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  if (!id) {
    res
      .status(400)
      .json({ errors: [{ message: "employeeTask id is required" }] });
    return;
  }
  const employeeTask = await EmployeeTask.findByIdAndDelete(id);
  if (!employeeTask) {
    res.status(400).json({ errors: [{ message: "employeeTask not found" }] });
    return;
  }
  res.status(200).json(employeeTask);
}

