// create an express get route for ticket replies

import { Request, Response } from "express";
import { Ticket } from "../../../../../models";

export default async function controllerDelete(req: Request, res: Response) {
  const { id } = req.params;
  const { ticketIndex } = req.query;
  if (id) {
    const ticket = await Ticket.findOne({ _id: id })!;
    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }
    ticket.responses = ticket.responses.filter(
      (response, index) => index !== Number(ticketIndex)
    );
    await ticket.save();
    return res.status(200).json(ticket);
  }
}
