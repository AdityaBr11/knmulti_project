import { Request, Response } from "express";
import { Document } from "../../../models/document";
import { validateDocument } from "../../../validators";

export default async function controllerPost(
  req: Request,
  res: Response
): Promise<void> {
  const data = req.body;
  const errors = validateDocument(data);
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }
  const documents = await Document.create(data);
  if (!documents) {
    res.status(400).json({ errors: [{ message: "Document not saved" }] });
    return;
  }
  res.status(201).json(documents);
}
