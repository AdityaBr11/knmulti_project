import { model } from "mongoose";
import { IPolicy, policySchema } from "../db/schema/policy";

export const Policy = model<IPolicy>("Policy", policySchema);
