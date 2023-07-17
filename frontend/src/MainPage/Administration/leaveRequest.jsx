import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import { Table } from 'antd';
import 'antd/dist/antd.css';
import { itemRender, onShowSizeChange } from '../paginationfunction';
import '../antdstyle.css';
import {
  allemployee,
  deleteLeave,
  editLeave,
  fetchAttendance,
  fetchLeaves,
  fetchLeaveTypes,
} from '../../lib/api/index.js';
import { dateDiff, employeesPresentOnDate } from '../../misc/helpers';
import { LEAVE_STATES } from '../../model/shared/leaveStates';
import EmployeesPresentList from './employeesPresentList';
import UnPlannedLeavesList from './unPlannedLeavesList';
import PendingLeavesList from './pendingLeavesList';
import PlannedLeavesList from './plannedLeavesList';
import { createNotify } from '../../features/notify/notifySlice';
import { useDispatch, useSelector } from 'react-redux';

const LeaveRequest = () => {

  const dispatch = useDispatch();

  const empData = useSelector((state) => state?.authentication?.value?.user);

  const { user } = JSON.parse(localStorage.getItem('auth'));
  const [leavesData, setLeavesData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [plannedLeaves, setPlannedLeaves] = useState([]);
  const [filterQueries, setFilterQueries] = useState({
    name: '',
    leaveType: '',
    status: '',
    fromDate: "",
    toDate: "",
  });
  const [leaveTypesData, setLeaveTypesData] = useState([]);
  const [deleteData, setDeleteData] = useState(null);
  const [currentRender, setCurrentRender] = useState('default');
  const [presentEmpId, setPresentEmpId] = useState([]);
  const [plannedEmpId, setPlannedEmpId] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  console.log(presentEmpId, 'emp Id leavRQ');

  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }
  });

  const loadFn = async () => {
    const res = await fetchLeaves();
    console.log(res, 'res fetchleaves...');
    setLeavesData(
      res?.map((leave, index) => {
        return {
          _id: leave?._id,
          id: index + 1,
          employee: leave?.employee,
          leaveType: leave?.leaveType?.leaveTypeName,
          fromDate: new Date(leave?.fromDate).toLocaleDateString(),
          toDate: new Date(leave?.toDate).toLocaleDateString(),
          noofdays: dateDiff(
            new Date(leave?.fromDate),
            new Date(leave?.toDate)
          ),
          reason: leave?.reason,
          status: leave?.status,
        };
      })
    );
    setPlannedLeaves(
      res?.filter(
        (leave) =>
          new Date().getTime() > new Date(leave?.fromDate).getTime() &&
          new Date().getTime() < new Date(leave?.toDate).getTime()
      )
    );
    const res2 = await allemployee();
    setEmployeeData(res2);
    const res3 = await fetchAttendance();
    setAttendance(res3);
    const res4 = await fetchLeaveTypes();
    setLeaveTypesData(res4);
  };

  useEffect(() => {
    loadFn();
  }, []);

  const handleLeaveStatusEdit = async (record, newStatus) => {
    // console.log(record);
    const { _id, employee } = record;
    console.log({ record });
    const res = await fetchLeaves(employee?._id);
    const currentLeave = res?.filter((leave) => leave?._id === _id);
    const res2 = await editLeave(_id, {
      ...currentLeave,
      status: newStatus,
      approved: newStatus === 'APPROVED',
      approvedBy: newStatus === 'APPROVED' ? user?._id : null,
      approvedDate: newStatus === 'APPROVED' ? new Date() : null,
    });
    console.log('New leave status... ', res2);

    dispatch(createNotify({
      notifyHead: `Leave Request ${res2?.status}`,
      notifyBody: `Leave Request changed to ${res2?.status} regarding ${res2?.reason}`,
      createdBy: res2?.employee
    }));

    await loadFn();
  };

  const handleFilterClick = async (e) => {
    e.preventDefault();
    console.log(filterQueries);

    const res = await fetchLeaves();

    const resData = await res?.map((leave, index) => {
      return {
        _id: leave?._id,
        id: index + 1,
        employee: leave?.employee,
        leaveType: leave?.leaveType?.leaveTypeName,
        fromDate: new Date(leave?.fromDate).toLocaleDateString(),
        toDate: new Date(leave?.toDate).toLocaleDateString(),
        noofdays: dateDiff(new Date(leave?.fromDate), new Date(leave?.toDate)),
        reason: leave?.reason,
        status: leave?.status,
      };
    });

    let filteredArray = [...resData];
    console.log(filteredArray, 'filtdarray');
    if (filterQueries?.name) {
      // filteredArray = [
      //   ...filteredArray,
      //   ...leavesData?.filter(
      //     (leave) =>
      //       employeeData?.filter((emp) => emp?._id === leave?.employee)[0]
      //         ?.name === filterQueries?.name
      //   ),
      // ];
      filteredArray = filteredArray.filter(
        (fd) =>
          fd?.employee?.name
            ?.toLowerCase()
            .indexOf(filterQueries?.name?.toLowerCase()) > -1
      );
    }

    if (filterQueries?.leaveType) {
      // filteredArray = [
      //   ...filteredArray,
      //   ...leavesData?.filter(
      //     (leave) =>
      //       leave?.leaveType === filterQueries?.leaveType?.leaveTypeName
      //   ),
      // ];

      filteredArray = filteredArray.filter(
        (fd) => fd?.leaveType === filterQueries?.leaveType?.leaveTypeName
      );
    }

    if (filterQueries?.status) {
      // filteredArray = [
      //   ...filteredArray,
      //   ...leavesData?.filter(
      //     (leave) => leave?.status === filterQueries?.status
      //   ),
      // ];
      filteredArray = filteredArray.filter(
        (fd) => fd?.status === filterQueries?.status
      );
    }

    if (filterQueries?.fromDate) {
      // filteredArray = [
      //   ...filteredArray,
      //   ...leavesData?.filter(
      //     (leave) =>
      //       leave?.fromDate === filterQueries?.fromDate?.toLocaleDateString()
      //   ),
      // ];
      filteredArray = filteredArray.filter(
        (fd) => fd?.fromDate >= filterQueries?.fromDate?.toLocaleDateString()
      );
    }

    if (filterQueries?.toDate) {
      // filteredArray = [
      //   ...filteredArray,
      //   ...leavesData?.filter(
      //     (leave) =>
      //       leave?.toDate === filterQueries?.toDate?.toLocaleDateString()
      //   ),
      // ];
      filteredArray = filteredArray.filter(
        (fd) => fd?.fromDate <= filterQueries?.toDate?.toLocaleDateString()
      );
    }

    let uniqueFilteredData = [];
    filteredArray.forEach((val) => {
      if (!uniqueFilteredData.includes(val)) {
        uniqueFilteredData.push(val);
      }
    });
    setLeavesData(uniqueFilteredData);
  };


  const handleDelete = async (e) => {
    e.preventDefault();
    if (!deleteData) return null;
    console.log(deleteData, ' <-- TBD');
    const res = await deleteLeave(deleteData?._id);
    setLeavesData(
      leavesData?.filter((leave) => leave?._id !== deleteData?._id)
    );
    setDeleteData(null);
  };

  console.log({ leavesData }, 'leaves Data...');

  const columns = [
    // {
    //   title: 'Sr. No.',
    //   dataIndex: 'id',
    //   sorter: (a, b) => a.leavetype.length - b.leavetype.length,
    // },
    {
      title: 'Employee',
      render: (text, record) => (
        <h2 className="table-avatar">
          {/* <Link to="/app/profile/employee-profile" className="avatar">
               {} <img alt="" src={record.image} />
              </Link> */}
          <Link to={`/app/profile/employee-profile/${record?.employee?._id}`}>
            {/* {(() => {
              const employee = employeeData?.filter(
                (emp) => emp?._id === record?.employee
              )[0];
              return `${employee && employee?.firstName} ${
                employee && employee?.lastName
              }`;
            })()}{' '} */}
            {record?.employee?.name}
            <span>
              {
                // employeeData?.filter((emp) => emp?._id === record?.employee)[0]
                //   ?.jobRole?.name
                record?.employee?.jobRole?.name
              }
            </span>
          </Link>
        </h2>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: 'Leave Type',
      dataIndex: 'leaveType',
      sorter: (a, b) => a.leavetype.length - b.leavetype.length,
    },

    {
      title: 'From',
      dataIndex: 'fromDate',
      sorter: (a, b) => a.fromDate.length - b.fromDate.length,
    },
    {
      title: 'To',
      dataIndex: 'toDate',
      sorter: (a, b) => a.toDate.length - b.toDate.length,
    },

    {
      title: 'No Of Days',
      dataIndex: 'noofdays',
      sorter: (a, b) => a.noofdays.length - b.noofdays.length,
    },

    {
      title: 'Reason',
      dataIndex: 'reason',
      render: (text) => (
        <span>
          {String(text).length > 20
            ? String(text).substring(1, 20) + '...'
            : text}
        </span>
      ),
      sorter: (a, b) => a.reason.length - b.reason.length,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text, record) => (
        <div className="dropdown action-label text-center">
          {record?.status !== 'APPROVED' ? (
            <>
              {record?.status === 'DECLINED' ? (<>

                <>
                  <span>
                    <i className="fa fa-dot-circle-o text-danger" />{' '}
                    <small> {text} </small>
                  </span>
                </>


              </>) :
                (<>
                  <a
                    className="btn btn-white btn-sm btn-rounded dropdown-toggle"
                    href="#"
                    data-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i
                      className={
                        text === 'NEW'
                          ? 'fa fa-dot-circle-o text-purple'
                          : text === 'PENDING'
                            ? 'fa fa-dot-circle-o text-info'
                            : text === 'APPROVED'
                              ? 'fa fa-dot-circle-o text-success'
                              : 'fa fa-dot-circle-o text-danger'
                      }
                    />{' '}
                    {text}{' '}
                  </a>
                </>)}
              <div className="dropdown-menu dropdown-menu-right">
                {Object.keys(LEAVE_STATES).map((state, index) => (
                  <span
                    key={index}
                    className="dropdown-item text-left"
                    onClick={() => {
                      handleLeaveStatusEdit(record, LEAVE_STATES[state]);
                    }}
                  >
                    {String(state).toUpperCase()}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <>
              <span>
                <i className="fa fa-dot-circle-o text-success" />{' '}
                <small> {text} </small>
              </span>
            </>
          )}
        </div>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
    },
    // {
    //   title: 'Action',
    //   render: (text, record) => (
    //     <div className="dropdown dropdown-action text-right">
    //       <a
    //         href="#"
    //         className="action-icon dropdown-toggle"
    //         data-toggle="dropdown"
    //         aria-expanded="false"
    //       >
    //         <i className="material-icons">more_vert</i>
    //       </a>
    //       <div className="dropdown-menu dropdown-menu-right">
    //         {/* <a
    //           className="dropdown-item"
    //           href="#"
    //           data-toggle="modal"
    //           data-target="#edit_leave"
    //         >
    //           <i className="fa fa-pencil m-r-5" /> Edit
    //         </a> */}
    //         <a
    //           className="dropdown-item"
    //           href="#"
    //           data-toggle="modal"
    //           data-target="#delete_approve"
    //           onClick={() => setDeleteData(record)}
    //         >
    //           <i className="fa fa-trash-o m-r-5" /> Delete
    //         </a>
    //       </div>
    //     </div>
    //   ),
    // },
  ];

  return (
    <>
      {currentRender === 'default' ? (
        <>
          <div className="page-wrapper">
            <Helmet>
              <title>Leaves</title>
              <meta name="description" content="Login page" />
            </Helmet>
            <div className="content container-fluid">
              {/* Page Header */}
              <div className="page-header">
                <div className="row align-items-center">
                  <div className="col">
                    <h3 className="page-title">Leaves</h3>
                    <ul className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Link to="/app/main/dashboard">Dashboard</Link>
                      </li>
                      <li className="breadcrumb-item active">Leaves</li>
                      <li className="breadcrumb-item active">Leave Request</li>
                    </ul>
                  </div>
                  {/* <div className="col-auto float-right ml-auto">
              <a
                href="#"
                className="btn add-btn"
                data-toggle="modal"
                data-target="#add_leave"
              >
                <i className="fa fa-plus" /> Add Leave
              </a>
            </div> */}
                </div>
              </div>
              {/* /Page Header */}
              {/* Leave Statistics */}
              <div className="row">
                <div
                  className="col-md-3"
                  onClick={() => {
                    setCurrentRender('present-list');
                    employeesPresentOnDate(attendance)?.map((e) =>
                      setPresentEmpId((oldArray) => [...oldArray, e.employee])
                    );
                  }}
                >
                  <div className="stats-info">
                    <h6>Today Presents</h6>
                    <h4>
                      {employeesPresentOnDate(attendance)?.length} /{' '}
                      {console.log(
                        employeesPresentOnDate(attendance),
                        'filtered present Emp'
                      )}
                      {employeeData && employeeData?.length}
                    </h4>
                  </div>
                </div>
                <div
                  className="col-md-3"
                  onClick={() => {
                    setCurrentRender('planned-leaves');
                    employeesPresentOnDate(attendance)?.map((e) =>
                      setPlannedEmpId((oldArray) => [
                        ...oldArray,
                        e?.employee?._id,
                      ])
                    );
                  }}
                >
                  <div className="stats-info">
                    <h6>Planned Leaves</h6>
                    <h4>
                      {plannedLeaves && plannedLeaves?.length}{' '}
                      <span>Today</span>
                    </h4>
                  </div>
                </div>
                <div
                  className="col-md-3"
                  onClick={() => {
                    setCurrentRender('unplanned-leaves');
                    employeesPresentOnDate(attendance)?.map((e) =>
                      setPresentEmpId((oldArray) => [...oldArray, e.employee])
                    );
                  }}
                >
                  <div className="stats-info">
                    <h6>Unplanned Leaves</h6>
                    <h4>
                      {employeeData?.length -
                        employeesPresentOnDate(attendance)?.length}{' '}
                      <span>Today</span>
                    </h4>
                  </div>
                </div>
                <div
                  className="col-md-3"
                  onClick={() => {
                    setCurrentRender('pending-list');
                    leavesData
                      ?.filter((pending) => {
                        return ['NEW', 'PENDING'].includes(pending?.status);
                      })
                      .map((pending) =>
                        setPendingLeaves((oldArray) => [
                          ...oldArray,
                          pending?.employee?._id,
                        ])
                      );
                  }}
                >
                  <div className="stats-info">
                    <h6>Pending Requests</h6>
                    <h4>
                      {
                        leavesData?.filter((leave) =>
                          ['NEW', 'PENDING'].includes(leave?.status)
                        ).length
                      }
                    </h4>
                  </div>
                </div>
              </div>
              {/* /Leave Statistics */}
              {/* Search Filter */}
              <div className="row filter-row">
                <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
                  <div className="form-group form-focus focused">
                    <input
                      type="text"
                      className="form-control floating"
                      value={filterQueries?.name}
                      onChange={(e) =>
                        setFilterQueries({
                          ...filterQueries,
                          name: e.target.value,
                        })
                      }
                    />
                    <label className="focus-label">Employee Name</label>
                  </div>
                </div>
                <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
                  <div className="form-group form-focus focused text-left">
                    <a
                      className="btn form-control btn-white dropdown-toggle"
                      href="#"
                      data-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {filterQueries?.leaveType?.leaveTypeName || 'Leave Type'}
                    </a>
                    <div className="dropdown-menu dropdown-menu-right">
                      {leaveTypesData?.map((leaveType) => (
                        <span
                          className="dropdown-item"
                          onClick={() =>
                            setFilterQueries({
                              ...filterQueries,
                              leaveType: leaveType,
                            })
                          }
                        >
                          <i className="fa" /> {leaveType?.leaveTypeName}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
                  <div className="form-group form-focus focused text-left">
                    <a
                      className="btn form-control btn-white dropdown-toggle"
                      href="#"
                      data-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {filterQueries?.status || 'Status'}
                    </a>
                    <div className="dropdown-menu dropdown-menu-right">
                      {Object.values(LEAVE_STATES)?.map((status) => (
                        <span
                          className="dropdown-item"
                          onClick={() =>
                            setFilterQueries({
                              ...filterQueries,
                              status: status,
                            })
                          }
                        >
                          <i className="fa" /> {status}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
                  <div className="form-group form-focus select-focus">
                    <input
                      className="form-control floating"
                      type="date"
                      value={filterQueries?.fromDate === "" ? filterQueries?.fromDate : filterQueries?.fromDate?.toISOString().split("T")[0]}
                      onChange={(e) =>
                        setFilterQueries({
                          ...filterQueries,
                          fromDate: new Date(e.target.value),
                        })
                      }
                    />
                    <label className="focus-label">From</label>
                  </div>
                </div>
                <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
                  <div className="form-group form-focus select-focus">
                    <input
                      className="form-control floating"
                      type="date"
                      value={filterQueries?.toDate === "" ? filterQueries?.toDate : filterQueries?.toDate?.toISOString().split("T")[0]}
                      onChange={(e) =>
                        setFilterQueries({
                          ...filterQueries,
                          toDate: new Date(e.target.value),
                        })
                      }
                    />
                    <label className="focus-label">To</label>
                  </div>
                </div>
                <div className="col-sm-6 col-md-3 col-lg-3 col-xl-1 col-12">
                  <button
                    className="btn btn-success"
                    onClick={handleFilterClick}
                  >
                    {' '}
                    Search{' '}
                  </button>
                </div>
                <div className="col-sm-6 col-md-3 col-lg-3 col-xl-1 col-12">
                  <button
                    className="btn btn-danger"
                    onClick={(e) => {
                      loadFn(); setFilterQueries({
                        ...filterQueries,
                        name: "", leaveType: "", status: "", toDate: "", fromDate: ""
                      })
                    }}
                  >
                    RESET
                  </button>
                </div>
              </div>
              {/* /Search Filter */}
              <div className="row">
                <div className="col-md-12">
                  <div className="table-responsive">
                    <Table
                      className="table-striped"
                      pagination={{
                        total: leavesData.length,
                        showTotal: (total, range) =>
                          `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        itemRender: itemRender,
                      }}
                      style={{ overflowX: 'auto' }}
                      columns={columns}
                      // bordered
                      dataSource={leavesData.reverse()}
                      rowKey={(record) => record.id}
                      onChange={console.log('chnage')}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* /Page Content */}
            {/* Add Leave Modal */}
            <div
              id="add_leave"
              className="modal custom-modal fade"
              role="dialog"
            >
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Add Leave</h5>
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
                        <label>
                          Leave Type <span className="text-danger">*</span>
                        </label>
                        <select className="select">
                          <option>Select Leave Type</option>
                          <option>Casual Leave 12 Days</option>
                          <option>Medical Leave</option>
                          <option>Loss of Pay</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>
                          From <span className="text-danger">*</span>
                        </label>
                        <div>
                          <input
                            className="form-control datetimepicker"
                            type="date"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>
                          To <span className="text-danger">*</span>
                        </label>
                        <div>
                          <input
                            className="form-control datetimepicker"
                            type="date"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>
                          Number of days <span className="text-danger">*</span>
                        </label>
                        <input className="form-control" readOnly type="text" />
                      </div>
                      <div className="form-group">
                        <label>
                          Remaining Leaves{' '}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          className="form-control"
                          readOnly
                          defaultValue={12}
                          type="text"
                        />
                      </div>
                      <div className="form-group">
                        <label>
                          Leave Reason <span className="text-danger">*</span>
                        </label>
                        <textarea
                          rows={4}
                          className="form-control"
                          defaultValue={''}
                        />
                      </div>
                      <div className="submit-section">
                        <button className="btn btn-primary submit-btn">
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            {/* /Add Leave Modal */}
            {/* Edit Leave Modal */}
            <div
              id="edit_leave"
              className="modal custom-modal fade"
              role="dialog"
            >
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Leave</h5>
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
                        <label>
                          Leave Type <span className="text-danger">*</span>
                        </label>
                        <select className="select">
                          <option>Select Leave Type</option>
                          <option>Casual Leave 12 Days</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>
                          From <span className="text-danger">*</span>
                        </label>
                        <div>
                          <input
                            className="form-control datetimepicker"
                            defaultValue="01-01-2021"
                            type="date"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>
                          To <span className="text-danger">*</span>
                        </label>
                        <div>
                          <input
                            className="form-control datetimepicker"
                            defaultValue="01-01-2021"
                            type="date"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>
                          Number of days <span className="text-danger">*</span>
                        </label>
                        <input
                          className="form-control"
                          readOnly
                          type="text"
                          defaultValue={2}
                        />
                      </div>
                      <div className="form-group">
                        <label>
                          Remaining Leaves{' '}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          className="form-control"
                          readOnly
                          defaultValue={12}
                          type="text"
                        />
                      </div>
                      <div className="form-group">
                        <label>
                          Leave Reason <span className="text-danger">*</span>
                        </label>
                        <textarea
                          rows={4}
                          className="form-control"
                          defaultValue={'Going to hospital'}
                        />
                      </div>
                      <div className="submit-section">
                        <button className="btn btn-primary submit-btn">
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            {/* /Edit Leave Modal */}
            {/* Approve Leave Modal */}
            <div
              className="modal custom-modal fade"
              id="approve_leave"
              role="dialog"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-body">
                    <div className="form-header">
                      <h3>Leave Approve</h3>
                      <p>Are you sure want to approve for this leave?</p>
                    </div>
                    <div className="modal-btn delete-action">
                      <div className="row">
                        <div className="col-6">
                          <a href="" className="btn btn-primary continue-btn">
                            Approve
                          </a>
                        </div>
                        <div className="col-6">
                          <a
                            href=""
                            data-dismiss="modal"
                            className="btn btn-primary cancel-btn"
                          >
                            Decline
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Approve Leave Modal */}
            {/* Delete Leave Modal */}
            <div
              className="modal custom-modal fade"
              id="delete_approve"
              role="dialog"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-body">
                    <div className="form-header">
                      <h3>Delete Leave</h3>
                      <p>Are you sure want to delete this leave?</p>
                    </div>
                    <div className="modal-btn delete-action">
                      <div className="row">
                        <div className="col-6">
                          <a
                            href=""
                            className="btn btn-primary continue-btn"
                            onClick={handleDelete}
                            data-dismiss="modal"
                          >
                            Delete
                          </a>
                        </div>
                        <div className="col-6">
                          <a
                            href=""
                            data-dismiss="modal"
                            className="btn btn-primary cancel-btn"
                            onClick={() => setDeleteData(null)}
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
          </div>
        </>
      ) : currentRender === 'present-list' ? (
        <>
          {' '}
          <EmployeesPresentList empId={presentEmpId} setCurrentRender={setCurrentRender} />{' '}
        </>
      ) : currentRender === 'unplanned-leaves' ? (
        <>
          {' '}
          <UnPlannedLeavesList empId={presentEmpId} setCurrentRender={setCurrentRender} />{' '}
        </>
      ) : currentRender === 'pending-list' ? (
        <>
          {' '}
          <PendingLeavesList empId={pendingLeaves} setCurrentRender={setCurrentRender} />{' '}
        </>
      ) : currentRender === 'planned-leaves' ? (
        <>
          {' '}
          <PlannedLeavesList empId={plannedEmpId} setCurrentRender={setCurrentRender} />{' '}
        </>
      ) : (
        <>No Data Found</>
      )}
    </>
  );
};

export default LeaveRequest;
