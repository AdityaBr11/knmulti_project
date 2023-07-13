// create an express get route for ticket model

import { Request, Response } from "express";
import { Ticket } from "../../../../../models";

export default async function controllerGet(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }
    return res.status(200).json(ticket);
  } else {
    res.status(200).json({ message: "No ticket id provided" });
  }
}
