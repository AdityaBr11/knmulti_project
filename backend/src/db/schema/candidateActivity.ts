import { Document, Schema } from "mongoose";

interface ICandidateActivity extends Document {
  note: string;
  candidate: Schema.Types.ObjectId;
}

const candidateActivitySchema = new Schema<ICandidateActivity>(
  {
    note: {
      type: String,
    },
    candidate: {
      type: Schema.Types.ObjectId,
      ref: "Job",
    },
  },

  {
    timestamps: true,
  }
);

export { candidateActivitySchema, ICandidateActivity };
