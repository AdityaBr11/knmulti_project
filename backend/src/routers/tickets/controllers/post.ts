// create an express post route for tickets

import { Request, Response } from "express";
import { Ticket } from "../../../models";
import { Employee } from "../../../models/employee";
import { validateTicket } from "../../../validators";

export default async function controllerPost(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = req.body;
    const errors = validateTicket(data);
    if (errors.length > 0) {
      return res.status(400).json({
        message: "Ticket not created",
        errors,
      });
    }
    const ticket = await Ticket.create(data);
    const employee: any = await Employee.findById(ticket.assignee);
    employee?.ticketsAssigned.push(ticket._id);
    await Employee.findByIdAndUpdate(employee?._id, employee);
    return res.status(201).json(ticket);
    console.log('done');
  } catch (e) {
    console.log(e)
  }
}
