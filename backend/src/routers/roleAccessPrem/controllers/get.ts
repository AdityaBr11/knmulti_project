import { Request, Response, Router } from "express";
import { RoleAccessPrem } from "../../../models/rolePermissionAccess";

export default async function getRoleAccessPrem(req: Request, res: Response){
  try {
    const roleExits = await RoleAccessPrem.find(req.query);

    res.status(201).json(roleExits);
   
  } catch (err) {
    res.status(500).json({ message: "Couldn't Post something went wrong" });
  }
}