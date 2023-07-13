import { Router } from "express";
import controllerPost from "./controller/post";
import controllerDelete from "./controller/delete";

// const multer = require("multer");
// import { FileFilterCallback } from "multer";

// type DestinationCallback = (error: Error | null, destination: string) => void
// type FileNameCallback = (error: Error | null, filename: string) => void

// const storage = multer.diskStorage({
//   destination: function(req: Request, file: Express.Multer.File, cb : DestinationCallback) {
//     cb(null, './src/uploads/');
//   },
//   filename: function(req: Request, file: Express.Multer.File, cb: FileNameCallback) {
//     cb(null, `generaldoc_${Math.ceil(Math.random() * 1000000)}_${file.originalname}`);
//   }
// });

// const fileFilter = (
//   req: Request,
//   file: Express.Multer.File,
//   cb : FileFilterCallback
// ): void => {
//   if(
//     file.mimetype === 'image/jpeg' ||
//     file.mimetype === 'image/png' ||
//      file.mimetype === 'application/pdf'
//   ) {
//     cb(null, true)
//   } else {
//     cb(null, false)
//   }
// }


// const upload = multer({ storage : storage, fileFilter: fileFilter });
// const upload = multer({ storage : storage });

const fileCred = Router();

// fileCred.post("/upload", upload.single('file'), controllerPost);
fileCred.post("/upload", controllerPost);
fileCred.delete('/removefile/:fileName', controllerDelete);

export default fileCred;