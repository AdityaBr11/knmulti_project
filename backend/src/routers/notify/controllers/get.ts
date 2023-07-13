
import { Request, Response } from "express";
import { Notify } from "../../../models/notify";

export default async function controllerGet(req: Request, res: Response) {
  try {
     
    //  const reqQuery = { ...req.query };
    //  let queryStr = JSON.stringify(reqQuery);
    //  queryStr = queryStr.replace(/\b(in)\b/g, match => `$${match}`);
    // JSON.parse(queryStr)

    const notifyData = await Notify.find(req.query).sort({_id: -1});
 
    res.status(200).json(notifyData); 

  } catch (err) {
    res.status(500).json({ msg : "Server error" })
  }
}