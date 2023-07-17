/**
 * Signin Firebase
 */

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Table } from 'antd';
import 'antd/dist/antd.css';
import { itemRender, onShowSizeChange } from '../../paginationfunction';
import '../../antdstyle.css';
import {
  addEmployeeType,
  deleteEmployeeType,
  editEmployeeType,
  fetchEmployeeTypes,
} from '../../../lib/api';

const EmployeeType = () => {
  const [data, setData] = useState([]);
  const [addLeave, setAddLeave] = useState({
    employeeTypeName: '',
    employeeTypeDescription: '',
    noOfLeaves: null,
  });
  const [editLeave, setEditLeave] = useState(null);
  const [deleteLeave, setDeleteLeave] = useState(null);

console.log(data,'data../');

  useEffect(async () => {
    const res = await fetchEmployeeTypes();
    setData(res.map((lt, index) => ({ ...lt, id: index + 1 })));
  }, []);

  const handleAddLeave = async (e) => {
    console.log('cliked to add new type');
    // e.preventDefault();
    if (
      addLeave.employeeTypeName === '' ||
      addLeave.employeeTypeDescription === '' ||
      !addLeave.noOfLeaves
    )
      return null;
    const res = await addEmployeeType(addLeave);
    setData([...data, { ...res, id: data.length + 1 }]);
  };

  const handleEditLeave = async (e) => {
    // e.preventDefault();
    if (
      editLeave.employeeTypeName === '' ||
      editLeave.employeeTypeDescription === '' ||
      !editLeave.noOfLeaves
    )
      return null;
    const res = await editEmployeeType(editLeave._id, editLeave);
    // setData([...data, { ...res, id: data.length + 1 }]);
  };

  const handleDeleteLeave = async (e) => {
    // e.preventDefault();
    if (!deleteLeave) return null;
    const res = await deleteEmployeeType(deleteLeave?._id);
  };

  const columns = [
    {
      title: '#',
      render: (text, record) => <div>{record?.id}</div>,
    },
    {
      title: 'Employee Type',
      dataIndex: 'employeeTypeName',
      sorter: (a, b) => a.leavetype.length - b.leavetype.length,
    },

    {
      title: 'Description',
      dataIndex: 'employeeTypeDescription',
      render: (text, record) => (
        <div>{String(text).substring(0, 60) + '...'}</div>
      ),
      sorter: (a, b) => a.leavedays.length - b.leavedays.length,
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
              data-target="#edit_leavetype"
              onClick={() => setEditLeave(record)}
            >
              <i className="fa fa-pencil m-r-5" /> Edit
            </a>
            <a
              className="dropdown-item"
              href="#"
              data-toggle="modal"
              data-target="#delete_leavetype"
              onClick={() => setDeleteLeave(record)}
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
        <title>Leave Type </title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Employee Type</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Employee Type</li>
              </ul>
            </div>
            <div className="col-auto float-right ml-auto">
              <a
                href="#"
                className="btn add-btn"
                data-toggle="modal"
                data-target="#add_leavetype"
              >
                <i className="fa fa-plus" /> Add Employee Type
              </a>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive">
              <Table
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
                bordered
                dataSource={data}
                rowKey={(record) => record._id}
                // onChange={this.handleTableChange}
              />
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
      {/* Add Leavetype Modal */}
      <div id="add_leavetype" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Employee Type</h5>
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
                    Employee Type <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    onChange={(e) =>
                      setAddLeave({
                        ...addLeave,
                        employeeTypeName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>
                    Employee Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={3}
                    onChange={(e) =>
                      setAddLeave({
                        ...addLeave,
                        employeeTypeDescription: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>
                    Number of leaves <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    onChange={(e) =>
                      setAddLeave({
                        ...addLeave,
                        noOfLeaves: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    onClick={handleAddLeave}
                    data-dismiss="modal"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Leavetype Modal */}
      {/* Edit Leavetype Modal */}
      <div
        id="edit_leavetype"
        className="modal custom-modal fade"
        role="dialog"
        data-backdrop="static"
        data-keyboard={false}
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
                onClick={() => setEditLeave(null)}
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
                  <input
                    className="form-control"
                    type="text"
                    onChange={(e) =>
                      setEditLeave({
                        ...editLeave,
                        employeeTypeName: e.target.value,
                      })
                    }
                    defaultValue={editLeave?.leaveTypeName}
                  />
                </div>
                <div className="form-group">
                  <label>
                    Leave Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={3}
                    onChange={(e) =>
                      setEditLeave({
                        ...editLeave,
                        employeeTypeDescription: e.target.value,
                      })
                    }
                    defaultValue={editLeave?.leaveTypeDescription}
                  />
                </div>
                <div className="form-group">
                  <label>
                    Number of leaves <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    onChange={(e) =>
                      setEditLeave({
                        ...editLeave,
                        noOfLeaves: Number(e.target.value),
                      })
                    }
                    defaultValue={editLeave?.noOfLeaves}
                  />
                </div>
                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    onClick={handleEditLeave}
                    data-dismiss="modal"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit Leavetype Modal */}
      {/* Delete Leavetype Modal */}
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
                      onClick={handleDeleteLeave}
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
                      onClick={() => setDeleteLeave(null)}
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
      {/* /Delete Leavetype Modal */}
    </div>
  );
};

export default EmployeeType;
