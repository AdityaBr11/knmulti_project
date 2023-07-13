// create an express post route for general ledger for the generalLeger Model 

import { Request, Response } from "express";
import { GeneralLedger } from "../../../models/generalLedger";

export default async function generalLedgerPost(
  req: Request,
  res: Response
){
  const data = req.body;
  const generalLedger = new GeneralLedger(data);
  generalLedger.save((err, generalLedger) => {
    if (err) return res.status(400).send(err);
    return res.status(201).json(generalLedger);
  });
}