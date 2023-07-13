// create an express put route for calenderEvent model

import { Request, Response } from "express";
import { CalendarEvent } from "../../../models";
import { validateCalendarEvent } from "../../../validators";

export default async function controllerPut(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }
  const errors = validateCalendarEvent(req.body);
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }
  const event = await CalendarEvent.findByIdAndUpdate(id, req.body);
  if (event) {
    res.status(200).json(event);
  }
}
