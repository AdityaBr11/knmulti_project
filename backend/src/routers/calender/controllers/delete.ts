// create an express delete router for calenderEvent model

import { Request, Response } from "express";
import { CalendarEvent } from "../../../models";

export default async function controllerDelete(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  if (id) {
    const event = await CalendarEvent.findByIdAndDelete(id);
    if (event) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } else {
    res.status(400).json({ message: "Invalid request" });
  }
}
