// create a exptress put route for investment model

import { Request, Response } from "express";
import { Investment } from "../../../models";
import { validateInvestment } from "../../../validators";

export default async function controllerPut(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Invalid request" });
  }
  const data = req.body;
  const errors = validateInvestment(data);
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }
  const investment = await Investment.findByIdAndUpdate(id, data, {
    new: true,
  });
  if (investment) {
    res.status(200).json(investment);
  } else {
    res.status(500).json({ message: "Something went wrong" });
  }
}
