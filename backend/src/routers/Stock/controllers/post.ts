
import { Request, Response } from "express";
import moment from "moment";
import { SplitStock } from "../../../models/splitStock";
import { Stock } from "../../../models/stock";
import { TransferStock } from "../../../models/transferStock";

export default async function controllerPost(req: Request, res: Response) {
  try {
    const stock = await Stock.create(req.body);
    res.status(201).json(stock);
  } catch (err) {
    res.status(500).json({ msg : "stocks wasn't created" })
  }
}

export async function billStockPost(req: Request, res: Response) {
  try {
    const resArr = req.body;
    resArr.forEach(async (stk : any) => {
      const stock = await Stock.create(stk);
    });
    res.status(201).json({ msg : "stocks was created" });
  } catch (err) {
    res.status(500).json({ msg : "stocks wasn't created" })
  }
}

export async function splitStockPost(req: Request, res: Response) {
  try {
    const resArr = req.body;
    resArr.forEach(async (stk : any) => {
      const splitStock = await SplitStock.create(stk);
    });
    res.status(201).json({ msg : "Split stocks was created" });
  } catch (err) {
    res.status(500).json({ msg : "Split stocks wasn't created" })
  }
}

export async function transferStockPost(req: Request, res: Response) {
  try {
    const transferStk : any = await TransferStock.create(req.body);
    console.log("Stocks created", transferStk);

    const splitStk : any = await Stock.findById(transferStk.stockId);

    await Stock.findByIdAndUpdate(transferStk.stockId, { quantity: splitStk.quantity - transferStk.transferQuantity,
    leftQuantity: splitStk.leftQuantity - transferStk.transferQuantity
    });
    
    const newSplitStk = {
      stockId: splitStk?._id,
      itemDetails: splitStk?.itemDetails,
      stockNo: `STK-${Math.ceil(Math.random()*100000)}`,
      quantity: transferStk?.transferQuantity,
      leftQuantity: transferStk?.transferQuantity,
      unit: splitStk?.unit,
      consumedQuantity: 0,
      purpose: "nill",
      vendorId: splitStk?.vendorId,
      billId: splitStk?.splitStk,
      date: moment().format("YYYY-MM-DD"),
      projectId: transferStk?.projectTo,

    }

    await Stock.create(newSplitStk);

    res.status(201).json({ msg : "Stocks transferd sucessfully" })
    
  } catch (err) {
    res.status(500).json({ msg : "Transfer of Stock doesn't happened" })
  }
}
 