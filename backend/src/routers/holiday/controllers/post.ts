import { Request, Response } from "express";
import { Holiday } from "../../../models/holiday";
import { validateHoliday } from "../../../validators";

export default async function (req: Request, res: Response): Promise<void> {
  const data = req.body;
  const errors = validateHoliday(data);
  if (errors.length) {
    res.status(400).json({ errors });
  }
  const holiday = await Holiday.create(data);
  if (holiday) {
    res.status(201).json(holiday);
  } else {
    res.status(500).json({ message: "Something went wrong" });
  }
}
