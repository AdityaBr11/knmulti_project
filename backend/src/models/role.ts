import { model } from "mongoose";
import { IRole, roleSchema } from "../db/schema/role";

export const Role = model<IRole>("Role", roleSchema);
