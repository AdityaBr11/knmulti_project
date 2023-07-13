import { model } from "mongoose";
import { ILocation, locationSchema } from "../db/schema/location";

export const Location = model<ILocation>("Location", locationSchema);
