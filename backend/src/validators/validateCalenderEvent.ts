import { ICalendarEvent } from "../db/schema/calendarEvent";

const validateCalendarEvent = (data: ICalendarEvent) => {
  if (!data) return [{ message: "No data was provided" }];
  const errors: Array<{ message: string }> = [];
  // if (!data.title) errors.push({ message: "Title is required" });
  // if (!data.date) errors.push({ message: "Start date is required" });
  // if (!data.time) errors.push({ message: "End date is required" });
  // if (!data.description) errors.push({ message: "Description is required" });
  return errors;
};

export default validateCalendarEvent;
