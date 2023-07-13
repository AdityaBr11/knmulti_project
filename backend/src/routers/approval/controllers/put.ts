import { Response } from "express";
import { Approval, Leave } from "../../../models";
import RequestWithUser from "../../../utils/requestWithUser";

export default async function controllerPut(
  req: RequestWithUser,
  res: Response
) {
  const { id } = req.params;
  const data = req.body;
  if (data.status === true) {
    if (data.type === "leave") {
      const leave = await Leave.findById(data.leave);
      if (!leave)
        return res.status(404).json({
          message: "Leave not found",
        });
      leave!.approved = true;
      leave!.approvedDate = new Date();
      leave!.approvedBy = req.user._id;
      await leave!.save();
    }
    const approval = await Approval.findByIdAndUpdate(id, data);
    if (!approval) {
      return res.status(404).json({
        message: "Approval not found",
      });
    }
    res.status(200).json(approval);
  }
}
