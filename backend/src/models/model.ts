import { model } from "mongoose";
import { approvalSchema, IApproval } from "../db/schema/approval";

export const Approval = model<IApproval>("Approval", approvalSchema);
