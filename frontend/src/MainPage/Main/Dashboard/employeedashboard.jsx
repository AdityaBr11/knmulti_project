import React, { useEffect, useState, Component } from 'react';
import { Link } from 'react-router-dom';
import { fetchLeaves } from '../../../lib/api';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import EmployeeTask from './EmployeeTask';
import httpService from '../../../lib/httpService';
// import { dateDiff,  } from '../../misc/helpers';

import {
  Avatar_02,
  Avatar_04,
  Avatar_05,
  Avatar_07,
  Avatar_08,
  Avatar_09,
} from '../../../Entryfile/imagepath.jsx';
import { dateDiff } from '../../../misc/helpers';

const EmployeeDashboard = () => {
  const [selectRender, setSelectRender] = useState('default');
  const user = useSelector((state) => state.authentication.value.user);
  const [employeeList, setEmployeeList] = useState([]);
  const [filterQueries, setFilterQueries] = useState({
    name: '',
    date: null,
    month: null,
    year: null,
  });
  // const [filteredByNameList, setFilteredByNameList] = useState([]);
  const [filterQueries2, setFilterQueries2] = useState({
    month: { value: new Date().getMonth() },
    year: { value: new Date().getFullYear() },
  });
  const [totalLeaves, setTotalLeaves] = useState([]);
  const [TOTAL_LEAVES, setTOTAL_LEAVES] = useState();
  const [empTask, setEmpTask] = useState();
  const [filterEmpTask, setFilterEmpTask] = useState([]);
  const [today, setToday] = useState([]);
  const [tomorrow, setTomorrow] = useState([]);
  const todayDate = new Date().toDateString();
  const [curr, setCurr] = useState("");
  console.log(curr, 'curr..||');
  console.log(filterEmpTask, 'filterEmpTask');

  //employee leaves
  const onFilterClick = async (e) => {
    setTOTAL_LEAVES(user?.totalLeaves);
    const res2 = await fetchLeaves(user?._id);
    // console.log()
    var count = 0;
    for (let i = 0; i < res2.length; i++) {
      if (res2[i].approved == true) {

        count = count + dateDiff(new Date(res2[i]?.fromDate), new Date(res2[i]?.toDate));
        console.log(dateDiff(new Date(res2[i]?.fromDate), new Date(res2[i]?.toDate)), "setTotalLeavessetTotalLeaves");
      }

      console.log(count, "setTotalLeaves");
    }
    setTotalLeaves(count);
    // console.log(count, "setTotalLeavessetTotalLeaves");
  };
  //employee leaves

  useEffect(() => {
    onFilterClick();
  }, []);

  //employee task
  const fetchEmpTask = async () => {
    const res = await httpService.get(`/employeeTask`);
    setEmpTask(res?.data);
  };

  useEffect(() => {
    fetchEmpTask();
  }, []);

  const filterEmp = () => {
    empTask
      ?.filter((e) => {
        if (e?.id === user?._id) {
          return e;
        }
      })
      .map((e) => {
        setFilterEmpTask((oldArray) => [...oldArray, e]);
      });
  };
  useEffect(() => {
    filterEmp();
  }, [empTask]);

  const filterToday = (e) => {
    filterEmpTask
      ?.filter((e) => {
        if (new Date(e?.start).toDateString() === todayDate) {
          return e;
        }
      })
      .map((e) => {
        setToday((oldArray) => [...oldArray, e]);
      });
  };
  const filterTomorrow = (e) => {
    const tomorrow = new Date(todayDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    console.log(tomorrow, 'tomorrow');
    filterEmpTask
      ?.filter((e) => {
        if (new Date(e?.start).toDateString() === tomorrow.toDateString()) {
          return e;
        }
      })
      .map((e) => {
        console.log(e, 'emap');
        setTomorrow((oldArray) => [...oldArray, e]);
      });
  };
  useEffect(
    (e) => {
      filterToday();
      filterTomorrow();
    },
    [filterEmpTask]
  );

  //delete task
  const handleLinkClick = (e, taskId) => {
    setCurr(taskId);
  }
  console.log(user, 'useruser')

  const handleDelete = async (e) => {
    e.preventDefault()
    await httpService.delete(`/employeeTask/${curr}`);
    // await fetchdepts();
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }
  //delete
  //employee task

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Dashboard</title>
        <meta name="description" content="Dashboard" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="welcome-box">
              <div className="welcome-img">
                {user?.fileInfoPic ? <img alt="" src={user?.fileInfoPic[0]?.filePath} /> : <img alt="" src={Avatar_02} />}

              </div>
              <div className="welcome-det">
                <br></br>
                <h3>Welcome, {user?.firstName}</h3>
                {/* <p>Monday, 20 May 2021</p> */}
              </div>
            </div>
          </div>
        </div>
        {selectRender == 'default' ? (
          <div className="row">
            <div className="col-lg-8 col-md-8">
              <section className="dash-section">
                <h1 className="dash-sec-title">Today's News</h1>
                <p
                  className="text-primary"
                  role="button"
                  onClick={() => {
                    setSelectRender('employeetask');
                  }}
                >
                  Employee Task
                </p>
                <div className="dash-sec-content">
                  {today?.map((e) => (
                    <div className="dash-info-list">
                      <a href="#" className="dash-card hover-shadow">
                        <div className="dash-card-container">
                          <div className="dash-card-icon">
                            <i className="fa fa-hourglass-o" />
                          </div>
                          <div className="dash-card-content">
                            <p>{e?.title}</p>
                          </div>
                          <div className="dash-card-avatars">
                            <div className="e-avatar">
                              <img src={Avatar_09} alt="" />
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  ))}
                  {/* <div className="dash-info-list">
                    <a href="#" className="dash-card">
                      <div className="dash-card-container">
                        <div className="dash-card-icon">
                          <i className="fa fa-suitcase" />
                        </div>
                        <div className="dash-card-content">
                          <p>You are away today</p>
                        </div>
                        <div className="dash-card-avatars">
                          <div className="e-avatar">
                            <img src={Avatar_02} alt="" />
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="dash-info-list">
                    <a href="#" className="dash-card">
                      <div className="dash-card-container">
                        <div className="dash-card-icon">
                          <i className="fa fa-building-o" />
                        </div>
                        <div className="dash-card-content">
                          <p>You are working from home today</p>
                        </div>
                        <div className="dash-card-avatars">
                          <div className="e-avatar">
                            <img src={Avatar_02} alt="" />
                          </div>
                        </div>
                      </div>
                    </a>
                  </div> */}
                </div>
              </section>
              <section className="dash-section">
                <h1 className="dash-sec-title">What's Happening Tomorrow</h1>
                <div className="dash-sec-content">
                  {tomorrow?.map((e) => (
                    <div className="dash-info-list">
                      <div className="dash-card">
                        <div className="dash-card-container">
                          <div className="dash-card-icon">
                            <i className="fa fa-suitcase" />
                          </div>
                          <div className="dash-card-content">
                            <p>{e?.title}</p>
                          </div>
                          <div className="dash-card-avatars">
                            <a href="#" className="e-avatar">
                              <img src={Avatar_04} alt="" />
                            </a>
                            <a href="#" className="e-avatar">
                              <img src={Avatar_08} alt="" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              <section className="dash-section">
                <h1 className="dash-sec-title">Next seven days</h1>
                <div className="dash-sec-content">
                  {filterEmpTask?.map((e) => (
                    <div className="dash-info-list">
                      <div className="dash-card">
                        <div className="dash-card-container">
                          <div className="dash-card-icon">
                            <i className="fa fa-suitcase" />
                          </div>
                          <div className="dash-card-content">
                            <p>{e?.title}</p>
                          </div>
                          <div className="dash-card-avatars">
                            <a href="#" className="e-avatar">
                              <img src={Avatar_04} alt="" />
                            </a>
                            <a href="#" className="e-avatar">
                              <img src={Avatar_02} alt="" />
                            </a>
                          </div>

                          <div className="dropdown dropdown-action text-right">
                            <a
                              href="#"
                              className="action-icon dropdown-toggle"
                              data-toggle="dropdown"
                              aria-expanded="false"
                            // onClick={() => handleLinkClick(e?._id)}
                            >
                              <i className="material-icons">more_vert</i>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right">
                              <a
                                className="dropdown-item"
                                href="#"
                                data-toggle="modal"
                                data-target="#delete_leavetype"
                                onClick={() => setCurr(e?._id)}
                              >
                                <i className="fa fa-trash-o m-r-5" /> Delete
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* <div className="dash-info-list">
                    <div className="dash-card">
                      <div className="dash-card-container">
                        <div className="dash-card-icon">
                          <i className="fa fa-user-plus" />
                        </div>
                        <div className="dash-card-content">
                          <p>Your first day is going to be on Thursday</p>
                        </div>
                        <div className="dash-card-avatars">
                          <div className="e-avatar">
                            <img src={Avatar_02} alt="" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="dash-info-list">
                    <a href="" className="dash-card">
                      <div className="dash-card-container">
                        <div className="dash-card-icon">
                          <i className="fa fa-calendar" />
                        </div>
                        <div className="dash-card-content">
                          <p>It's Spring Bank Holiday on Monday</p>
                        </div>
                      </div>
                    </a>
                  </div> */}
                  {/* Delete task Modal */}
                  <div
                    className="modal custom-modal fade"
                    id="delete_leavetype"
                    role="dialog"
                    data-backdrop="static"
                    data-keyboard={false}
                  >
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        <div className="modal-body">
                          <div className="form-header">
                            <h3>Delete Leave Type</h3>
                            <p>Are you sure want to delete?</p>
                          </div>
                          <div className="modal-btn delete-action">
                            <div className="row">
                              <div className="col-6">
                                <a
                                  href=""
                                  className="btn btn-primary continue-btn"
                                  data-dismiss="modal"
                                  onClick={handleDelete}
                                >
                                  Delete
                                </a>
                              </div>
                              <div className="col-6">
                                <a
                                  href=""
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
                  {/* /Delete task Modal */}
                </div>
              </section>
            </div>
            <div className="col-lg-4 col-md-4">
              <div className="dash-sidebar">

                <section>
                  <h5 className="dash-title">Your Leave</h5>
                  <div className="card">
                    <div className="card-body">
                      <div className="time-list">
                        <div className="dash-stats-list">
                          <h4>{totalLeaves || 0}</h4>
                          <p>Leave Taken</p>
                        </div>
                        <div className="dash-stats-list">
                          {/* {totalLeaves} */}
                          <h4>
                            {TOTAL_LEAVES - totalLeaves > 0
                              ? TOTAL_LEAVES - totalLeaves || 0
                              : 24 - totalLeaves}
                            {/* {24 - totalLeaves?.length} */}
                          </h4>
                          <p>Remaining</p>
                        </div>
                      </div>
                      {/* <div className="request-btn">
                      <a className="btn btn-primary" href="#">
                        Apply Leave
                      </a>
                    </div> */}
                    </div>
                  </div>
                </section>
                <section>
                  {/* <h5 className="dash-title">Your time off allowance</h5> */}
                  <div className="card">
                    <div className="card-body">
                      {/* <div className="time-list">
                        <div className="dash-stats-list">
                          <h4>5.0 Hours</h4>
                          <p>Approved</p>
                        </div>
                        <div className="dash-stats-list">
                          <h4>15 Hours</h4>
                          <p>Remaining</p>
                        </div>
                      </div> */}
                      {/* <div className="request-btn">
                      <a className="btn btn-primary" href="#">
                        Apply Time Off
                      </a>
                    </div> */}
                    </div>
                  </div>
                </section>
                {/* <section>
                  <h5 className="dash-title">Upcoming Holiday</h5>
                  <div className="card">
                    <div className="card-body text-center">
                      <h4 className="holiday-title mb-0">
                        Mon 20 May 2021 - Ramzan
                      </h4>
                    </div>
                  </div>
                </section> */}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="row">
              <EmployeeTask empTask={filterEmpTask} />
            </div>
          </>
        )}
      </div>
      {/* /Page Content */}
    </div>
  );
};

export default EmployeeDashboard;
