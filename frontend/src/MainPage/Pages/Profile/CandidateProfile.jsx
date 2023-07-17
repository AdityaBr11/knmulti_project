import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { fetchJob, getCandidate } from '../../../lib/api';
import { Avatar, Button, CircularProgress, Stack } from '@mui/material';
import PhoneIcon from '@mui/icons-material/PhoneOutlined';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import { red } from '@mui/material/colors';
import {
  Check,
  Close,
  DocumentScannerOutlined,
  LinkOutlined,
  PendingActions,
  ViewAgenda,
  Work,
} from '@mui/icons-material';
import '@mui/icons-material';
import '@material-ui/icons';

const CandidateProfile = () => {
  const { id } = useParams();
  const [candidate, setCandidate] = useState({});
  const [joinee, setJoinee] = useState({
    // joinDate: new Date().toLocaleDateString(),
    workLocation: '61ded9d3bc62af7e13239163', // default - india
    jobRole: '61dfd3761fa753a1863d548b', // default - employee
    userAuthorities: ['EMPLOYEE'],
  });
  const [job, setJob] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }
  });

  useEffect(async () => {
    setLoading(true);
    const res = await getCandidate(id);
    setCandidate(res);

    const res2 = await fetchJob(res?.job);
    setJob(res2);
    setJoinee({
      ...joinee,
      _id: res?._id,
      firstName: res?.name,
      email: res?.email,
      mobileNo: res?.mobile,
    });
    setLoading(false);
  }, [id]);

  const handleChange = (e) => {
    setJoinee({ ...joinee, [e.target.name]: e.target.value });
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Candidate Profile </title>
        <meta name="description" content="Reactify Blank Page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        {/* /Page Header */}
        {loading ? (
          <div
            style={{
              height: '90vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            className="content container-fluid"
          >
            <CircularProgress />
          </div>
        ) : (
          <>
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <h3 className="page-title">Profile</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/app/main/dashboard">Settings</Link>
                    </li>
                    <li className="breadcrumb-item active">Profile</li>
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <div className="card mb-0">
                <div className="card-body">
                  <div className="row">
                    <div className="col-12">
                      <Stack justifyContent={'space-between'} direction={'row'}>
                        <Stack
                          direction={'row'}
                          alignItems={'center'}
                          spacing={1}
                        >
                          <Avatar
                            sx={{ bgcolor: red[400], height: 52, width: 52 }}
                          >
                            {candidate?.name?.substr(0, 1)}
                          </Avatar>
                          <Stack>
                            <div
                              style={{
                                fontSize: '1.1rem',
                                fontWeight: 600,
                              }}
                            >
                              {candidate?.name}
                            </div>
                            <div>
                              <span style={{ color: 'gray' }}>
                                {candidate?.status}
                              </span>
                            </div>
                          </Stack>
                        </Stack>
                      </Stack>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div
                  style={{
                    paddingRight: '0px',
                  }}
                  className="col-md-4"
                >
                  <div className="card">
                    <div
                      className="card-body"
                      style={{
                        minHeight: '70vh',
                      }}
                    >
                      <h4
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        Personal Information
                      </h4>
                      <hr />
                      <div
                        style={{
                          marginBottom: '15px',
                          fontSize: '1rem',
                          color: '#8c8c8c',
                          marginBottom: '50px',
                        }}
                      >
                        <Stack
                          direction={'row'}
                          marginBottom={2}
                          alignItems={'flex-end'}
                        >
                          <Work />
                          <span>
                            &nbsp;&nbsp;&nbsp;&nbsp;Applied for {job?.title}
                          </span>
                        </Stack>
                        <Stack
                          direction={'row'}
                          marginBottom={2}
                          alignItems={'flex-end'}
                        >
                          <PhoneIcon />
                          <span>
                            &nbsp;&nbsp;&nbsp;&nbsp;{candidate?.mobile}
                          </span>
                        </Stack>
                        <Stack
                          direction={'row'}
                          marginBottom={2}
                          alignItems={'flex-end'}
                        >
                          <EmailIcon />
                          <span>
                            &nbsp;&nbsp;&nbsp;&nbsp;{candidate?.email}
                          </span>
                        </Stack>
                        <Stack
                          direction={'row'}
                          marginBottom={2}
                          alignItems={'flex-end'}
                        >
                          <LinkOutlined />
                          <span>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <a href={candidate?.resume} target="_blank" >Resume Link</a>
                          </span>
                        </Stack>
                        <Stack
                          direction={'row'}
                          marginBottom={2}
                          alignItems={'flex-end'}
                        >
                          <DocumentScannerOutlined />
                          <span>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <a href={candidate?.fileInfos?.filePath} target="_blank" >Click to view resume Pdf</a>
                          </span>
                        </Stack>
                        {candidate?.employeeId && 
                        
                          <Stack
                            direction={'row'}
                            marginBottom={2}
                            alignItems={'flex-end'}
                          >
                            {/* <ViewAgenda /> */}
                            <span>
                              &nbsp;&nbsp;&nbsp;&nbsp;
                              <Link
                                  className="btn btn-primary"
                                  to={`/app/profile/employee-profile/${candidate?.employeeId}`}
                                >
                                  View Employee Profile
                                </Link>
                            </span>
                          </Stack>
                        }
                      </div>
                    </div>
                  </div>
                </div>

                
                {/* <div
                  style={{
                    paddingLeft: '0px',
                  }}
                  className="col-md-8 p-r-0"
                >
                  <div className="card tab-box">
                    <div className="row user-tabs">
                      <div className="col-lg-12 col-md-12 col-sm-12 line-tabs">
                        <ul className="nav nav-tabs nav-tabs-bottom">
                          <li className="nav-item">
                            <a
                              href="#activities"
                              data-toggle="tab"
                              className="nav-link active"
                            >
                              Activities
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              href="#payroll"
                              data-toggle="tab"
                              className="nav-link"
                            >
                              Payroll
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      minHeight: '65vh',
                      maxHeight: '65vh',
                      overflowY: 'auto',
                    }}
                    className="card p-4 tab-content"
                  >
                    <div
                      id="activities"
                      className="pro-overview tab-pane fade show active"
                    >
                      <h3>Activities</h3>
                      <hr />
                    </div>
                    <div
                      id="payroll"
                      className="pro-overview tab-pane fade show"
                    >
                      <h3>Payroll</h3>
                      <hr />
                    </div>
                  </div>
                </div> */}

                
              </div>
            </div>
          </>
        )}
      </div>
      {/* /Page Content */}
      {/* Add Employee Modal */}
      <div id="add_employee" className="modal custom-modal fade" role="dialog">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Employee</h5>
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
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Employee ID <span className="text-danger">*</span>
                      </label>
                      <input
                        name="id"
                        className="form-control"
                        type="text"
                        placeholder={candidate?._id}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        First Name <span className="text-danger">*</span>
                      </label>
                      <input
                        name="firstName"
                        className="form-control"
                        type="text"
                        placeholder={candidate?.name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">Last Name</label>
                      <input
                        name="lastName"
                        className="form-control"
                        type="text"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Username <span className="text-danger">*</span>
                      </label>
                      <input
                        name="userName"
                        className="form-control"
                        type="text"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        name="email"
                        className="form-control"
                        type="email"
                        placeholder={candidate?.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">Password</label>
                      <input
                        name="password"
                        className="form-control"
                        type="password"
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Date Of Birth <span className="text-danger">*</span>
                      </label>
                      <div>
                        <input
                          name="dob"
                          className="form-control datetimepicker"
                          type="date"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Date Of Joining <span className="text-danger">*</span>
                      </label>
                      <div>
                        <input
                          name="joinDate"
                          className="form-control datetimepicker"
                          type="date"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">Phone </label>
                      <input
                        name="mobileNo"
                        className="form-control"
                        type="text"
                        placeholder={candidate?.mobile}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">Salary </label>
                      <input
                        name="salary"
                        className="form-control"
                        type="text"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    onClick={() => console.log('Clicked on approve button!')}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Employee Modal */}
    </div>
  );
};
export default CandidateProfile;
