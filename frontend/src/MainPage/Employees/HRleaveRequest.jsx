import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useHistory } from 'react-router-dom';
import { Avatar_02 } from '../../Entryfile/imagepath';

import { Table } from 'antd';
import 'antd/dist/antd.css';
import { itemRender, onShowSizeChange } from '../paginationfunction';
import '../antdstyle.css';
import {
  addLeave,
  editLeave,
  fetchLeaves,
  fetchLeaveTypes,
} from '../../lib/api';
import { dateDiff, localeDateStringToDateObj } from '../../misc/helpers';
import { LEAVE_STATES } from '../../model/shared/leaveStates';
import { TOTAL_LEAVES } from '../../misc/constants';
import { useDispatch, useSelector } from 'react-redux';
import { createNotify } from '../../features/notify/notifySlice';
import { toast } from 'react-toastify';
import httpService from '../../lib/httpService';

const findOIDForLeaveTypeName = (name) => { };

const HrleaveRequest = () => {
  const { user } = JSON.parse(localStorage.getItem('auth'));

  const history = useHistory();
  const dispatch = useDispatch();

  const empData = useSelector((state) => state?.authentication?.value?.user);

  const [unFormattedLeavesData, setUnFormattedLeavesData] = useState([]);
  const [leavesData, setLeavesData] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [employees, setEmployees] = useState([]);
  // const [employee, setEmployee] = useState([]);

  const [newLeave, setNewLeave] = useState({
    employee: null,
    approved: false,
    approvedBy: null,
    approvedDate: null,
    status: LEAVE_STATES.pending,
  });
  const [editLeaveData, setEditLeaveData] = useState(null);
  const fetchEmployees = async () => {
    const employees = await httpService.get('/employee');
    setEmployees(employees.data);
  };
  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(async () => {
    const res = await fetchLeaveTypes();
    setLeaveTypes(res);
    const res2 = await fetchLeaves(null);
    console.log(res2);
    setUnFormattedLeavesData(res2);
    setLeavesData(
      res2?.map((leave, index) => {
        return {
          ...leave,
          id: index + 1,
          leaveType: leave?.leaveType?.leaveTypeName,
          fromDate: new Date(leave?.fromDate).toLocaleDateString(),
          toDate: new Date(leave?.toDate).toLocaleDateString(),
          noofdays: dateDiff(
            new Date(leave?.fromDate),
            new Date(leave?.toDate)
          ),
          reason: leave?.reason,
          status: leave?.status,
          // employee:leave?.employee,
        };
      })
    );
  }, []);

  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }
    // fetchEmployees();
  });


  const leaveNotify = (res) => {
    dispatch(createNotify({
      notifyHead: `Leave Request Applied`,
      notifyBody: `Applied for Leave Request of ${dateDiff(new Date(res?.fromDate), new Date(res?.toDate))} days by ${empData?.userName}`,
      createdBy: empData?._id
    }));
  }
  // console.log("setEmployee",newLeave);
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("emp leave", newLeave);
    if (!newLeave.leaveType) {
      toast.error("Select to Leave Type");
      return;
    }
    if (!newLeave.reason) {
      toast.error("Select Reason: ");
      return;
    }
    if (!newLeave.fromDate) {
      toast.error("Select From Date");
      return;
    }
    if (!newLeave.toDate) {
      toast.error("Select To Date");
      return;
    }
    console.log("setEmployee", newLeave);

    // return;

    const res = await addLeave(newLeave);
    await dispatch(createNotify({
      notifyHead: `${leaveTypes.filter((lt) => lt._id === res.leaveType)[0]
        .leaveTypeName} Request Applied`,
      notifyBody: `Applied for Leave Request of ${dateDiff(new Date(res?.fromDate), new Date(res?.toDate))} days by ${empData?.userName}`,
      createdBy: empData?._id
    }));

    setLeavesData([
      ...leavesData,
      {
        id: leavesData.length + 1,
        leaveType: leaveTypes.filter((lt) => lt._id === res.leaveType)[0]
          .leaveTypeName,
        fromDate: new Date(res?.fromDate).toLocaleDateString(),
        toDate: new Date(res?.toDate).toLocaleDateString(),
        noofdays: dateDiff(new Date(res?.fromDate), new Date(res?.toDate)),
        reason: res?.reason,
        status: res?.status,
      },
    ]);
    history.goBack();
    dispatch(createNotify({
      notifyHead: `Leave Request ${res?.status}`,
      notifyBody: `Leave Request changed to ${res?.status} regarding ${res?.reason}`,
      createdBy: res?.employee
    }));

  };

  const handleEdit = async (e) => {
    // e.preventDefault();
    let { createdAt, updatedAt, id, noofdays, ...rest } = editLeaveData;
    let putObject = {
      ...rest,
      leaveType: (() => {
        let ogLeaveData = leavesData.filter(
          (leave) => leave?._id === rest._id
        )[0];
        if (editLeaveData?.leaveType === ogLeaveData?.leaveType) {
          return unFormattedLeavesData.filter(
            (leave) => leave?._id === rest._id
          )[0].leaveType;
        }
        return editLeaveData?.leaveType;
      })(),
      fromDate:
        typeof editLeaveData?.fromDate === 'object'
          ? editLeaveData?.fromDate
          : localeDateStringToDateObj(editLeaveData?.fromDate),
      toDate:
        typeof editLeaveData?.toDate === 'object'
          ? editLeaveData?.toDate
          : localeDateStringToDateObj(editLeaveData?.toDate),
      reason: editLeaveData?.reason,
      employee: user?._id,
      approved: false,
      approvedBy: null,
      approvedDate: null,
      status: LEAVE_STATES.pending,
    };
    console.log(putObject);

    const res = await editLeave(putObject?._id, putObject);
  };

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      sorter: (a, b) => a.leavetype.length - b.leavetype.length,
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
            ? String(text).substring(0, 20) + '...'
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
          <span>
            {/* className="btn btn-white btn-sm btn-rounded" */}
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
            <small> {text} </small>
          </span>
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
    //         <a
    //           className="dropdown-item"
    //           href="#"
    //           data-toggle="modal"
    //           data-target="#edit_leave"
    //           onClick={() => setEditLeaveData(record)}
    //         >
    //           <i className="fa fa-pencil m-r-5" /> Edit
    //         </a>
    //         <a
    //           className="dropdown-item"
    //           href="#"
    //           data-toggle="modal"
    //           data-target="#delete_approve"
    //         >
    //           <i className="fa fa-trash-o m-r-5" /> Delete
    //         </a>
    //       </div>
    //     </div>
    //   ),
    // },
  ];

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Leaves </title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
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
                <li className="breadcrumb-item active"> Empolyees Leaves</li>
              </ul>
            </div>
            <div className="col-auto float-right ml-auto">
              <a
                href="#"
                className="btn add-btn"
                data-toggle="modal"
                data-target="#add_leave"
              >
                <i className="fa fa-plus" /> Add Leave
              </a>
            </div>
          </div>
        </div>
        {/* /Page Header */}

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
                dataSource={leavesData}
                rowKey={(record) => record?.id}
                onChange={console.log('change')}
              />
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
      {/* Add Leave Modal */}
      <div id="add_leave" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
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
                  <a
                    className="btn form-control btn-white dropdown-toggle"
                    href="#"
                    data-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {leaveTypes?.filter(
                      (lt) => lt?._id === newLeave?.leaveType
                    )[0]?.leaveTypeName || 'Leave Type'}
                  </a>
                  <div className="dropdown-menu dropdown-menu-right">
                    {leaveTypes?.map((lType, index) => (
                      <span
                        key={index}
                        className="dropdown-item"
                        onClick={() =>
                          setNewLeave({
                            ...newLeave,
                            leaveType: lType?._id,
                            reason: lType?.leaveTypeDescription,
                          })
                        }
                      >
                        <i className="fa" /> {lType?.leaveTypeName}
                      </span>
                    ))}
                  </div>
                </div>
                {/* <div className="col-sm-12 col-md-12"> */}
                <div className="form-group">
                  <label>
                    Employee Name <span className="text-danger">*</span>
                  </label>
                  <select
                    className="custom-select"
                    // value={employee}
                    // onChange={(e) => {
                    //   setEmployee(e.target.value);
                    // }}
                    onChange={(e) =>
                      setNewLeave({
                        ...newLeave,
                        employee: e.target.value,
                      })
                    }
                    required
                  >
                    <option value={''} selected>
                      Please Select
                    </option>
                    {employees.map((emp) => (
                      <option key={emp?._id} value={emp?._id}>
                        {emp?.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* </div> */}
                <div className="form-group">
                  <label>
                    From <span className="text-danger">*</span>
                  </label>
                  <div>
                    <input
                      className="form-control"
                      required
                      type="date"
                      onChange={(e) =>
                        setNewLeave({
                          ...newLeave,
                          fromDate: new Date(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    To <span className="text-danger">*</span>
                  </label>
                  <div>
                    <input
                      required
                      className="form-control"
                      type="date"
                      onChange={(e) =>
                        setNewLeave({
                          ...newLeave,
                          toDate: new Date(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Number of days</label>
                  <input
                    className="form-control"
                    readOnly
                    type="text"

                    value={
                      newLeave?.fromDate && newLeave?.toDate
                        ? dateDiff(newLeave?.fromDate, newLeave?.toDate)
                        : '-'
                    }
                  />
                </div>
                <div className="form-group">
                  <label>
                    Remaining Leaves <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    readOnly
                    value={
                      newLeave.fromDate && newLeave.toDate
                        ? TOTAL_LEAVES -
                        dateDiff(newLeave?.fromDate, newLeave?.toDate)
                        : '-'
                    }
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <label>
                    Leave Reason <span className="text-danger">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="form-control"
                    defaultValue={newLeave?.reason}
                    onChange={(e) =>
                      setNewLeave({ ...newLeave, reason: e.target.value })
                    }
                  />
                </div>
                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    onClick={handleSubmit}
                    data-dismiss="modal"
                    aria-label="Close"
                  >
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
      <div id="edit_leave" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
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
                  <a
                    className="btn form-control btn-white dropdown-toggle"
                    href="#"
                    data-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {leaveTypes?.filter(
                      (lt) => lt?._id === editLeaveData?.leaveType
                    )[0]?.leaveTypeName || editLeaveData?.leaveType}
                  </a>
                  <div className="dropdown-menu dropdown-menu-right">
                    {leaveTypes?.map((lType, index) => (
                      <span
                        key={index}
                        className="dropdown-item"
                        onClick={() =>
                          setEditLeaveData({
                            ...editLeaveData,
                            leaveType: lType?._id,
                            reason: lType?.leaveTypeDescription,
                          })
                        }
                      >
                        <i className="fa" /> {lType?.leaveTypeName}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    From <span className="text-danger">*</span>
                  </label>
                  <div>
                    <input
                      className="form-control"
                      defaultValue={
                        new Date(editLeaveData?.fromDate) || '01-01-2021'
                      }
                      type="date"
                      onChange={(e) =>
                        setEditLeaveData({
                          ...editLeaveData,
                          fromDate: new Date(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    To <span className="text-danger">*</span>
                  </label>
                  <div>
                    <input
                      className="form-control"
                      defaultValue={
                        new Date(editLeaveData?.toDate) || '01-01-2021'
                      }
                      type="date"
                      onChange={(e) =>
                        setEditLeaveData({
                          ...editLeaveData,
                          toDate: new Date(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                {/* <div className="form-group">
                  <label>
                    Number of days <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    readOnly
                    type="text"
                    defaultValue={2}
                  />
                </div> */}
                {/* <div className="form-group">
                  <label>
                    Remaining Leaves <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    readOnly
                    defaultValue={12}
                    type="text"
                  />
                </div> */}
                <div className="form-group">
                  <label>
                    Leave Reason <span className="text-danger">*</span>
                  </label>
                  <textarea
                    rows={4}
                    className="form-control"
                    defaultValue={editLeaveData?.reason}
                    onChange={(e) =>
                      setEditLeaveData({
                        ...editLeaveData,
                        reason: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    onClick={handleEdit}
                  >
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
      <div className="modal custom-modal fade" id="approve_leave" role="dialog">
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
                    <a href="" className="btn btn-primary continue-btn">
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
      {/* /Delete Leave Modal */}
    </div>
  );
};

export default HrleaveRequest;
