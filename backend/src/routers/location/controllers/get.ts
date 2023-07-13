import { Request, Response } from "express";
import { Location } from "../../../models";

export default async function controllerGet(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const location = await Location.findById(id);
    res.json(location);
  } else {
    const locations = await Location.find({});
    res.json(locations);
  }
}
