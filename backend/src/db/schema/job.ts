import { Document, Schema } from "mongoose";

interface IJob extends Document {
  title: string;
  department: Schema.Types.ObjectId;
  location: Schema.Types.ObjectId;
  numberOfVacancies: number;
  experience: string;
  salaryFrom: number;
  salaryTo: number;
  jobType: string;
  status: Boolean;
  startDate: Date;
  endDate: Date;
  description: string;
}

const jobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    numberOfVacancies: {
      type: Number,
      required: true,
    },
    experience: {
      type: String,
    },
    salaryFrom: {
      type: Number,
      required: true,
    },
    salaryTo: {
      type: Number,
      required: true,
    },
    jobType: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals : true },
    toObject: { virtuals : true }
  }
);

jobSchema.virtual("candidates", {
  ref: "Candidate",
  localField: "_id",
  foreignField: "job",
  justOne: false
});

export { jobSchema, IJob };
