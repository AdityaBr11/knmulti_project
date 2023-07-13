import { Request, Response } from "express";
import { Timesheet } from "../../../models/timesheet";

export default async function controllerGet(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const timesheet = await Timesheet.find({ employee: id });
    if (timesheet) {
      res.status(200).json(timesheet);
    } else {
      res.status(404).json({ message: "timesheet not found" });
    }
  } else {
    const { page = 1, limit = 250, date = null } = req.query;
    const timesheets = await Timesheet.find({})
      .limit(parseInt(limit as string))
      .skip(parseInt(limit as string) * (parseInt(page as string) - 1));
    res.status(200).json(timesheets);
  }
}
