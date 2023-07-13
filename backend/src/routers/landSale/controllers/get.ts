
import { Request, Response } from "express";
import { LandSale } from "../../../models/landSale";

export async function controllerGet(req: Request, res: Response) {
  try {
     
    const landSale = await LandSale.find(req.query).populate({ path: "projectId", select: "name" }).populate({ path: "vendorId", select: "name" });
 
    res.status(200).json(landSale); 

  } catch (err) {
    res.status(500).json({ msg : "Server error" })
  }
}