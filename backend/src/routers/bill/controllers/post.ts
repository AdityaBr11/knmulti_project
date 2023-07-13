// create an express post route for the bill model

import { Response } from "express";
import { Bill } from "../../../models/bill";
import RequestWithUser from "../../../utils/requestWithUser";

export default async function controllerPost(
  req: RequestWithUser,
  res: Response
) {
  const data = req.body;
  const bill = new Bill({ ...data, createdBy: req.user.id });
  bill.save((err, bill) => {
    if (err) return res.status(400).send(err);
    return res.status(200).send(bill);
  });
}
