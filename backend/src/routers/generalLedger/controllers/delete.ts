import { Request, Response } from "express";
import { GeneralLedger } from "../../../models/generalLedger";

export default async function generalLedgerDelete(
  req: Request,
  res: Response
){
  const {ledgerId} = req.params;
  await GeneralLedger.findByIdAndDelete(ledgerId);
  
  res.status(200).json({ msg: "Ledger Delete Sucessfully" });
}