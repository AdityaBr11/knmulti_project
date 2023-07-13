import { model } from "mongoose";
import { ITicket, ticketSchema } from "../db/schema/tickets";

export const Ticket = model<ITicket>("Ticket", ticketSchema);
