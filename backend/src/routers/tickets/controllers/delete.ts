// create an express delete route for tickets

import { Request, Response } from "express";
import { Ticket } from "../../../models";
import { Employee } from "../../../models/employee";

export default async function controllerDelete(req: Request, res: Response) {
  const { id } = req.params;
  const ticket = await Ticket.findById(id);
  if (!ticket) {
    return res.status(404).json({
      message: "Ticket not found",
    });
  };
  if (ticket.status === 'Active') {
    const employee: any = await Employee.findById(ticket.assignee);
    console.log(id)
    console.log(employee.ticketsAssigned);
    const ticketsAssigned = employee.ticketsAssigned.filter((v: any, i: any) => v.toString() !== id);
    employee.ticketsAssigned = ticketsAssigned;
    console.log(employee.ticketsAssigned);
    await Employee.findByIdAndUpdate(employee._id);
  }
  await ticket.remove();
  return res.status(200).json({
    message: "Ticket deleted",
  });
}
