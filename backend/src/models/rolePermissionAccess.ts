import { model } from "mongoose";
import { IRolePermisionAccseeSchema, rolePermisionAccseeSchema } from "../db/schema/rolePermissionAccess";

export const RoleAccessPrem = model<IRolePermisionAccseeSchema>("RoleAccessPrem", rolePermisionAccseeSchema);