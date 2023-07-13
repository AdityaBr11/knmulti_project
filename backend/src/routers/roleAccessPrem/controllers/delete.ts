import { Request, Response, Router } from "express";
import { RoleAccessPrem } from "../../../models/rolePermissionAccess";

export default async function deleteRoleAccessPrem(req: Request, res: Response){
  try {
    const roleExits = await RoleAccessPrem.findById(req.params.id);

    if(!roleExits){
      res.status(401).json({ message: "This Role dose NOT Exits" });
    } else{

      await RoleAccessPrem.findByIdAndDelete(req.params.id);
  
      res.status(201).json(req.params.id);
    }
    
  } catch (err) {
    res.status(500).json({ message: "Couldn't Delete something went wrong" });
  }
}