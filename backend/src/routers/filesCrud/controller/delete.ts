import { Request, Response } from "express";
import { deleteFile } from "../../../utils/s3";

export default async function controllerDelete (req: Request, res: Response) {
  try {

    await deleteFile(req.params.fileName);

    res.status(200).json({
      fileName: req.params.fileName,
      msg: `Deleted : ${req.params.fileName}` });
    
  } catch (err) {
    res.status(500).json({ msg: "file was NOT deleted" })
  }
}