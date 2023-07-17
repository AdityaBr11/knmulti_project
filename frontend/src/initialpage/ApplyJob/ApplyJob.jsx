import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addCandidate } from '../../lib/api';
import httpService from '../../lib/httpService';
import FileUploadService from '../../MainPage/Pages/Profile/FileUploadService';
import { APPLICANT_STATE } from '../../model/shared/applicantStates';

const ApplyJob = () => {

  const location = useLocation();
  const [job] = useState(location?.job);
  const [candidate, setCandidate] = useState({
    job: job?._id,
    status: APPLICANT_STATE.applied,
  });

  const [currentFile, setcurrentFile] = useState("");

  const handleChange = (e) => {
    setCandidate({ ...candidate, [e.target.name]: e.target.value });
  }
  console.log("currentFile", currentFile)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentFile || currentFile == undefined) {
      toast.error('Upload Your Resume');
      return;
    }
    const filedata = await FileUploadService.upload(currentFile);
    const fullName = `${candidate?.firstName} ${candidate.lastName}`
    const res = await addCandidate({ ...candidate, name: fullName, fileInfos: filedata?.data });
    console.log(filedata);
    console.log(res);
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  };

  // console.log(candidate);

  return (
    <div className="modal custom-modal fade" id="apply_job" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Your Details</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>First Name <span style={{ color: "red" }}> *</span></label>
                <input
                  required
                  name="firstName"
                  className="form-control"
                  type="text"
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Last Name <span style={{ color: "red" }}> *</span></label>
                <input
                  name="lastName"
                  className="form-control"
                  type="text"
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email Address  <span style={{ color: "red" }}> *</span></label>
                <input
                  name="email"
                  required
                  className="form-control"
                  type="email"
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Mobile  <span style={{ color: "red" }}> *</span></label>
                <input
                  required
                  name="mobile"
                  className="form-control"
                  type="tel"
                  maxLength={10}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Message  <span style={{ color: "red" }}> *</span></label>
                <textarea
                  name="message"
                  required
                  className="form-control"
                  defaultValue={''}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Resume (URL)</label>
                <input
                  name="resume"
                  className="form-control"
                  type="text"
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Upload your CV  <span style={{ color: "red" }}> *</span></label>
                <div className="custom-file">
                  <input

                    name="resumeFile"
                    type="file"
                    className="custom-file-input"
                    id="cv_upload"
                    value={currentFile?.fileName}
                    onChange={(e) => setcurrentFile(e.target.files[0])}
                  // required
                  />
                  {currentFile?.fileName}
                  <label className="custom-file-label" htmlFor="cv_upload"
                    value={currentFile?.fileName}
                  >
                    Choose file1
                  </label>
                </div>
              </div>
              <div className="submit-section">
                <button
                  className="btn btn-primary submit-btn"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplyJob