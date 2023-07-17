import React from 'react'
import UploadFileComponent from './UploadFileComponent';

const FileUploadModel = ({ modLink, filesInfo }) => {
  
  return (
    <div className="modal custom-modal fade close" id="upload_file" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Add Files</h3>
                <p></p>
              </div>
              
              <UploadFileComponent modLink={modLink} filesInfo={filesInfo} />

              <div className="modal-btn delete-action">
                <div className="row d-flex justify-content-center">
                  
                  <div className="col-6 text-center">
                    <a
                      data-dismiss="modal"
                      className="btn btn-primary cancel-btn"
                    >
                      Cancel
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default FileUploadModel