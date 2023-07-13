import { Schema } from "mongoose";

interface ILocation extends Document {
  name: string;
}

const locationSchema = new Schema<ILocation>(
  {
    name: String,
  },
  {
    timestamps: true,
  }
);

export { ILocation, locationSchema };
