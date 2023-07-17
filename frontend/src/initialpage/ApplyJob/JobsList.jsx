import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useState } from 'react';

import {
  headerlogo,
  lnEnglish,
  lnFrench,
  lnSpanish,
  lnGerman,
} from '../../Entryfile/imagepath.jsx';
import { fetchJobs } from '../../lib/api/index.js';

const JobsList = () => {
  const [job, setJob] = useState([]);
  useEffect(() => {
    // Anything in here is fired on component mount.
    localStorage.removeItem('jobview');
  }, []);
  useEffect(() => {
    (async () => {
      const res = await fetchJobs();
      console.log('hey');
      console.log(res);
      console.log('fetch Jobs');
      setJob(res);
    })();
  }, []);

  return (
    <>
      <Helmet>
        <title>Jobs</title>
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
          <li className="nav-item">
            <Link className="nav-link" to="/login">
              Login
            </Link>
          </li>
          {/* <li className="nav-item">
            <Link className="nav-link" to="/register">
              Register
            </Link>
          </li> */}
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
            {/* <Link className="dropdown-item" to="/register">
              Register
            </Link> */}
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
            <div className="row">
              <div className="col-sm-12">
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
            {job?.map((e) => {
              console.log(e);
              return (
                <div className="col-md-6">
                  <Link
                    className="job-list"
                    to={{ pathname: `/applyjob/jobdetail/`, job: e }}
                  >
                    <div className="job-list-det">
                      <div className="job-list-desc">
                        <h3 className="job-list-title">{e.title}</h3>
                        {/* <h4 className="job-department">{e.department}</h4> */}
                      </div>
                      <div className="job-type-info">
                        <span className="job-types">{e.jobType}</span>
                      </div>
                    </div>
                    <div className="job-list-footer">
                      <ul>
                        <li>
                          <i className="fa fa-map-signs" /> {e.location.name}
                        </li>
                        <li>
                          <i className="fa fa-money" /> {e.salaryFrom} -{' '}
                          {e.salaryTo}
                        </li>
                        <li>
                          <i className="fa fa-clock-o" /> {e.status ? "OPEN" : "CLOSED"}
                        </li>
                      </ul>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
    </>
  );
};

export default JobsList;
