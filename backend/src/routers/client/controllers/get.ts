import { Request, Response } from "express";
import { IClient } from "../../../db/schema/client";
import Client from "../../../models/client";

export default async function controllerGet(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const client = await Client.findById(id);
    if (client) {
      res.status(200).json(client);
    } else {
      res.status(404).json({ message: "Client not found" });
    }
  } else {
    const clients: IClient[] = await Client.find();
    res.status(200).json(clients);
  }
}
