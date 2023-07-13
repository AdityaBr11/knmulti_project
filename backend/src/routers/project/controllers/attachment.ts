import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import putFile from "../../../utils/s3";
import { Project } from "../../../models";

export default async function controllerPostAttachment(
  req: Request,
  res: Response
) {
  if (!req.files?.attachment) {
    return res.status(400).send({
      message: "No file was uploaded",
    });
  }
  const file = await putFile(
    (req.files!.attachment as UploadedFile).data,
    (req.files!.attachment as UploadedFile).name
  );
  if (!file) {
    res.status(500).json({
      message: "Error uploading file",
    });
  }
  const { id } = req.params;
  const project = await Project.findByIdAndUpdate(id, {
    $push: {
      attachments: {
        name: (req.files!.attachment as UploadedFile).name,
        url:
          "https://knmulti.fra1.digitaloceanspaces.com/" +
          (req.files!.attachment as UploadedFile).name,
        uploadedAt: new Date(),
        uploader: (req as any).user.id,
      },
    },
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
