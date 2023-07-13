import { model } from "mongoose";
import { categorySchema, ICategory } from "../db/schema/category";

export const Category = model<ICategory>("Category", categorySchema);
