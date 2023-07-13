import { Request, Response } from "express";
import Client from "../../../models/client";

export default async function controllerDelete(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const client = await Client.findByIdAndDelete(id);
    if (client) {
      res.status(200).json(client);
    } else {
      res.status(404).json({ message: "Client not found" });
    }
  } else {
    res.status(400).json({ message: "Client id is required" });
  }
}
