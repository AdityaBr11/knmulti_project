// crean an express delete controller for policy model

import { Request, Response } from "express";
import { Policy } from "../../../models";

export default async function controllerDelete(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send({ message: "Invalid request" });
  }
  const policy = await Policy.findByIdAndDelete(id);
  if (!policy) {
    return res.status(404).send({ message: "Policy not found" });
  } else {
    return res.status(200).send(policy);
  }
}
