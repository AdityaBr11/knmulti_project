// create a post controller for leave
import { Request, Response } from "express";
import { IEmployee } from "../../../db/schema/employee";
import { Leave } from "../../../models";

interface RequestWithUser extends Request {
  user: IEmployee;
}

export default async function controllerPost(
  // req: RequestWithUser,
  req: Request,
  res: Response
) {
  // const employee = req.user;
  const data = req.body;
  const leave = new Leave(data);
  leave.save((err, leave) => {
    if (err) return res.status(400).send(err);
    res.status(201).json(leave);
  });
}
