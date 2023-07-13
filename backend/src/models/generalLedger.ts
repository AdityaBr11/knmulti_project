import { model } from "mongoose";
import { generalLedgerSchema, IGenralLedger } from "../db/schema/generalLedger";


export const GeneralLedger = model<IGenralLedger>(
  "GeneralLedger",
  generalLedgerSchema
);