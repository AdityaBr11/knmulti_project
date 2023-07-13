import { ITicket } from "../db/schema/tickets";

const validateTicket = (ticket: ITicket) => {
  if (!ticket) return [{ message: "No data was provided" }];
  const errors: Array<{ message: string }> = [];
  if (!ticket.title) errors.push({ message: "Title is required" });
  if (!ticket.description) errors.push({ message: "Description is required" });
  if (!ticket.department) errors.push({ message: "Department is required" });
  if (!ticket.ticket) errors.push({ message: "Ticket Id is required" });
  // if (!ticket.assignee) errors.push({ message: "Assignee is required" });
  if (!ticket.status) errors.push({ message: "Status is required" });
  if (!ticket.priority) errors.push({ message: "Priority is required" });
  return errors;
};

export default validateTicket;
