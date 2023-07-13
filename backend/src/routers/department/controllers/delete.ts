import { Request, Response } from "express";
import { Department } from "../../../models";

export default async function controllerDelete(
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
  const department = await Department.findByIdAndDelete(id);
  if (!department) {
    res.status(400).json({ errors: [{ message: "Department not found" }] });
    return;
  }
  res.status(200).json(department);
}
