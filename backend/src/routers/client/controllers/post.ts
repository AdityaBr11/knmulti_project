// create an express post route for client

import { Request, Response } from "express";
import Client from "../../../models/client";
import { validateClient } from "../../../validators";

export default async function controllerPost(req: Request, res: Response) {
  const data = req.body;
  const errors = validateClient(data);
  if (errors.length) {
    res.status(400).json(errors);
    return;
  }
  const client = new Client(data);
  client.save((err: any, client: any) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.status(200).json(client);
  });
}
