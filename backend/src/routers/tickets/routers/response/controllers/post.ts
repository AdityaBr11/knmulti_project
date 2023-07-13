// create an express post route for tickets replies

import { Request, Response } from "express";
import { Ticket } from "../../../../../models";
import { validateTicketReply } from "../../../../../validators";

export default async function controllerPost(req: Request, res: Response) {
  const { id } = req.params;
  const data = req.body;
  const errors = validateTicketReply(data);
  if (errors.length > 0) {
    return res.status(400).json({
      errors,
    });
  }
  const ticket = await Ticket.findByIdAndUpdate(id);
  if (!ticket) {
    return res.status(404).json({
      message: "Ticket not found",
    });
  }
  ticket.responses.push(data);
  await ticket.save();
  return res.status(201).json(ticket);
}
