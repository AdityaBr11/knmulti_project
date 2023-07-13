// create an express get route for ticket model

import { Request, Response } from "express";
import { Ticket } from "../../../models";

export default async function controllerGet(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const ticket = await Ticket.findById(id)
      .populate("assignee")
      .populate("department");
    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }
    return res.status(200).json(ticket);
  }
  const tickets = await Ticket.find()
    .populate("assignee")
    .populate("department");
  return res.status(200).json(tickets);
}
