// create an express put route for providentFund model

import { Request, Response } from "express";
import { ProvidentFund } from "../../../models";
import { validateProvidentFund } from "../../../validators";

export default async function controllerPut(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Invalid request" });
  }
  const data = req.body;
  const errors = validateProvidentFund(data);
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }
  const providentFund = await ProvidentFund.findByIdAndUpdate(id, data);
  if (providentFund) {
    return res.status(200).json(providentFund);
  }
  return res.status(500).json({ message: "Something went wrong" });
}
