
import { Request, Response } from "express";
import { SplitStock } from "../../../models/splitStock";
import { Stock } from "../../../models/stock";

export default async function controllerDelete(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const stock : any = await Stock.findById(id);
    stock.remove();
    res.status(200).json({ msg : "Stock Deleted" });
  } catch (err) {
    res.status(500).json({ msg: "stock not deleted"})
  }
}  

export async function splitStockDelete(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const splitStock : any = await SplitStock.findById(id);
    splitStock.remove();
    res.status(200).json({ msg : "Split Stock Deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Split stock not deleted"})
  }
}  

