import { Document, Schema } from "mongoose";

interface Uploads {
  data: String;
  description: String;
  uploadedAt: Date;
}

interface IDocuments extends Document {
  user: Number;
  uploads: Uploads[];
}

const documentSchema = new Schema<IDocuments>(
  {
    user: {
      type: Number,
      required: true,
      unique: true,
    },
    uploads: [
      {
        data: String,
        description: String,
        uploadedAt: Date,
      },
    ],
  },
  {
    _id: false,
    timestamps: true,
  }
);

export { IDocuments, documentSchema };
