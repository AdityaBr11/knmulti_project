import { Request, Response } from "express";
import { Department } from "../../../models";
import { validateDepartment } from "../../../validators";

export default async function controllerPut(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  if (!id) {
    res
      .status(400)
      .json({ errors: [{ message: "Department id is required" }] });
    return;
  }
  const data = req.body;
  const errors = await validateDepartment(data);
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }
  const department = await Department.findByIdAndUpdate(id, data, {
    new: true,
  });
  if (!department) {
    res.status(400).json({ errors: [{ message: "Department not found" }] });
    return;
  }
  res.status(200).json(department);
}
