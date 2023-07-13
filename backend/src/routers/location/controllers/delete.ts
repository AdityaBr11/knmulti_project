import { Request, Response } from "express";
import { Location } from "../../../models";

export default async function controllerDelete(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const location = await Location.findByIdAndDelete(id);
    res.json(location);
  } else {
    res.status(400).json({ message: "id is required" });
  }
}
