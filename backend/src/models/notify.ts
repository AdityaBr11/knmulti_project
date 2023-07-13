import { model } from "mongoose";
import { INotify, notifySchema } from "../db/schema/notify";

export const Notify = model<INotify>("Notify", notifySchema);
