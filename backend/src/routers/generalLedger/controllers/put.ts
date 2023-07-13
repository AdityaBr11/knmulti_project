import { Request, Response } from "express";
import { GeneralLedger } from "../../../models/generalLedger";

export default async function generalLedgerPut(
  req: Request,
  res: Response
){
  const data = req.body;
  const { ledgerId } = req.params;
  console.log({ ledgerId, data });
  const generalLedger = await GeneralLedger.findByIdAndUpdate(ledgerId, data, { new : true });
  
  res.status(201).json(generalLedger);
}