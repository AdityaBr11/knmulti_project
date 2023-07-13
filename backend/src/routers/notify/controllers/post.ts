import { Request, Response } from "express";
import { Notify } from "../../../models/notify";

export default async function controllerPost(req: Request, res: Response) {
  try {
    const notifyData = await Notify.create(req.body);
    res.status(201).json(notifyData);
  } catch (err) {
    res.status(500).json({ msg : "Notification wasn't created" })
  }
}