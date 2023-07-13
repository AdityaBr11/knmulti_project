import { Document, Schema, Types } from "mongoose";
import { PRIORITY } from "../../constants";
import { Project } from "../../models";

interface ITaskDiscussion {
  dateTime: Date;
  message: string;
}

interface ITask extends Document {
  description: string;
  discussions: ITaskDiscussion[];
  project: Types.ObjectId;
  users: number[];
  status?: boolean;
  markedAsDone?: Date;
  markedAsDoneBy?: number;
  lead?: Types.ObjectId;
  name: string;
}

const taskSchema = new Schema<ITask>(
  {
    description: String,
    name: String,
    discussions: {
      type: [
        {
          dateTime: Date,
          message: String,
        },
      ],
      default: [],
    },
    project: { type: Schema.Types.ObjectId, ref: "Project" },
    lead: { type: Schema.Types.ObjectId, ref: "Lead" },
    users: [{ type: Number, ref: "Employee" }],
    status: {
      type: Boolean,
      default: false,
    },
    markedAsDone: Date,
    markedAsDoneBy: { type: Number, ref: "Employee" },
  },
  {
    timestamps: true,
  }
);

export { ITask, taskSchema };
