import { Request, Response } from "express";
import { Employee } from "../../../models/employee";
import { validateActivities } from "../../../validators";

export default async function controllerPostActivities(
  req: Request,
  res: Response
) {
  console.log('req.params');
  const data = req.body;
  data.dateTime = new Date();
  const errors = validateActivities(data);
  if (errors.length) {
    res.status(400).json(errors);
    return;
  }
  const { id } = req.params;
  if (id) {
    try {
      const employee = await Employee.findById(id);
      await employee?.updateOne({ $push: { activities: req.body } });
      res.status(200).json("activitiy posted");
    } catch (err) {
      res.status(400).json(errors);
    }
  } else {
    res.status(404).json("please provide a user");
  }
}
