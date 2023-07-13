import { Request, Response } from "express";
import { Notify } from "../../../models/notify";

export default async function controllerDelete(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const notify = await Notify.findByIdAndDelete(id);
    if (!notify) {
      return res.status(404).send({ message: "notification not found" });
    } else {
      return res.status(200).send(notify);
    }
  } else {
    res.status(400).send({ message: "id is required" });
  }
}
