// create an express get router for calenderEvent model

import { Request, Response } from "express";
import { CalendarEvent } from "../../../models";

export default async function controllerGet(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  if (id) {
    const event = await CalendarEvent.findById(id);
    if (event) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } else {
    const events = await CalendarEvent.find({});
    res.status(200).json(events);
  }
}
