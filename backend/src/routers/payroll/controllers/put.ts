import { Request, Response } from "express";
import { Payroll } from "../../../models/payroll";

export default async function controllerPut(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const payrollData = await Payroll.findByIdAndUpdate(id, req.body, { new: true });
    console.log('200');
    res.status(200).json(payrollData);
  } catch (err) {
    res.status(500).json({ msg : "Payroll was not updated" })
  }
} 