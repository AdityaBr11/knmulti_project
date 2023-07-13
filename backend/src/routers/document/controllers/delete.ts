import { Request, Response } from "express";
import { Document } from "../../../models/document";

export default async function controllerDelete(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  if (!id) {
    res
      .status(400)
      .json({ errors: [{ message: "Documents userId is required" }] });
    return;
  }
  const documents = await Document.findOneAndDelete({ user: id });
  if (!documents) {
    res.status(400).json({ errors: [{ message: "documents not found" }] });
    return;
  }
  res.status(200).json(documents);
}
