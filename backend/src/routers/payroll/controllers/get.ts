import { Request, Response } from "express";
import { Payroll } from "../../../models/payroll";

export default async function controllerGet(req: Request, res: Response) {
  try {
    const populateObj = {
      path: "employeeId",
      select:"name jobRole",
      populate: {
        path: "jobRole"
      }
    };

    const payrollData = await Payroll.find(req.query).populate(populateObj);

    res.status(200).json(payrollData);

  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
}