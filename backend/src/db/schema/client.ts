import { Document, Schema } from "mongoose";

interface IClient extends Document {
  id: Number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  address: string;
}

const clientSchema = new Schema<IClient>(
  {
    id: Number,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    company: String,
    address: String,
  },
  {
    timestamps: true,
  }
);

export { IClient, clientSchema };
