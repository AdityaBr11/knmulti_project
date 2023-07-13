import { Request, Response } from "express";
import { SplitStock } from "../../../models/splitStock";
import { Stock } from "../../../models/stock";

export default async function controllerPut(req: Request, res: Response) {
  try {
    
    const { id } = req.params;
    const stock = await Stock.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(stock);

  } catch (err) {
    res.status(500).json({ msg : "Stock was not updated" })
  }
} 

export async function SplitStkPut(req: Request, res: Response) {
  try {
    
    const { id } = req.params;
    const splitStock = await SplitStock.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(splitStock);

  } catch (err) {
    res.status(500).json({ msg : "Split Stock was not updated" })
  }
} 