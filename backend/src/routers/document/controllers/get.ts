import { Request, Response } from "express";
import { Document } from "../../../models/document";

export default async function controllerGet(
  req: Request,
  res: Response
): Promise<void> {
  const userId = req.params.id || null;
  const query = userId ? { user: userId } : {};
  const documents = await Document.find(query);
  res.status(200).json(documents);
}
