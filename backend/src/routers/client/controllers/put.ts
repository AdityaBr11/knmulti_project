import { Request, Response } from "express";
import Client from "../../../models/client";
import { validateClient } from "../../../validators";

export default async function controllerPut(req: Request, res: Response) {
  const { id } = req.params;
  const data = req.body;
  const errors = validateClient(data);
  if (errors.length) {
    res.status(400).json(errors);
    return;
  }
  if (id) {
    const client = await Client.findByIdAndUpdate(id, req.body);
    if (client) {
      res.status(200).json(client);
    } else {
      res.status(404).json({ message: "Client not found" });
    }
  } else {
    res.status(400).json({ message: "Client id is required" });
  }
}
