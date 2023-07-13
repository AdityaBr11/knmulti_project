import { Request, Response } from "express";
import { Lead } from "../../../models";
import { LeadStatus } from "../../../models/LeadStatus";

export default async function controllerDelete(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const lead: any = await Lead.find({ status: id });
    if (lead.length > 0) {
      return res.status(200).send({ length: lead.length });
    } else {
      const leads = await LeadStatus.find();
      const status: any = await LeadStatus.findByIdAndDelete(id);
      
      for await (const l of leads) {
        if (l.position > status.position) {
          l.position -= 1;
          await LeadStatus.findByIdAndUpdate(l.id, l);
        }
      }

      return res.status(200).send({ msg: 'deleted successfully' });
    }
  } catch (err) {
    console.log(err)
  }
}