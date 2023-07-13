import { Request, Response, Router } from "express";
import { RoleAccessPrem } from "../../../models/rolePermissionAccess";

export default async function updateRoleAccessPrem(req: Request, res: Response){
  try {
    const roleExits = await RoleAccessPrem.findById(req.params.id);

    if(!roleExits){
      res.status(401).json({ message: "This Role dose NOT Exits" });
    } else{
      const accessData = await RoleAccessPrem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
      res.status(201).json(accessData);
    }
    
  } catch (err) {
    res.status(500).json({ message: "Couldn't Update something went wrong" });
  }
}