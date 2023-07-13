import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { Project } from "../../../models";
import putFile from "../../../utils/s3";
import { verifyProject } from "../../../validators";
import { parse } from "csv-parse";
import console from "console";

export async function controllerPost(req: Request, res: Response) {
  const projectData = req.body;
  const errors = verifyProject(projectData);
  if (errors.length > 0) {
    return res.status(400).send(errors);
  }
  const project = await Project.create({
    ...projectData,
    createdBy: (req as any).user.id,
  }).catch((err) => {
    return res.status(400).send(err);
  });
  if (project) res.status(201).json(project);
}

export async function controllerPostLayout(req: Request, res: Response) {
  const hasLoyout = req.files?.layout;
  if (!hasLoyout) {
    return res.status(400).send("No file uploaded");
  }
  const file = await putFile(
    (req.files!.layout as UploadedFile).data,
    req.params.id + (req.files!.layout as UploadedFile).name,
    hasLoyout
  );
  if (!file) {
    res.status(500).json({
      message: "Error uploading file",
    });
  }
  const project = await Project.findByIdAndUpdate(req.params.id, {
    layout:
      "https://knmulti.fra1.digitaloceanspaces.com/" +
      req.params.id +
      (req.files!.layout as UploadedFile).name,
  });
  if (project) {
    return res.status(200).json({
      message: "File uploaded successfully",
    });
  } else {
    return res.status(500).json({
      message: "Error uploading file",
    });
  }
}

export async function controllerPostSubPlots(req: Request, res: Response) {
  const { subPlots } = req.body;
  if (!subPlots) {
    return res.status(400).json({
      message: "No land division data provided",
    });
  }
  const project = await Project.findByIdAndUpdate(req.params.id, {
    subPlots: subPlots,
  });
  if (project) {
    return res.status(200).json({
      message: "Land division updated successfully",
    });
  }
  return res.status(500).json({
    message: "Error updating land division",
  });
}

export async function controllerPostLandDivisionCSV(
  req: Request,
  res: Response
) {
  const hasLoyout = req.files?.layout;
  if (!hasLoyout) {
    return res.status(400).send("No file uploaded");
  }
  const data = (req.files!.layout as UploadedFile).data.toString();
  parse(data, {}, async (err, records) => {
    if (err) {
      console.error(err);
      return res.status(400).send(err);
    }
    // console.log({records})
    const keys = records[0];
    // console.log({keys});
    const subPlots = records.slice(1).map((record: any) => {
      return record.reduce(
        (acc: any, value: any, index: number) => {
          acc[keys[index]] = value;
          // console.log({acc})
          return acc;
        },
        { name: "" }
      );
    });
    const project = await Project.findByIdAndUpdate(req.params.id, {
      subPlots,
    }).catch((err) => {
      console.error(err);
      return res.status(500).send(err);
    });
    if (project) {
      return res.status(200).json({
        message: "Sub plot data updated successfully",
      });
    }
  });
}
