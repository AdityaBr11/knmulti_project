// create a express post route for Calender event model

import { Request, Response } from "express";
import { CalendarEvent } from "../../../models";
import { validateCalendarEvent } from "../../../validators";

export default async function (req: Request, res: Response): Promise<void> {
  const data = req.body;
  const errors = validateCalendarEvent(data);
  if (errors.length) {
    res.status(400).json({ errors });
  }
  const event = await CalendarEvent.create(data);
  res.status(201).json(event);
}
