import { Request, Response } from "express";
import { Department } from "../../../models";

export default async function controllerGet(
  req: Request,
  res: Response
): Promise<void> {
  const deptId = req.params.id || null;
  const query = deptId ? { _id: deptId } : {};
  const departments = await Department.find(query);
  res.status(200).json(departments);
}
