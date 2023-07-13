import { Request, Response } from "express";
import putFile from "../../../utils/s3";
import fs from 'fs';
import { UploadedFile } from "express-fileupload";

export default async function controllerPost (req: any, res: Response) {
  try {
    // if(req.file === null){
    //   return res.status(400).json({ msg: 'No file uploaded' });
    // }

    // const fileName = req.file.filename;

    // const pathToFile = req.file.path;

    // const fileD = await fs.readFileSync(pathToFile);

    // await putFile(fileD, `${req.file.filename}`, req.file );

    // await fs.rmSync(pathToFile);

    // res.status(200).json({ fileName: fileName, filePath: `https://knmulti.fra1.digitaloceanspaces.com/${fileName}` });

    if (!req.files?.file) {
      return res.status(400).send({
        // message: "No file was uploaded",
        // message: "",
      });
    }

    const fileName = `generaldoc_${Math.ceil(Math.random() * 1000000)}_${(req.files!.file as UploadedFile).name}`

    const file = await putFile(
      (req.files!.file as UploadedFile).data,
      fileName,
      (req.files!.file as UploadedFile)
    );

    if (!file) {
      res.status(500).json({
        message: "Error uploading file",
      });
    }

    res.status(200).json({ fileName: fileName, 
      filePath: `https://knmulti.fra1.digitaloceanspaces.com/${fileName}` });

  } catch (err) {
    res.status(500).json({ msg : "Cannot able to upload Document" })
  }
}