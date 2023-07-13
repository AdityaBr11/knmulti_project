import { Request, Response } from "express";
import { SplitStock } from "../../../models/splitStock";
import { Stock } from "../../../models/stock";
import { TransferStock } from "../../../models/transferStock";

export default async function controllerGet(req: Request, res: Response) {
  try {
    // const populateObj = {
    //   path: "splitStocks",
    //   populate: {
    //     path: "projectId vendorId",
    //     select: "name"
    //   }
    // };

    const stocks = await Stock.find(req.query).populate({path: "vendorId projectId", select: "name"});
    // console.log(stocks);
    res.status(200).json(stocks); 

  } catch (err) {
    res.status(500).json({ msg : "Server error" })
  }
}

export async function splitStockGet(req: Request, res: Response) {
  try {
     
    const splitStock = await SplitStock.find(req.query).populate("stockId").populate("vendorId").populate({path: "projectId", select: "name"});
 
    res.status(200).json(splitStock); 

  } catch (err) {
    res.status(500).json({ msg : "Server error" })
  }
}

export async function transferStockGet(req: Request, res: Response) {
  try {
     
    const transferStock = await TransferStock.find(req.query).populate("stockId").populate({path: "projectTo", select: "name"}).populate({path: "projectFrom", select: "name"});
 
    res.status(200).json(transferStock); 

  } catch (err) {
    res.status(500).json({ msg : "Server error" })
  }
}