import { Request, Response } from "express";
import { Candidate } from "../../../models";

export default async function controllerGetByJobId(
  req: Request,
  res: Response
) {
  try {
    const stats = await Candidate.aggregate([
      {
        $group: {
          _id: "$job",
          count: {
            $sum: 1,
          },
        },
      },
    ]);
    res.status(200).json({
      stats,
    });
  } catch (err) {
    res.status(404).json({
      staus: "failed",
      message: err,
    });
  }
}
