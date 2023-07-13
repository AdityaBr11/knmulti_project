import { Document, Schema } from "mongoose";

interface IHoliday extends Document {
  title: string;
  date: Date;
}

const holidaySchema = new Schema<IHoliday>(
  {
    title: String,
    date: Date,
  },
  {
    timestamps: true,
  }
);

export { IHoliday, holidaySchema };
