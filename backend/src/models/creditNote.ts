import { model } from "mongoose";
import { creditNoteSchema, ICreditNote } from "../db/schema/creditNote";

export const CreditNote = model<ICreditNote>("CreditNote", creditNoteSchema);
