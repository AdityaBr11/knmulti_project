// create an expres deleet route for the creditNote model

import { Request, Response } from "express";
import { CreditNote } from "../../../models";
import { CustomerTimeline } from "../../../models/customerTimeline";
import { deleteFile } from "../../../utils/s3";

export default async function controllerDelete(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const note = await CreditNote.findByIdAndDelete(id);

    await CustomerTimeline.create({
      customer: note?.customer, 
      timelineType: "Credit Note Deleted",
      description: `Credit Note ${note?.creditNote} Deleted`,
      // link: "",
    });

    if (!note) {
      return res.status(404).json({ message: "Credit Note not found" });
    }
    return res.status(200).json(note);
  }
  await deleteFile(`${id}.pdf`);
  const notes = await CreditNote.find({});
  return res.status(200).json(notes);
}
