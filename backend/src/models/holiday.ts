import { model } from "mongoose";
import { holidaySchema } from "../db/schema/holiday";

export const Holiday = model("Holiday", holidaySchema);
