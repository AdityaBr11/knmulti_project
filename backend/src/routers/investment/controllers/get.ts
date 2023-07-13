import { Request, Response } from "express";
import { Investment } from "../../../models";

export default async function controllerGet(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  if (id) {
    const investment = await Investment.findById(id);
    if (investment) {
      res.status(200).json(investment);
    } else {
      res.status(404).json({ message: "Investment not found" });
    }
  } else {
    const investments = await Investment.find({});
    res.status(200).json(investments);
  }
}
