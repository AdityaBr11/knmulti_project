import { Request, Response } from "express";
import { Employee } from "../../../models/employee";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IEmployee } from "../../../db/schema/employee";

export default async function loginController(req: Request, res: Response) {
  const { userName, password } = req.body;
  if (userName && password) {
    const employee: IEmployee = await Employee.findOne({
      $or: [{ userName }, { email: userName }],
    }).populate("jobRole")!;
    if (employee) {
      const isMatch = await bcrypt.compare(password, employee.password);
      employee.password = "";
      if (isMatch) {
        jwt.sign(
          {
            id: employee._id,
            authorities: (employee.jobRole as any).authorities.concat(
              employee.userAuthorites
            ),
          },
          process.env.JWT_SECRET!,
          (err: any, token: any) => {
            console.log(err);
            if (err) res.status(500).json(err);
            else
              res.status(200).json({
                token,
                user: employee,
              });
          }
        );
      } else {
        res.status(401).json({ message: "Incorrect password" });
      }
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  }
}
