import { Request, Response } from "express";
import { Lead, Project } from "../../../../models";

export default async function controllerPost(req: Request, res: Response) {
  console.log("its impro1")
  const { id } = req.params;
  const leadInterst = req.body;
  if (!leadInterst.project || !leadInterst.plot) {
    return res.status(400).json({
      message: "Project and Plot are required",
    });
  }
  const lead = await Lead.findById(id);
  if (!lead) {
    return res.status(404).json({
      message: "Lead not found",
    });
  }
  const project = await Project.findById(leadInterst.project);
  if (!project) {
    return res.status(404).json({
      message: "Project not found",
    });
  }

  lead.interest.push(leadInterst); // error is created from leads intertrest property.

  const projectsLeads = new Set(project.leads);
  projectsLeads.add(lead._id);
  project.leads = Array.from(projectsLeads);

  const leadPlot = project.subPlots.find(
    (plot) => plot._id === leadInterst.plot
  );
  if (!leadPlot) {
    return res.status(404).json({
      message: "Plot not found",
    });
  }

  console.log("its impro")
  // leadPlot.leadsInfo.push({
  //   leadType: leadInterst?.leadType,
  //   lead: lead?._id,
  // });

  await lead.save();
  await project.save();
  return res.status(200).json({
    message: "Lead added to plot",
  });
}
