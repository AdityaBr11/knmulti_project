import { Request, Response } from "express";
import { Lead } from "../../../../models";

export default async function controllerGet(req: Request, res: Response) {
  const { id } = req.params;
  const lead = await Lead.findById(id);
  if (!lead) {
    return res.status(404).json({
      message: "Lead not found",
    });
  } else return res.status(200).json(lead);
}
