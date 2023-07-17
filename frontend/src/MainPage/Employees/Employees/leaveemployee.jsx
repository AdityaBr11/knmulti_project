import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Avatar_02 } from '../../../Entryfile/imagepath';

import { Table } from 'antd';
import 'antd/dist/antd.css';
import { itemRender, onShowSizeChange } from '../../paginationfunction';
import '../../antdstyle.css';
import httpService from '../../../lib/httpService';
import { useSelector } from 'react-redux';

const LeaveEmployee = () => {
  const user = useSelector((state) => state.authentication.value.user);
  const leaveTypes = useSelector(
    (state) => state.authentication.value.leaveTypes
  );
  const [leaveToEdit, setLeaveToEdit] = useState(null);
  const [leaveToCreate, setLeaveToCreate] = useState();
  const [data, setData] = useState([]);
  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }
    async function fetchData() {
      const res = await httpService.get(
        `/private/leaveapplication?userId=${user.userId}`
      );
      setData(
        res.data.map((item, i) => ({
          ...item,
          id: i + 1,
          image: Avatar_02,
          name: user.firstName + ' ' + user.lastName,
          role: user.designation,
          leavetype:
            leaveTypes.find((item) => item.leaveTypeId === item.leaveTypeId)
              .leaveTypeName || '',
          from: new Date(item.startingDate).toDateString(),
          to: new Date(item.endingDate).toDateString(),
          noofdays: item.days,
          reason: item.leavePurpose,
          status: item.status,
        }))
      );
    }
    fetchData();
  }, []);

  const handleEdit = async (e) => {
    e.preventDefault();
    const res = await httpService.put(
      `/private/leaveapplication/${leaveToEdit.applicationId}`,
      leaveToEdit
    );
    setData((leaves) => {
      const index = leaves.findIndex(
        (item) => item.applicationId === leaveToEdit.applicationId
      );
      const newData = [...leaves];
      newData[index] = {
        ...res.data,
        id: index + 1,
        image: Avatar_02,
        name: user.firstName + ' ' + user.lastName,
        role: user.designation,
        leavetype:
          leaveTypes.find((item) => item.leaveTypeId === item.leaveTypeId)
            .leaveTypeName || '',
        from: new Date(res.data.startingDate).toDateString(),
        to: new Date(res.data.endingDate).toDateString(),
        noofdays: res.data.days,
        reason: res.data.leavePurpose,
        status: res.data.status,
      };
      return newData;
    });
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  };


  const handleCreate = async (e) => {
    e.preventDefault();
    console.log("leaveToCreate", leaveToCreate);
    return;

    const res = await httpService.post('/private/leaveapplication', {
      ...leaveToCreate,
      userId: user.userId,
      days:
        new Date(leaveToCreate.endingDate).getDate() -
        new Date(leaveToCreate.startingDate).getDate(),
    });

    setData((leaves) => [
      ...leaves,
      {
        ...res.data,
        id: leaves.length + 1,
        image: Avatar_02,
        name: user.firstName + ' ' + user.lastName,
        role: user.designation,
        leavetype:
          leaveTypes.find((item) => item.leaveTypeId === item.leaveTypeId)
            .leaveTypeName || '',
        from: new Date(res.data.startingDate).toDateString(),
        to: new Date(res.data.endingDate).toDateString(),
        noofdays: res.data.days,
        reason: res.data.leavePurpose,
        status: res.data.status,
      },
    ]);
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    await httpService.delete(
      `/private/leaveapplication/${leaveToEdit.applicationId}`
    );
    setData((leaves) =>
      leaves.filter((item) => item.applicationId !== leaveToEdit.applicationId)
    );
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  };

  const columns = [
    {
      title: 'Leave Type',
      dataIndex: 'leavetype',
      sorter: (a, b) => a.leavetype.length - b.leavetype.length,
    },

    {
      title: 'From',
      dataIndex: 'from',
      sorter: (a, b) => a.from.length - b.from.length,
    },
    {
      title: 'To',
      dataIndex: 'to',
      sorter: (a, b) => a.to.length - b.to.length,
    },

    {
      title: 'No Of Days',
      dataIndex: 'noofdays',
      sorter: (a, b) => a.noofdays.length - b.noofdays.length,
    },

    {
      title: 'Reason',
      dataIndex: 'reason',
      sorter: (a, b) => a.reason.length - b.reason.length,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text, record) => (
        <div className="action-label">
          <a
            onClick={(e) => e.preventDefault()}
            className="btn btn-white btn-sm btn-rounded"
            href=""
          >
            <i
              className={
                text === 'New'
                  ? 'fa fa-dot-circle-o text-purple'
                  : text === 'Pending'
                    ? 'fa fa-dot-circle-o text-info'
                    : text === 'Approved'
                      ? 'fa fa-dot-circle-o text-success'
                      : 'fa fa-dot-circle-o text-danger'
              }
            />{' '}
            {text}
          </a>
        </div>
      ),
    },
    {
      title: 'Action',
      render: (text, record) => (
        <div className="dropdown dropdown-action text-right">
          <a
            href="#"
            className="action-icon dropdown-toggle"
            data-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="material-icons">more_vert</i>
          </a>
          <div className="dropdown-menu dropdown-menu-right">
            <a
              className="dropdown-item"
              onClick={(e) => {
                e.preventDefault();
                console.log(record);
                setLeaveToEdit(record);
              }}
              data-toggle="modal"
              data-target="#edit_leave"
            >
              <i className="fa fa-pencil m-r-5" /> Edit
            </a>
            <a
              className="dropdown-item"
              onClick={(e) => {
                e.preventDefault();
                setLeaveToEdit(record);
              }}
              data-toggle="modal"
              data-target="#delete_approve"
            >
              <i className="fa fa-trash-o m-r-5" /> Delete
            </a>
          </div>
        </div>
      ),
    },
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
                <li className="breadcrumb-item active">Leaves</li>
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
        {/* Leave Statistics */}
        <div className="row">
          <div className="col-md-3">
            <div className="stats-info">
              <h6>Annual Leave</h6>
              <h4>12</h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stats-info">
              <h6>Medical Leave</h6>
              <h4>3</h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stats-info">
              <h6>Other Leave</h6>
              <h4>4</h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stats-info">
              <h6>Remaining Leave</h6>
              <h4>5</h4>
            </div>
          </div>
        </div>
        {/* /Leave Statistics */}
        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive">
              <Table
                className="table-striped"
                pagination={{
                  total: data.length,
                  showTotal: (total, range) =>
                    `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                  showSizeChanger: true,
                  onShowSizeChange: onShowSizeChange,
                  itemRender: itemRender,
                }}
                style={{ overflowX: 'auto' }}
                columns={columns}
                // bordered
                dataSource={data}
                rowKey={(record) => record.id}
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
              <form onSubmit={handleCreate}>
                <div className="form-group">
                  <label>
                    Leave Type <span className="text-danger">*</span>
                  </label>
                  <select
                    style={{
                      display: 'block',
                      border: '1px solid #e3e3e3',
                      borderRadius: '0.25rem',
                      height: '44px',
                      width: '100%',
                      background: '#fff',
                    }}
                    onChange={(e) =>
                      setLeaveToCreate((leave) => ({
                        ...leave,
                        leaveTypeId: e.target.value,
                      }))
                    }
                  >
                    {leaveTypes?.map((type, i) => (
                      <option key={i} value={type.leaveTypeId}>
                        {type.leaveTypeName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    From <span className="text-danger">*</span>
                  </label>
                  <div>
                    <input
                      className="form-control"
                      onChange={(e) => {
                        setLeaveToCreate((leave) => ({
                          ...leave,
                          startingDate: new Date(e.target.value).toISOString(),
                        }));
                      }}
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
                      className="form-control"
                      type="date"
                      onChange={(e) => {
                        setLeaveToCreate((leave) => ({
                          ...leave,
                          endingDate: new Date(e.target.value).toISOString(),
                        }));
                      }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    Remaining Leaves <span className="text-danger">*</span>
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
                    onChange={(e) => {
                      setLeaveToCreate((leave) => ({
                        ...leave,
                        leavePurpose: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn">Submit1</button>
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
              <form onSubmit={handleEdit}>
                <div className="form-group">
                  <label>
                    Leave Type <span className="text-danger">*</span>
                  </label>
                  <select
                    defaultValue={leaveToEdit?.leaveTypeId}
                    className="select"
                    disabled
                  >
                    {leaveTypes?.map((type) => (
                      <option key={type.leaveTypeId} value={type.leaveTypeId}>
                        {type.leaveTypeName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    From <span className="text-danger">*</span>
                  </label>
                  <div>
                    <input
                      className="form-control"
                      defaultValue={
                        leaveToEdit
                          ? new Date(leaveToEdit?.startingDate)
                            .toISOString()
                            .substring(0, 10)
                          : new Date().toISOString().substring(0, 10)
                      }
                      onChange={(e) => {
                        setLeaveToEdit({
                          ...leaveToEdit,
                          startingDate: new Date(e.target.value).toISOString(),
                        });
                      }}
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
                      className="form-control"
                      defaultValue={
                        leaveToEdit
                          ? new Date(leaveToEdit?.endingDate)
                            .toISOString()
                            .substring(0, 10)
                          : new Date().toISOString().substring(0, 10)
                      }
                      onChange={(e) => {
                        setLeaveToEdit({
                          ...leaveToEdit,
                          endingDate: new Date(e.target.value).toISOString(),
                        });
                      }}
                      type="date"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    Remaining Leaves <span className="text-danger">*</span>
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
                    defaultValue={leaveToEdit?.leavePurpose}
                  />
                </div>
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit Leave Modal */}
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
                <p>Are you sure want to Cancel this leave?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <a
                      onClick={handleDelete}
                      className="btn btn-primary continue-btn"
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
      {/* /Delete Leave Modal */}
    </div>
  );
};

export default LeaveEmployee;
