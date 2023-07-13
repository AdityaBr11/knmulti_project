import { Request, Response } from "express";
import { Department } from "../../../models";
import { validateDepartment } from "../../../validators";

export default async function controllerPost(
  req: Request,
  res: Response
): Promise<void> {
  const data = req.body;
  const errors = await validateDepartment(data);
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }
  const department = await Department.create(data);
  if (!department) {
    res.status(400).json({ errors: [{ message: "Department not created" }] });
    return;
  }
  res.status(201).json(department);
}
