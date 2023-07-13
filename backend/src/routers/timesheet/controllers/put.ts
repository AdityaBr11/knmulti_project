// create an express put route for the timesheets controller

import { Request, Response } from "express";
import { Timesheet } from "../../../models/timesheet";
import { validateTimesheet } from "../../../validators";

export default async function controllerPut(req: Request, res: Response) {
  const data = req.body;
  const errors = validateTimesheet(data);
  if (errors.length) {
    res.status(400).json(errors);
    return;
  }
  const { id } = req.params;
  if (id) {
    const timesheet = await Timesheet.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          employee: data.employee,
          date: data.date,
          hours: data.hours,
          sessions: data.sessions,
        },
        $push: { description: {description:data.description,loggedUser:data?.loggedUser} },
      }
    );
    if (timesheet) {
      res.status(200).json(timesheet);  
    } else {
      res.status(404).json({ message: "timesheet not found" });
    }
  } else {
    res.status(400).json({ message: "Employee id is required" });
  }
}
