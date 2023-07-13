import { Request, Response } from "express";
import { LandSale } from "../../../models/landSale";

export default async function controllerPut(req: Request, res: Response) {
  try {
    const id = req.params.id;

    const landSale = await LandSale.findByIdAndUpdate(id, req.body);
    res.status(201).json(landSale);
  } catch (err) {
    res.status(500).json({ msg : "land Sales wasn't updated" })
  }
}