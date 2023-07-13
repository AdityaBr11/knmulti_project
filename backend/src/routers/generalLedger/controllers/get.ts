import { Request, Response } from "express";
import { Customer, Vendor } from "../../../models";
import { Employee } from "../../../models/employee";
import { GeneralLedger } from "../../../models/generalLedger";


export default async function generalLedgerGet(req: Request, res: Response) {
  const generalLedger = await GeneralLedger.find(req.query).populate({ path: "vendor", select: "name" }).populate({ path: "customer", select: "displayName" }).populate({ path: "employee", select: "name" }).sort({ updatedAt: -1 });
  res.status(200).json(generalLedger);
}

export async function userTypeGet(req: Request, res: Response) {
  const employee = await Employee.find().select("name");
  const vendor = await Vendor.find().select("name");
  const customer = await Customer.find().select("displayName");

  const userTypeList = {
    vendor,
    customer,
    employee,
  }

  res.status(200).json(userTypeList);
}

export async function getTransectionByUserId(req: Request, res: Response){
  const userTransaction = await GeneralLedger.find(req.query);
  res.status(200).json(userTransaction);
}
