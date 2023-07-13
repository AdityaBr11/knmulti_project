// create an express get route for lead model

import { Request, Response } from "express";
import { Lead } from "../../../models";

export default async function controllerGet(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const lead = await Lead.findById(id)
      .populate('createdBy')
      .populate('assignedTo')
      .populate('currentAssigned')
      .populate('project')
      .populate('status')
    if (!lead) {
      return res.status(404).send({ message: "Lead not found" });
    } else {
      return res.status(200).send(lead);
    }
  } else {
    const leads = await Lead.find({})
      .populate('createdBy')
      .populate('assignedTo')
      .populate('currentAssigned')
      .populate('project')
      .populate('status').sort({ updatedAt: -1 })
    res.status(200).send(leads);
  }
}

export async function controllerGetByEmployee(req: Request, res: Response) {
  
  const { id } = req.params;
  if (id) {
    // const leads: any = await Lead.find({ currentAssigned: id })
    const leads: any = await Lead.find({ createdBy : id })
      .populate('createdBy')
      .populate('assignedTo')
      .populate('currentAssigned')
      .populate('project')
      .populate('status');
    if (!leads) {
      return res.status(404).send({ message: "Lead not found" });
    } else {
      
      return res.status(200).send(leads);
    }
  } else {
    return res.status(404).send({ message: "No employee provided" });
  }
}
