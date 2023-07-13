import { Request, Response } from "express";
import { Investment } from "../../../models";

export default async function controllerDelete(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }
  const investment = await Investment.findByIdAndDelete(id);
  if (investment) {
    res.status(200).json(investment);
  } else {
    res.status(404).json({ message: "Investment not found" });
  }
}
