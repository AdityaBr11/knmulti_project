
import { Request, Response } from "express";
import { Payroll } from "../../../models/payroll";


export default async function controllerDelete(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await Payroll.findByIdAndRemove(id);
    res.status(200).json({ msg : "payroll Deleted" });
  } catch (err) {
    res.status(500).json({ msg: "payroll not deleted"})
  }
}  