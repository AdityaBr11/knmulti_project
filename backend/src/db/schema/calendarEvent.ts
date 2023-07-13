import { Document, Schema } from "mongoose";
import { CALENDER_CATEGORY_TYPE } from "../../constants";

interface ICalendarEvent extends Document {
  title: string;
  time: Date;
  date: Date;
  type: CALENDER_CATEGORY_TYPE;
  description: string;
}

const calendarEventSchema = new Schema<ICalendarEvent>(
  {
    title: String,
    time: Date,
    date: Date,
    description: String,
    type: { type: String, enum: Object.values(CALENDER_CATEGORY_TYPE) },
  },
  {
    timestamps: true,
  }
);

export { ICalendarEvent, calendarEventSchema };
