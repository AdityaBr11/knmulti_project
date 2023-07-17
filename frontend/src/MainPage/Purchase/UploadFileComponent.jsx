import React, { useEffect, useState } from 'react'
import Dropzone from 'react-dropzone'
import UploadFileService from './UploadFileService'

import '../../MainPage/index.css'
import httpService from '../../lib/httpService'
import { Delete } from '@material-ui/icons'

const UploadFileComponent = ({ modLink, filesInfo }) => {

  const [ fileState, setFileState ] = useState({
    selectedFiles: undefined,
    currentFile: undefined,
    progress: 0,
    message: "",
    fileInfos: [],
  });

  const { selectedFiles, currentFile, progress, message, fileInfos } = fileState;


  function onDrop(files) {
    if (files.length > 0) {
      setFileState({ ...fileState, selectedFiles: files });
    }
  }

  function upload() {
    let currentFile = fileState.selectedFiles[0];
    setFileState({
      ...fileState,
      progress: 0,
      currentFile: currentFile,
    });
    UploadFileService.upload(currentFile, (event) => {
      setFileState({
        ...fileState,
        progress: Math.round((100 * event.loaded) / event.total),
      });
      
    })
      .then((response) => {
        setFileState({
          ...fileState,
          message: response?.data?.message,
        });
        return httpService.put(`${modLink}`, { fileInfos: [ ...fileInfos, response?.data ] })
      })
      .then((res) => {
        setFileState({
          ...fileState,
          fileInfos: res?.data?.fileInfos,
        });
      })
      .catch(() => {
        setFileState({
          ...fileState,
          progress: 0,
          message: "Could not upload the file!",
          currentFile: undefined,
        });
      });
    setFileState({
      ...fileState,
      selectedFiles: undefined,
    });
  }

  function removeFileFn(fileName) {
    UploadFileService.removeFile(fileName, (event) => {
      setFileState({
        ...fileState,
        progress: Math.round((100 * event.loaded) / event.total),
      });
      
    })
    .then((response) => {
      setFileState({
        ...fileState,
        message: response?.data?.msg,
      });
      return httpService.put(`${modLink}`, { fileInfos: fileInfos.filter(f => f.fileName !== response?.data?.fileName) })
    })
    .then((res) => {
      setFileState({
        ...fileState,
        fileInfos: res?.data?.fileInfos,
      });
    })
    .catch(() => {
      setFileState({
        ...fileState,
        progress: 0,
        message: "Could not upload the file!",
        currentFile: undefined,
      });
    });
  }

  useEffect(() => {
    // UploadFileService.getFiles().then((response) => {
    //   setFileState({
    //     ...fileState,
    //     fileInfos: response.data,
    //   });
    // });
    setFileState({
          ...fileState,
          fileInfos: filesInfo,
        });
    
  }, [filesInfo]);

  return (
    <div>
      {currentFile && (
        <div className="progress mb-3">
          <div
            className="progress-bar progress-bar-info progress-bar-striped"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
            style={{ width: progress + "%" }}
          >
            {progress}%
          </div>
        </div>
      )}
      <Dropzone onDrop={onDrop} multiple={false}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps({ className: "dropzone" })}>
              <input {...getInputProps()} />
              {selectedFiles && selectedFiles[0].name ? (
                <div className="selected-file">
                  {selectedFiles && selectedFiles[0].name}
                </div>
              ) : (
                "Drag and drop file here, or click to select file"
              )}
            </div>
            <aside className="selected-file-wrapper">
              <button
                className="btn btn-success"
                disabled={!selectedFiles}
                onClick={upload}
              >
                Upload
              </button>
            </aside>
          </section>
        )}
      </Dropzone>
      { message && 
        <div className="alert alert-light" role="alert">
          {message}
        </div>
      }
      {fileInfos && fileInfos?.length > 0 && (
        <div className="card">
          <div className="card-header">List of Files</div>
          <ul className="list-group list-group-flush">
            {fileInfos.map((file, index) => (
              <li className="list-group-item d-flex justify-content-between" key={index}>
                <a href={file?.filePath} target="_blank">{file?.fileName.split("_")[2]}</a>
                <Delete onClick={() => removeFileFn(file?.fileName)} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UploadFileComponent