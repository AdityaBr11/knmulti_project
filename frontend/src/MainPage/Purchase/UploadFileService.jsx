import React from 'react'
import httpService from '../../lib/httpService';

class UploadFilesService {
  upload(file, onUploadProgress="") {
    let formData = new FormData();
    formData.append("file", file);
    return httpService.post("/vendortrx/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      // onUploadProgress,
    });
  }

  // Not Working 
  getFiles() {
    return httpService.get("/files");
  }

  removeFile(fileName) {
    return httpService.delete(`/vendortrx/removefile/${fileName}`);
  }
}
export default new UploadFilesService();