// create am express delete route for load model

import { Request, Response } from "express";
import { Lead } from "../../../models";

export default async function controllerDelete(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const load = await Lead.findByIdAndDelete(id);
    if (!load) {
      return res.status(404).send({ message: "Load not found" });
    } else {
      return res.status(200).send(load);
    }
  } else {
    res.status(400).send({ message: "id is required" });
  }
}
