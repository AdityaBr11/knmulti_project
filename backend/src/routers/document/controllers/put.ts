import { Request, Response } from "express";
import { Document } from "../../../models/document";
import { validateDocument } from "../../../validators";

export default async function controllerPut(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  if (!id) {
    res
      .status(400)
      .json({ errors: [{ message: "Document userId is required" }] });
    return;
  }
  const data = req.body;
  const errors = await validateDocument(data);
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }
  const documents = await Document.findOneAndUpdate({ user: id }, data, {
    new: true,
  });
  if (!documents) {
    res.status(400).json({ errors: [{ message: "documents not found" }] });
    return;
  }
  res.status(200).json(documents);
}
