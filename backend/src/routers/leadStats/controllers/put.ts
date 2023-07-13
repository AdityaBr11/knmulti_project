import { Request, Response } from "express";
import { LeadStatus } from "../../../models/LeadStatus";

export default async function controllerPut(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = req.body;

    const leads = await LeadStatus.find({});
    const index = leads.findIndex((i:any) => i.name === data.name);
    leads.splice(index, 1);
    leads.splice(data.position, 0, data)
    let i = 0;
    for await (let status of leads) {
      status.position = i;
      console.log(status.position);
      if (status.name === data.name) {
        await LeadStatus.create(status);
      } else {
        await LeadStatus.findByIdAndUpdate(status._id, status);
      };
      i++;
    }
    return res.status(200);
    } catch (err) {
    console.log(err)
    res.status(404).send({ msg: 'Error occured while creating status' })
  }};