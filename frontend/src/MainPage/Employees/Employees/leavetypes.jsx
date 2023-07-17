import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Table } from 'antd';
import 'antd/dist/antd.css';
import { itemRender, onShowSizeChange } from '../../paginationfunction';
import '../../antdstyle.css';
import httpService from '../../../lib/httpService';
import {
  setDesignationStore,
  setFetched,
} from '../../../features/designation/designationSlice';

const LeaveTypes = () => {
  const [data, setData] = useState([]);
  const [leaveToModify, setLeaveToModify] = useState('');
  const [leaveToAdd, setleaveToAdd] = useState('');
  const [numberOfLeavesToAdd, setNumberOfLeavesToAdd] = useState(0);
  const [descriptionOfLeaesToAdd, setDescriptionOfLeaesToAdd] = useState('');

  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }
    async function fetchData() {
      const res = await httpService.get('/leave-type');
      console.log(res.data);
      setFetched(true);
      setDesignationStore(res.data);
      setData(
        res.data.map((item, i) => ({
          ...item,
          id: i + 1,
          name: item.leaveTypeName,
        }))
      );
    }
    fetchData();
  }, []);

  const handleDelete = async () => {
    await httpService.delete(`/leave-type/${leaveToModify._id}`);
    const itemIndex = data.findIndex((e) => e._id === leaveToModify._id);
    setData((d) => [
      ...d.slice(0, itemIndex),
      ...d.slice(itemIndex + 1).map((i) => ({
        ...i,
        id: i.id - 1,
        name: item.leaveTypeName,
      })),
    ]);
    document.querySelectorAll('.cancel-btn')?.forEach((e) => e.click());
  };

  const handleAdd = async () => {
    if (leaveToAdd.length <= 0) return;
    if (numberOfLeavesToAdd <= 0) return;
    if (descriptionOfLeaesToAdd.length <= 0) return;
    const res = await httpService.post('/leave-type', {
      leaveTypeName: leaveToAdd,
      noOfLeaves: numberOfLeavesToAdd,
      leaveTypeDescription: descriptionOfLeaesToAdd,
    });
    setData((d) => [
      ...d,
      {
        ...res.data,
        id: d.length + 1,
        name: res.data.leaveTypeName,
      },
    ]);
    setleaveToAdd('');
    setNumberOfLeavesToAdd(0);
    setDescriptionOfLeaesToAdd('');
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  };

  const handleModify = async () => {
    if (leaveToModify.noOfLeaves <= 0) return;
    if (leaveToModify.leaveTypeDescription.length <= 0) return;
    const res = await httpService.put(`/leave-type/${leaveToModify._id}`, {
      leaveTypeName: leaveToModify.leaveTypeName,
      noOfLeaves: leaveToModify.noOfLeaves,
      leaveTypeDescription: leaveToModify.leaveTypeDescription,
    });
    const itemIndex = data.findIndex((e) => e._id === leaveToModify._id);
    setData((d) => [
      ...d.slice(0, itemIndex),
      leaveToModify,
      ...d.slice(itemIndex + 1),
    ]);
    setLeaveToModify('');
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      sorter: (a, b) => a.id.length - b.id.length,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.department.length - b.department.length,
    },
    {
      title: 'Description',
      // dataIndex: 'leaveTypeDescription',
      // sorter: (a, b) => a.designation.length - b.designation.length,
      render: (text, record) => (
        <p
          style={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            maxWidth: '600px',
          }}
        >
          {record.leaveTypeDescription}
        </p>
      ),
    },
    {
      title: 'No of days',
      dataIndex: 'noOfLeaves',
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
              href="#"
              data-toggle="modal"
              data-target="#edit_designation"
              onClick={() => {
                setLeaveToModify(record);
              }}
            >
              <i className="fa fa-pencil m-r-5" /> Edit
            </a>
            <a
              className="dropdown-item"
              href="#"
              data-toggle="modal"
              data-target="#delete_designation"
              onClick={() => {
                setLeaveToModify(record);
              }}
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
        <title>Leave Types </title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Leave Types</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Leave Types**##..</li>
              </ul>
            </div>
            <div className="col-auto float-right ml-auto">
              <a
                href="#"
                className="btn add-btn"
                data-toggle="modal"
                data-target="#add_designation"
              >
                <i className="fa fa-plus" /> Add Leave Type
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
      {/* Add Designation Modal */}
      <div
        id="add_designation"
        className="modal custom-modal fade"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Leave Type</h5>
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
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAdd();
                }}
              >
                <div className="form-group">
                  <label>
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    value={leaveToAdd}
                    onChange={(e) => {
                      setleaveToAdd(e.target.value);
                    }}
                    type="text"
                  />
                </div>

                <div className="form-group">
                  <label>
                    No Of Leave <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    value={numberOfLeavesToAdd}
                    onChange={(e) => {
                      setNumberOfLeavesToAdd(e.target.value);
                    }}
                    type="number"
                  />
                </div>
                <div className="form-group">
                  <label>
                    Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    value={descriptionOfLeaesToAdd}
                    onChange={(e) => {
                      setDescriptionOfLeaesToAdd(e.target.value);
                    }}
                    className="form-control"
                  />
                </div>

                <div className="submit-section">
                  <button className="btn btn-primary submit-btn">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Designation Modal */}
      {/* Edit Designation Modal */}
      <div
        id="edit_designation"
        className="modal custom-modal fade"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Leave Type</h5>
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
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleModify();
                }}
              >
                <div className="form-group">
                  <label>
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    value={leaveToModify.leaveTypeName || ''}
                    onChange={(e) => {
                      setLeaveToModify((p) => ({
                        ...p,
                        leaveTypeName: e.target.value,
                      }));
                    }}
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <label>
                    No Of Leave <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    value={leaveToModify.noOfLeaves || ''}
                    onChange={(e) => {
                      setLeaveToModify((p) => ({
                        ...p,
                        noOfLeaves: e.target.value,
                      }));
                    }}
                    type="number"
                  />
                </div>
                <div className="form-group">
                  <label>
                    Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    value={leaveToModify.leaveTypeDescription || ''}
                    onChange={(e) => {
                      setLeaveToModify((p) => ({
                        ...p,
                        leaveTypeDescription: e.target.value,
                      }));
                    }}
                    className="form-control"
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
      {/* /Edit Designation Modal */}
      {/* Delete Designation Modal */}
      <div
        className="modal custom-modal fade"
        id="delete_designation"
        role="dialog"
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
      {/* /Delete Designation Modal */}
    </div>
  );
};

export default LeaveTypes;
