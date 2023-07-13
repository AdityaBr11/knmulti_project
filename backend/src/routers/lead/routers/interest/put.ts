import { Request, Response } from "express";
import { Lead } from "../../../../models";

export default async function controllerPut(req: Request, res: Response) {
  const { id } = req.params;
  const lead = await Lead.findById(id);
  if (!lead) {
    return res.status(404).json({
      message: "Lead not found",
    });
  }
  const { project, plot, leadType } = req.body;
  if (!project || !plot) {
    return res.status(400).json({
      message: "Project and Plot are required",
    });
  }
  // const leadPlot = lead.interest.find();
}
