import { model } from "mongoose";
import { documentSchema, IDocuments } from "../db/schema/documents";

export const Document = model<IDocuments>("Document", documentSchema);
