import { Request, Response } from "express";
import { Role } from "../../../models";

export default async function controllerGet(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const role = await Role.findById(id).populate("department");
    if (role) {
      res.status(200).json(role);
    } else {
      res.status(404).json({ message: "Role not found" });
    }
  } else {
    const roles = await Role.find().populate("department");
    res.status(200).json(roles);
  }
}
