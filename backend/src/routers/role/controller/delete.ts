import { Request, Response } from "express";
import { Role } from "../../../models";

export default async function controllerDelete(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const role = await Role.findByIdAndDelete(id);
    if (role) {
      res.status(200).json(role);
    } else {
      res.status(404).json({ message: "Role not found" });
    }
  } else {
    res.status(400).json({ message: "Role id is required" });
  }
}
