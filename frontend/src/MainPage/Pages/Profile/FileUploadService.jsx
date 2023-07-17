import React from 'react'
import httpService from '../../../lib/httpService';

class FileUploadService {
  upload(file) {
    let formData = new FormData();
    formData.append("file", file);
    // console.log(file,"formData",formData);
    return httpService.post("/file/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  // Not Working 
  // getFiles() {
  //   return httpService.get("/files");
  // }

  removeFile(fileName) {
    return httpService.delete(`/file/removefile/${fileName}`);
  }
}
export default new FileUploadService();