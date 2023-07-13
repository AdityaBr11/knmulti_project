// create an express put route for tickets

import { Request, Response } from "express";
import { Ticket } from "../../../models";
import { Employee } from "../../../models/employee";
import { validateTicket } from "../../../validators";

export default async function controllerPut(req: Request, res: Response) {
  const { id } = req.params;
  const data = req.body;
  console.log(data);
  const errors = validateTicket(data);
  if (errors.length > 0) {
    return res.status(400).json({
      errors,
    });
  }
  if (data.status === 'Approved' || data.status === 'Returned') {
    const employee: any = await Employee.findById(data.assignee);
    console.log(data._id)
    console.log(employee.ticketsAssigned);
    const newTicketList = employee.ticketsAssigned.filter((v: any, i: any) => v.toString() !== data._id);
    employee.ticketsAssigned = newTicketList;
    console.log(employee.ticketsAssigned);
    await Employee.findByIdAndUpdate(employee._id, employee);
  }
  const ticket = await Ticket.findByIdAndUpdate(id, data);
  return res.status(200).json(ticket);
}
