import { Schema, Types } from "mongoose";
import { Ticket } from "../../models";

interface ITicketReply {
  reply: string;
  user: Types.ObjectId;
  createdAt: Date;
}

interface ITicket extends Document {
  title: string;
  description: string;
  assignee: number;
  ticket: string;
  followers: number;
  resolutionDeadline: Date;
  status: string;
  priority: string;
  responses: ITicketReply[];
  department: Types.ObjectId;
  client: Types.ObjectId;
}

const ticketSchema = new Schema<ITicket>(
  {
    title: {
      type: String,
      required: true,
    },
    ticket :{
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    assignee: {
      type: Number,
      ref: "Employee",
    },
    followers: {
      type: Number,
      ref: "Employee",
    },
    status: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
    },
    resolutionDeadline: {
      type: Date,
      required: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    responses: {
      default: [],
      type: [
        {
          reply: {
            type: String,
            // required: true,
          },
          user: { type: Schema.Types.ObjectId, ref: "Employee" },
          createdAt: { type: Date, default: Date.now },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

ticketSchema.pre("save", function (next) {
  if (this.isNew) {
    Ticket.countDocuments({}, (err: any, count: any) => {
      if (err) return next(err);
      this._id = count + 1;
      next();
    });
  } else next();
});

export { ITicket, ticketSchema, ITicketReply };
