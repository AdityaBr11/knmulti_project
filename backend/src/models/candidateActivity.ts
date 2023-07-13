import { model } from "mongoose";
import {
  candidateActivitySchema,
  ICandidateActivity,
} from "../db/schema/candidateActivity";

export const CandidateActivity = model<ICandidateActivity>(
  "CandidateActivity",
  candidateActivitySchema
);
