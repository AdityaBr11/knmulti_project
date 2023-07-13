
import { Request, Response } from "express";
import { Payroll } from "../../../models/payroll";

export default async function controllerPost(req: Request, res: Response) {
  try {
    const payroll = await Payroll.create(req.body);
    console.log('200')
    res.status(201).json(payroll);
  } catch (err) {
    console.log('500')
    res.status(500).json({ msg : "Payrolls wasn't created" })
  }
}