import { Request, Response } from "express";
import { Role } from "../../../models";
import { validateRole } from "../../../validators";

export default function controllerPost(req: Request, res: Response): void {
  const errors = validateRole(req.body);
  if (errors.length) {
    res.status(400).json(errors);
    return;
  }
  const role = new Role({
    name: req.body.name,
    description: req.body.description,
    department: req.body.department,
    authorities: req.body.authorities,
  });
  role.save((err, role) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.status(200).json(role);
  });
}
