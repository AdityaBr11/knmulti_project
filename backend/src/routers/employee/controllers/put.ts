// create an express put route for the employee controller

import { Request, Response } from "express";
import { Employee } from "../../../models/employee";
import { validateEmployee } from "../../../validators";
import bcrypt from "bcryptjs";
export default async function controllerPut(req: Request, res: Response) {
  const data = req.body;
  // console.log('data',data);
  const errors = validateEmployee(data);
  if (errors.length) {
    res.status(400).json(errors);
    return;
  }
  const { id } = req.params;
  console.log("sa4s",data);
  if (id) {
    data?.password ? data.password = await bcrypt.hash(data?.password, 10):'';
    
    // console.log("sas");
    // console.log('data',data);
    const employee = await Employee.findByIdAndUpdate(id, data);
    if (employee) {
      // console.log("employee",id)
      res.status(200).json(employee);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } else {

    res.status(400).json({ message: "Employee id is required" });
  }
}
