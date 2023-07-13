import { Request, Response } from "express";
import { Employee } from "../../../models/employee";
import { validateEmployee } from "../../../validators";
import bcrypt from "bcryptjs";

export default async function controllerPost(req: Request, res: Response) {
  const data = req.body;
  // const isempUN = await 
  const errors = validateEmployee(data);
  if (errors.length) {
    res.status(400).json(errors);
    return;
  }
  data.password = await bcrypt.hash(data.password, 10);
  try { 
    const employee = await Employee.create(data);
    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ message: "userName or Email already exits!" });
  }
  // const employee = new Employee(data);
  // employee.save((err, employee) => {
  //   if (err) {
  //     res.status(500).json({ msg: "userName or Email already exits!" });
  //     return;
  //   } else {

  //     res.status(200).json(employee);
  //   }
  // });
}
