// create an epxress post route for the creditNote model

import { Request, Response } from "express";
import { CreditNote } from "../../../models";
import putFile from "../../../utils/s3";
import validateCreditNotes from "../../../validators/validateCreditNotes";
import fs from 'fs';
import { generateCreditNotePDF } from "../../../utils/pdf-generation/generatePDF";
import { CustomerTimeline } from "../../../models/customerTimeline";

export default async function controllerPost(req: Request, res: Response) {
  const data = req.body;
  const errors = validateCreditNotes(data);
  if (errors.length) {
    console.log(errors);
    res.status(400).json({ errors });
    return;
  }
  try {
    const latest: any = await CreditNote.find({}).sort({_id: -1}).limit(1);
    latest.length > 0 
      ? data.creditNote = `CN-${parseInt(latest[0].creditNote.split('-')[1])+1}`
      : data.creditNote = 'CN-1'

    data.balance = data.grandTotal;

    const note : any  = await CreditNote.create(data);

    await CustomerTimeline.create({
      customer: note?.customer, 
      timelineType: "Credit Note Created",
      description: `Credit Note ${note?.creditNote} Created`,
      // link: "",
    });

    const uploadedNotes = await CreditNote.findOne({ _id: note._id }).populate(["customer"]);
    const pathToFile = await generateCreditNotePDF(uploadedNotes.toJSON());
    const file = await fs.readFileSync(pathToFile);
    await putFile(file, `${uploadedNotes._id}.pdf`);
    const creditNote = await CreditNote.findByIdAndUpdate(uploadedNotes._id, { pdf_url: `https://knmulti.fra1.digitaloceanspaces.com/${uploadedNotes._id}.pdf` }).populate({ path: 'customer', select: 'displayName billingAddress email' });
    await fs.rmSync(pathToFile);
    res.status(200).send(creditNote);
  } catch (e) {
    res.status(500).json({ msg: "Server Error: Sale Estimate data couldn't be created" });
  }
}