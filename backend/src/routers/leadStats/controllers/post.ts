
import { Request, Response } from "express";
import { LeadStatus } from "../../../models/LeadStatus";

export default async function controllerPost(
  req: Request,
  res: Response
) {
  try {
    const data = req.body;
    const leads = await LeadStatus.find();
    leads.sort((a,b) => b.position - a.position);
    for await (const status of leads) {
      if (status.position >= data.position) {
        status.position += 1;
        await LeadStatus.findByIdAndUpdate(status._id, status);
      }
    }
    const lead = await LeadStatus.create(data);
    res.status(200).json(lead);    
  } catch (err) {
    console.log(err)
    res.status(404).send({ msg: 'Error occured while creating status' })
  }
}
