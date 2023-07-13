import { Document, Schema } from "mongoose";

interface ISubCategory {
  name: string;
  description: string;
}

interface ICategory extends Document {
  name: string;
  description: string;
  subCategories: ISubCategory[];
}

const categorySchema = new Schema<ICategory>(
  {
    name: String,
    description: String,
    subCategories: [
      {
        name: String,
        description: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export { ICategory, categorySchema };
