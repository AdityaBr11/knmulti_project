// create an express get controller for policy model

import { Request, Response } from "express";
import { Policy } from "../../../models";

export default async function controllerGet(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const policy = await Policy.findById(id).populate("department");
    if (!policy) {
      return res.status(404).send({ message: "Policy not found" });
    } else {
      return res.status(200).send(policy);
    }
  } else {
    const policies = await Policy.find({}).populate("department");
    res.status(200).send(policies);
  }
}
