import { model } from "mongoose";
import {
  calendarEventSchema,
  ICalendarEvent,
} from "../db/schema/calendarEvent";

export const CalendarEvent = model<ICalendarEvent>(
  "CalendarEvent",
  calendarEventSchema
);
