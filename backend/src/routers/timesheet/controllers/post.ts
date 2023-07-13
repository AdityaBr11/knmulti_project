import { Request, Response } from "express";
import { validateTimesheet } from "../../../validators";
import { Timesheet } from "../../../models/timesheet";

export default async function controllerPost(req: Request, res: Response) {
  const data = req.body;
  const errors = validateTimesheet(data);
  if (errors.length) {
    res.status(400).json(errors);
    return;
  }
  const timesheet = await Timesheet.create({
    loggedUser: data.loggedUser,
    employee: data.employee,
    date: data.date,
    hours: data.hours,
    sessions: data.sessions,
    description: { description: data.description, loggedUser:data?.loggedUser },
  });
  if (timesheet) {
    res.status(200).json(timesheet);
  } else {
    res.status(404).json({ message: "timesheet not found" });
  }
}
