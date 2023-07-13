import { Request, Response } from "express";
import { ProvidentFund } from "../../../models";

export default async function controllerDelete(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }
  const providentFund = await ProvidentFund.findByIdAndDelete(id);
  if (providentFund) {
    res.status(200).json(providentFund);
  } else {
    res.status(404).json({ message: "ProvidentFund not found" });
  }
}
