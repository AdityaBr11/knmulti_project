import { Request, Response, Router } from "express";
import { RoleAccessPrem } from "../../../models/rolePermissionAccess";

export default async function postRoleAccessPrem(req: Request, res: Response){
  try {
    const roleExits = await RoleAccessPrem.findOne({ role: req.body.role });

    if(roleExits){
      res.status(401).json({ message: "This Role Already Exits" });
    } else{
      const accessData = await RoleAccessPrem.create(req.body);
  
      res.status(201).json(accessData);
    }
    
  } catch (err) {
    res.status(500).json({ message: "Couldn't Post something went wrong" });
  }
}