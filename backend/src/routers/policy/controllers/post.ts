// create an express post controller for policy model

import { Request, Response } from "express";
import { Policy } from "../../../models";
import validatePolicy from "../../../validators/validatePolicy";

export default async function controllerPost(req: Request, res: Response) {
  const { body } = req;
  const errors = validatePolicy(body);
  if (errors.length) {
    return res.status(400).send({ errors });
  }
  const policy = await Policy.create(body);
  if (!policy) {
    return res.status(400).send({ message: "Invalid request" });
  } else {
    return res.status(200).send(policy);
  }
}
