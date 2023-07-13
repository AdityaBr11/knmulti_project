// create an express put route for lead model

import { Response } from "express";
import { Lead } from "../../../models";
import { Employee } from "../../../models/employee";
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
    // if (data.status === "Lead Won") {
    //   console.log("Lead Won", req.user.id);
    //   await Employee.findByIdAndUpdate(req.user.id, {
    //     $push: {
    //       activities: {
    //         activityType: "Lead Won",
    //         dateTime: new Date(),
    //         description: `Lead ${data.name} has been won`,
    //         link: `/profile/lead-profile/${data.id}`,
    //       },
    //     },
    //   });
    // } else if (data.status === "Lead Lost") {
    //   await Employee.findByIdAndUpdate(req.user.id, {
    //     $push: {
    //       activities: {
    //         activityType: "Lead Lost",
    //         dateTime: new Date(),
    //         description: `Lead ${data.name} has been lost`,
    //         link: `/profile/lead-profile/${data.id}`,
    //       },
    //     },
    //   });
    // } else if (data.employeeActivity) {
    //   await Employee.findByIdAndUpdate(req.user.id, {
    //     $push: {
    //       activities: data.employeeActivity,
    //     },
    //   });
    // }
    try {
      const leadData: any = await Lead.findById(id);
      // console.log(leadData);
      if (leadData.currentAssigned !== data.currentAssigned) {
        data.activities = leadData.activities;
        data.activities.push({
          activityType: 'Project Assignment',
          description: `Assigned To New Employee`,
          dateTime: new Date(),
          employee: req.user.id,
        });
      }
      const lead = await Lead.findByIdAndUpdate(id, data);
      if (!lead) return res.status(404).send("Lead not found");
      return res.status(200).send(lead);
    } catch (err) {
      console.log(err)
    }
  }
}
