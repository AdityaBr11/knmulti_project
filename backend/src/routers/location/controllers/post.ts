import { Request, Response } from "express";
import { Location } from "../../../models";
import { validateLocation } from "../../../validators";

export default async function controllerPost(req: Request, res: Response) {
  const data = req.body;
  const errors = validateLocation(data);
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }
  const location = new Location(data);
  location.save((err, location) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.status(201).json(location);
  });
}
