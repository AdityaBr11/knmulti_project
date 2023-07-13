import { model } from "mongoose";
import { deliveryChallanSchema, IDeliveryChallan } from "../db/schema/deliveryChallan";

export const DeliveryChallan = model<IDeliveryChallan>(
  "DeliveryChallan",
  deliveryChallanSchema
);
