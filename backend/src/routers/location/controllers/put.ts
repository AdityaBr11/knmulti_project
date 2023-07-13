// create an expres put controller for location

import { Request, Response } from "express";
import { Location } from "../../../models";
import { validateLocation } from "../../../validators";

export default async function controllerPut(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }
  const errors = validateLocation(req.body);
  const location = await Location.findByIdAndUpdate(id, req.body);
  if (location) {
    res.status(200).json(location);
  } else {
    res.status(500).json({ message: "Something went wrong" });
  }
}
