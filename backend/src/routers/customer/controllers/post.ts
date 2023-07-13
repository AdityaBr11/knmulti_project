// create an express post request handle for customer

import { Request, Response } from "express";
import { Customer } from "../../../models";
import { CustomerTimeline } from "../../../models/customerTimeline";
import RequestWithUser from "../../../utils/requestWithUser";

export default async function controllerPost(req: Request, res: Response) {
  const data = req.body;
  const contactPersons: Array<any> = [];
  Object.entries(data.contactPersons).map(([key, value]) => {
    contactPersons.push(value);
  });
  data.contactPersons = contactPersons;
  const latest: any = await Customer.find({}).sort({ id: -1 }).limit(1);
  if (latest.length >0 && latest[latest.length-1].customerId) {
    data.customerId = `CUST-${parseInt(latest[0].customerId.split('-')[1])+1}`;
  } else {
    data.customerId = 'CUST-1';
  }
  const customer = new Customer({
    ...data,
  });
  customer.save((err, customer) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(201).send(customer);
  });
  await CustomerTimeline.create({
    customer: customer._id, 
    timelineType: "Customer Created successfully",
    description: `Customer Created successfully ${""} `,
    // link: "",
  });
}

export async function postTimeline(req: Request, res: Response) {
  try {
     
    const customerTimeline = await CustomerTimeline.create(req.body);
    return res.status(200).send(customerTimeline);

  } catch (e) {
    console.log(e);
    return res.status(400)
  }
}
