import { DeleteObjectCommand, DeleteObjectRequest, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import { generateBillPDF } from "./pdf-generation/generatePDF";

const s3 = new S3Client({
  endpoint: "https://fra1.digitaloceanspaces.com",
  region: "fra1",
  credentials: {
    accessKeyId: "AGEQ4MEVV2OQFRJ7OTJ6",
    secretAccessKey: "FF5h2Tb55NBsAS+7pHiSk4bt11Yj6YB/xpn+8tfeamc",
  },
});

const putFile = async (file: any, fileName: string, filedata: any = {mimetype: `application/pdf`}) => {
  try {
    const data = await s3.send(
      new PutObjectCommand({
        Bucket: "knmulti",
        Key: fileName,
        Body: file,
        ACL: "public-read",
        ContentDisposition:"inline",
        ContentType:`${filedata?.mimetype}`
      })
    );
    // console.log("Success, Object Created.", data);
    return data;
  } catch (err) {
    console.log("Errorr", err);
  }
};

export const deleteFile = async(fileName: string) => {
  try {
    const data = await s3.send(new DeleteObjectCommand({
      Bucket: "knmulti",
      Key: fileName,
    }));
    // console.log("Success, Object deleted.", data);
    return data;
  } catch (err) {
    console.log("Error", err);
  }
}

export const updateFile = async(modelName: any, modelData: any, populateObject: any) => {
  // UPLOAD FILE TO CLOUD 
  const uploadedData = await modelName.findOne({_id : modelData._id}).populate({ ...populateObject });

  await deleteFile(`${uploadedData._id}.pdf`);

  const pathToFile : any = await generateBillPDF(uploadedData.toJSON());
  const file = await fs.readFileSync(pathToFile);
  // console.log(pathToFile);
  await putFile(file, `${uploadedData._id}.pdf` );

  await modelName.updateOne({_id : modelData._id} , {pdf_url : `https://knmulti.fra1.digitaloceanspaces.com/${uploadedData._id}.pdf`})

  await fs.rmSync(pathToFile);
}

export default putFile;
