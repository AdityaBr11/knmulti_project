import { Request, Response } from "express";
import { Role } from "../../../models";
import { validateRole } from "../../../validators";

export default async function controllerPut(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const data = req.body;
    const errors = validateRole(data);
    if (errors.length) {
      res.status(400).json(errors);
      return;
    }
    const role = await Role.findByIdAndUpdate(id, req.body);
    if (role) {
      res.status(200).json(role);
    } else {
      res.status(404).json({ message: "Role not found" });
    }
  } else {
    res.status(400).json({ message: "Role id is required" });
  }
}
