// create an express put route for the bill model

import { Response } from "express";
import { Bill } from "../../../models/bill";
import RequestWithUser from "../../../utils/requestWithUser";

export default async function controllerPut(
  req: RequestWithUser,
  res: Response
) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send({ message: "id is required" });
  } else {
    const data = req.body;
    const bill = await Bill.findByIdAndUpdate(id, data);
    if (!bill) return res.status(404).send("Bill not found");
    return res.status(200).send(bill);
  }
}
