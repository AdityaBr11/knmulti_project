import { Request, Response } from "express";
import { Holiday } from "../../../models/holiday";

export default async function controllerGet(
  req: Request,
  res: Response
): Promise<void> {
  const holidays = await Holiday.find({});
  res.status(200).json(holidays);
}
