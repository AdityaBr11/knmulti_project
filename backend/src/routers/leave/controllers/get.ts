// create a get controller for leave

import { Request, Response } from "express";
import { IEmployee } from "../../../db/schema/employee";
import { Leave } from "../../../models";

interface RequestWithUser extends Request {
  user: IEmployee;
}

export default async function controllerGet(
  // req: RequestWithUser,
  req: Request,
  res: Response
) {
  // const employee = req.user;
  // const employeeLeaves = await Leave.find({ employee: employee._id });

  const query = req.params.id ? {employee: req.params.id} : {};
  const employeeLeaves = await Leave.find(query).populate("leaveType").populate({ 
    path: "employee", select: "name jobRole",
    populate : {
      path: "jobRole",
      select: "name"
    }
  });
  res.status(200).json(employeeLeaves);
}
