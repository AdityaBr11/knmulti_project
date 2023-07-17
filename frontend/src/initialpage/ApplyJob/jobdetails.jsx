import React, { useState, useEffect } from 'react';
import { useLocation, withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { headerlogo } from '../../Entryfile/imagepath.jsx';
import { addCandidate } from '../../lib/api/index.js';
import { APPLICANT_STATE } from '../../model/shared/applicantStates.js';
import ApplyJob from './ApplyJob.jsx';

function timeDiffCalc(dateFuture, dateNow, onlyDays = false) {
  let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

  // calculate days
  const days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;
  // console.log('calculated days', days);

  // calculate hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;
  // console.log('calculated hours', hours);

  // calculate minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;
  // console.log('minutes', minutes);

  let difference = '';
  if (days > 0) {
    difference += days === 1 ? `${days} day, ` : `${days} days, `;
  }

  difference +=
    hours === 0 || hours === 1 ? `${hours} hour, ` : `${hours} hours, `;

  difference +=
    minutes === 0 || hours === 1 ? `${minutes} minutes` : `${minutes} minutes`;

  if (onlyDays) {
    return `${days} days`;
  }

  return difference;
}

const Jobdetails = () => {
  // const [jobslist, setjobslist] = useState([]),
  //   [loading, setloading] = useState(false),
  //   [showedit, setshowedit] = useState(false),
  //   [folder_name, setfolder_name] = useState('');

  const location = useLocation();
  const [job] = useState(location?.job);
  const [candidate, setCandidate] = useState({
    job: job?._id,
    status: APPLICANT_STATE.applied,
  });

  useEffect(() => {
    window.onpopstate = () => {
      if (this._isMounted) {
        localStorage.removeItem('jobview');
        window.location.reload();
      }
    };
  });

  const handleChange = (e) => {
    setCandidate({ ...candidate, [e.target.name]: e.target.value });
  };

  const onApplyClick = async (e) => {
    e.preventDefault();
    const res = await addCandidate(candidate);
    // console.log(candidate);
    console.log(res);
  };

  return (
    <>
      <Helmet>
        <title>Jobs </title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Header */}
      <div className="header">
        {/* Logo */}
        <div className="header-left">
          <Link to="/app/main/dashboard" className="logo">
            <img src={headerlogo} width={40} height={40} alt="" />
          </Link>
        </div>
        {/* /Logo */}
        {/* Header Title */}
        <div className="page-title-box float-left">
          <h3>KN Multiprojects</h3>
        </div>
        {/* /Header Title */}
        {/* Header Menu */}
        <ul className="nav user-menu">
          {/* Search */}
          {/* <li className="nav-item">
            <div className="top-nav-search">
              <a href=";" className="responsive-search">
                <i className="fa fa-search" />
              </a>
              <form>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Search here"
                />
                <button className="btn" type="submit">
                  <i className="fa fa-search" />
                </button>
              </form>
            </div>
          </li> */}
          {/* /Search */}
          {/* Flag */}
          {/* <li className="nav-item dropdown has-arrow flag-nav">
            <a
              className="nav-link dropdown-toggle"
              data-toggle="dropdown"
              href="#"
              role="button"
            >
              <img src={lnEnglish} alt="" height={20} /> <span>English</span>
            </a>
            <div className="dropdown-menu dropdown-menu-right">
              <a href="" className="dropdown-item">
                <img src={lnEnglish} alt="" height={16} /> English
              </a>
              <a href="" className="dropdown-item">
                <img src={lnFrench} alt="" height={16} /> French
              </a>
              <a href="" className="dropdown-item">
                <img src={lnSpanish} alt="" height={16} /> Spanish
              </a>
              <a href="" className="dropdown-item">
                <img src={lnGerman} alt="" height={16} /> German
              </a>
            </div>
          </li> */}
          {/* /Flag */}
          <li className="nav-item">
            <Link className="nav-link" to="/login">
              Login
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/register">
              Register
            </Link>
          </li>
        </ul>
        {/* /Header Menu */}
        {/* Mobile Menu */}
        <div className="dropdown mobile-user-menu">
          <a
            href="#"
            className="nav-link dropdown-toggle"
            data-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa fa-ellipsis-v" />
          </a>
          <div className="dropdown-menu dropdown-menu-right">
            <Link className="dropdown-item" to="/login">
              Login
            </Link>
            <Link className="dropdown-item" to="/register">
              Register
            </Link>
          </div>
        </div>
        {/* /Mobile Menu */}
      </div>
      {/* /Header */}
      {/* Page Wrapper */}
      <div className="page-wrapper job-wrapper">
        {/* Page Content */}
        <div className="content container">
          {/* Page Header */}
          <div className="page-header">
            <div className="row align-items-center">
              <div className="col">
                <h3 className="page-title">Jobs</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/app/main/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Jobs</li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-md-8">
              <div className="job-info job-widget">
                <h3 className="job-title">{job?.title}</h3>
                {/* <span className="job-dept">App Development</span> */}
                <ul className="job-post-det">
                  <li>
                    <i className="fa fa-calendar" /> Post Date:{' '}
                    <span className="text-blue">
                      {new Date(job?.startDate).toLocaleDateString()}
                    </span>
                  </li>
                  <li>
                    <i className="fa fa-calendar" /> Last Date:{' '}
                    <span className="text-blue">
                      {new Date(job?.endDate).toLocaleDateString()}
                    </span>
                  </li>
                  {/* <li>
                    <i className="fa fa-user-o" /> Applications:{' '}
                    <span className="text-blue">4</span>
                  </li> */}
                  {/* <li>
                    <i className="fa fa-eye" /> Views:{' '}
                    <span className="text-blue">3806</span>
                  </li> */}
                </ul>
              </div>
              <div className="job-content job-widget">
                <div className="job-desc-title">
                  <h4>Job Description</h4>
                </div>
                <div className="job-description">
                  <p>{job?.description}</p>
                </div>
                {/* <div className="job-desc-title">
                  <h4>Job Description</h4>
                </div>
                <div className="job-description">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum
                  </p>
                  <ul className="square-list">
                    <li>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </li>
                    <li>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </li>
                    <li>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </li>
                    <li>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </li>
                    <li>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </li>
                  </ul>
                </div> */}
              </div>
            </div>
            <div className="col-md-4">
              <div className="job-det-info job-widget">
                {job?.status ?
                  <a
                    className="btn job-btn"
                    data-toggle="modal"
                    data-target="#apply_job"
                  >
                    Apply For This Job
                  </a>
                  :
                  <a
                    className="btn job-btn"
                  >
                    Job Closed
                  </a>
                }
                <div className="info-list">
                  <span>
                    <i className="fa fa-bar-chart" />
                  </span>
                  <h5>Job Type</h5>
                  <p>{job?.jobType}</p>
                </div>
                <div className="info-list">
                  <span>
                    <i className="fa fa-money" />
                  </span>
                  <h5>Salary</h5>
                  <p>
                    Rs. {Number(job?.salaryFrom) / 1000}k - Rs.{' '}
                    {Number(job?.salaryTo) / 1000}k
                  </p>
                </div>
                <div className="info-list">
                  <span>
                    <i className="fa fa-suitcase" />
                  </span>
                  <h5>Experience</h5>
                  <p>{job?.experience} years</p>
                </div>
                <div className="info-list">
                  <span>
                    <i className="fa fa-ticket" />
                  </span>
                  <h5>Vacancy</h5>
                  <p>{job?.numberOfVacancies}</p>
                </div>
                <div className="info-list">
                  <span>
                    <i className="fa fa-map-signs" />
                  </span>
                  <h5>Location</h5>
                  <p> {job?.location?.name}</p>
                </div>
                {/* <div className="info-list">
                  <p>
                    {' '}
                    818-978-7102
                    <br /> danielporter@example.com
                    <br /> https://www.example.com
                  </p>
                </div> */}
                <div className="info-list text-center">
                  <a className="app-ends" href="#">
                    Application ends in{' '}
                    {timeDiffCalc(
                      new Date(job?.endDate),
                      new Date(job?.startDate)
                    )}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ApplyJob />

        <div className="modal custom-modal fade" id="old_apply_job" role="dialog">
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
                <form>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      name="name"
                      className="form-control"
                      type="text"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      name="email"
                      className="form-control"
                      type="text"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Mobile11</label>
                    <input
                      name="mobile"
                      className="form-control"
                      type="text"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Message</label>
                    <textarea
                      name="message"
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
                  {/* <div className="form-group">
                    <label>Upload your CV</label>
                    <div className="custom-file"> 
                      <input
                      name="resume"
                        type="text"
                        className="custom-file-input"
                        id="cv_upload"
                      />
                      <label className="custom-file-label" htmlFor="cv_upload">
                        Choose file
                      </label>
                    </div>
                  </div> */}
                  <div className="submit-section">
                    <button
                      className="btn btn-primary submit-btn"
                      onClick={onApplyClick}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(Jobdetails);
