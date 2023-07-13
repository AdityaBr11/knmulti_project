import { Document, Schema } from "mongoose";

interface ISession {
  id: Number;
  from: Date;
  upto: Date;
}
interface IDescription {
  loggedUser: String;
  id: Number;
  description: String;
}

interface ITimesheet extends Document {
  employee: Number;
  date: Date;
  hours: number;
  description: IDescription[];
  sessions: ISession[];
}

const timesheetSchema = new Schema<ITimesheet>(
  {
    employee: { type: Number, required: true },
    date: Date,
    hours: Number,
    description: [{descId: Number,description:String,loggedUser: String}],
    sessions: [{ sessionId: Number, from: Date, upto: Date }],
  },
  {
    timestamps: true,
  }
);

export { ITimesheet, timesheetSchema };
