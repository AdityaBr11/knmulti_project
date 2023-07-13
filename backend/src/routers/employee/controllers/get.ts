import { Request, Response } from "express";
import { Employee } from "../../../models/employee";

export default async function controllerGet(req: Request, res: Response) {
  const { id } = req.params;
  console.log(id);
  if (id) {
    const employee = await Employee.findById(id, {
      password: 0,
    }).populate("jobRole").populate("workLocation").populate("department");
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } else {
    const { page = 1, limit = 100 } = req.query;
    const employees = await Employee.find(
      {},
      {
        password: 0,
      }
    )
      .populate("jobRole").populate("workLocation").populate("department")
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit as string))
      .skip(parseInt(limit as string) * (parseInt(page as string) - 1));
    // console.log(employees)
    res.status(200).json(employees);
  }
}
