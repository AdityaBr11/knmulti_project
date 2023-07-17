import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import { Table } from 'antd';
import 'antd/dist/antd.css';
import { itemRender, onShowSizeChange } from '../paginationfunction';
import '../antdstyle.css';
import httpService from '../../lib/httpService';

const Policies = () => {
  const [data, setData] = useState([]);
  const [_data, set_data] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState([]);
  const [policyToAdd, setPolicyToAdd] = useState({});
  const [policyToEdit, setPolicyToEdit] = useState({});

  const fetchDepartments = async () => {
    const response = await httpService.get('/department');
    setDepartment(response.data);
  };

  const handleAdd = async () => {
    await httpService.post('/policy', policyToAdd);
    fetchPolicies();
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  };

  const handleDelete = async () => {
    await httpService.delete(`/policy/${policyToEdit._id}`);
    fetchPolicies();
    document.querySelectorAll('.cancel-btn')?.forEach((e) => e.click());
  };

  const handleEdit = async () => {
    await httpService.put(`/policy/${policyToEdit._id}`, policyToEdit);
    fetchPolicies();
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  };

  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }
    fetchPolicies();
    fetchDepartments();
  }, []);

  const fetchPolicies = async () => {
    const res = await httpService.get('/policy');
    const departments = await httpService.get('/department');
    setDepartments(departments.data);
    setData(
      res.data.map((data) => ({
        ...data,
        name: data.name,
        department: data.department,
      }))
    );
    console.log(res.data);
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      sorter: (a, b) => a.id.length - b.id.length,
    },
    {
      title: 'Policy Name',
      dataIndex: 'name',
      sorter: (a, b) => a.policyname.length - b.policyname.length,
    },
    {
      title: 'Department',
      dataIndex: 'departmentName',
      sorter: (a, b) => a.department.length - b.department.length,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      sorter: (a, b) => a.description.length - b.description.length,
    },
    {
      title: 'Created',
      dataIndex: 'creatat',
      sorter: (a, b) => a.creatat.length - b.creatat.length,
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
            <a className="dropdown-item" href="#">
              <i className="fa fa-download m-r-5" /> Download
            </a>
            <a
              className="dropdown-item"
              href="#"
              data-toggle="modal"
              data-target="#edit_policy"
              onClick={() => {
                setPolicyToEdit(record);
              }}
            >
              <i className="fa fa-pencil m-r-5" /> Edit
            </a>
            <a
              className="dropdown-item"
              href="#"
              data-toggle="modal"
              data-target="#delete_policy"
              onClick={() => {
                setPolicyToEdit(record);
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
        <title>Policies </title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Policies</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Policies</li>
              </ul>
            </div>
            <div className="col-auto float-right ml-auto">
              <a
                href="#"
                className="btn add-btn"
                data-toggle="modal"
                data-target="#add_policy"
              >
                <i className="fa fa-plus" /> Add Policy
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
                // onChange={this.handleTableChange}
              />
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
      {/* Add Policy Modal */}
      <div id="add_policy" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Policy</h5>
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
                    Policy Name <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    onChange={(e) =>
                      setPolicyToAdd((d) => ({ ...d, name: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>
                    Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    onChange={(e) => {
                      setPolicyToAdd((d) => ({
                        ...d,
                        description: e.target.value,
                      }));
                    }}
                    defaultValue={''}
                  />
                </div>
                <div className="form-group">
                  <label className="col-form-label">Department</label>
                  <select
                    onChange={(e) =>
                      setPolicyToAdd((d) => ({
                        ...d,
                        department: e.target.value,
                      }))
                    }
                    className="custom-select"
                  >
                    <option>All Departments</option>
                    {department.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    Upload Policy <span className="text-danger">*</span>
                  </label>
                  <div className="custom-file">
                    <input
                      type="file"
                      className="custom-file-input"
                      id="policy_upload"
                    />
                    <label
                      className="custom-file-label"
                      htmlFor="policy_upload"
                    >
                      Choose file
                    </label>
                  </div>
                </div>
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Policy Modal */}
      {/* Edit Policy Modal */}
      <div id="edit_policy" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Policy</h5>
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
                  handleEdit();
                }}
              >
                <div className="form-group">
                  <label>
                    Policy Name <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    defaultValue={policyToEdit.name}
                    onChange={(e) =>
                      setPolicyToEdit((d) => ({ ...d, name: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>
                    Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    defaultValue={policyToEdit.description}
                    onChange={(e) =>
                      setPolicyToEdit((d) => ({
                        ...d,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="col-form-label">Department</label>
                  <select
                    onChange={(e) =>
                      setPolicyToEdit((d) => ({
                        ...d,
                        department: e.target.value,
                      }))
                    }
                    className="select"
                  >
                    {department.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    Upload Policy <span className="text-danger">*</span>
                  </label>
                  <div className="custom-file">
                    <input
                      type="file"
                      className="custom-file-input"
                      id="edit_policy_upload"
                    />
                    <label
                      className="custom-file-label"
                      htmlFor="edit_policy_upload"
                    >
                      Choose file
                    </label>
                  </div>
                </div>
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit Policy Modal */}
      {/* Delete Policy Modal */}
      <div className="modal custom-modal fade" id="delete_policy" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete Policy</h3>
                <p>Are you sure want to delete?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <a
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete();
                      }}
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
      {/* /Delete Policy Modal */}
    </div>
  );
};

export default Policies;
