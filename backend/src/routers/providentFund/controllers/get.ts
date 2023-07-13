// create a express get route for providentFund model

import { Request, Response } from "express";
import { ProvidentFund } from "../../../models";

export default async function controllerGet(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const providentFund = await ProvidentFund.findById(id);
    if (providentFund) {
      res.status(200).json(providentFund);
    } else {
      res.status(404).json({ message: "ProvidentFund not found" });
    }
  } else {
    const providentFunds = await ProvidentFund.find({});
    res.status(200).json(providentFunds);
  }
}
