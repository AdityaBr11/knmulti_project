import { Document, Schema, Types } from "mongoose";

interface ICandidate extends Document {
  name: string;
  firstName: string;
  lastName: string;
  job: Types.ObjectId;
  message: string;
  resume: string;
  mobile: string;
  email: string;
  status: string;
  onBoarding: boolean;
  isEmployee: boolean;
  employeeId: number;
  fileInfos?:{
    fileName: string;
    filePath: string;
  };
}

const candidateSchema = new Schema<ICandidate>(
  {
    name: {
      type: String,
      required: true,
    },
    firstName: String,
    lastName: String,
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
    },
    message: {
      type: String,
      required: true,
    },
    resume: {
      type: String
    },
    mobile: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    onBoarding : {
      type: Boolean,
    },
    isEmployee : {  type: Boolean, default: false },
    employeeId : { type: Number, ref: "Employee" },
    fileInfos : {
      fileName: String,
      filePath: String,
    },
  },
  {
    timestamps: true,
  }
);


export { candidateSchema, ICandidate };
