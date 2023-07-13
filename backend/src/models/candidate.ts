import { model } from "mongoose";
import { candidateSchema, ICandidate } from "../db/schema/candidate";

export const Candidate = model<ICandidate>("Candidate", candidateSchema);
