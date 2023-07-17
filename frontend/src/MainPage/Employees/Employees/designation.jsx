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
import { AUTHORITIES } from '../../../model/shared/authorities';

const Designations = () => {
  const [data, setData] = useState([]);
  const [designationToModify, setDesignationToModify] = useState('');
  const [designationToAdd, setDesignationToAdd] = useState('');
  const [departmentToAdd, setDepartmentToAdd] = useState('');
  const [authoritiesToAdd, setAuthoritiesToAdd] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }
    async function fetchData() {
      const res = await httpService.get('/role');
      const departments = await httpService.get('/department');
      setDepartments(departments.data);
      setData(
        res.data.map((item, i) => ({
          ...item,
          id: i + 1,
          departmentName: item.department.name,
          designation: item.name || 'Placeholder',
        }))
      );
    }
    fetchData();
  }, []);

  const handleDelete = async () => {
    await httpService.delete(`/role/${designationToModify._id}`);
    const itemIndex = data.findIndex((d) => d._id === designationToModify._id);
    setData((d) =>
      d
        .filter((item, i) => i !== itemIndex)
        .map((item, i) => ({ ...item, id: i + 1 }))
    );
    document.querySelectorAll('.cancel-btn')?.forEach((e) => e.click());
  };

  const handleEdit = async () => {
    await httpService.put(
      `/role/${designationToModify._id}`,
      designationToModify
    );
    const itemIndex = data.findIndex((d) => d._id === designationToModify._id);
    setData((d) => [
      ...d.slice(0, itemIndex),
      { ...designationToModify, designation: designationToModify.name },
      ...d.slice(itemIndex + 1),
    ]);
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  };

  const handleAdd = async () => {
    if (designationToAdd.length <= 0) return;
    const res = await httpService.post('/role', {
      name: designationToAdd,
      department: departmentToAdd,
      authorities: authoritiesToAdd,
      description: 'description',
    });
    setData((d) => [
      ...d,
      {
        id: d.length + 1,
        departmentName: departments.find((d) => d._id === departmentToAdd).name,
        designation: res.data.name,
      },
    ]);
    setAuthoritiesToAdd([]);
    setDesignationToAdd('');
    document.querySelectorAll('form').forEach((form) => form.reset());
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      sorter: (a, b) => a.id.length - b.id.length,
    },
    {
      title: 'Department',
      dataIndex: 'departmentName',
      sorter: (a, b) => a.department.length - b.department.length,
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      sorter: (a, b) => a.designation.length - b.designation.length,
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
                setDesignationToModify(record);
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
                setDesignationToModify(record);
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
        <title>Designations </title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Designations</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Designations</li>
              </ul>
            </div>
            <div className="col-auto float-right ml-auto">
              <a
                href="#"
                className="btn add-btn"
                data-toggle="modal"
                data-target="#add_designation"
              >
                <i className="fa fa-plus" /> Add Designation
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
                onChange={console.log}
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
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Designation</h5>
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
                    Designation Name <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    value={designationToAdd}
                    onChange={(e) => {
                      setDesignationToAdd(e.target.value);
                    }}
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <label>
                    Department <span className="text-danger">*</span>
                  </label>
                  <select
                    onChange={(e) => setDepartmentToAdd(e.target.value)}
                    style={{
                      width: '100%',
                      borderColor: '#e3e3e3',
                      boxShadow: 'none',
                      fontSize: '15px',
                      height: '44px',
                    }}
                  >
                    <option value={''}>Select Department</option>
                    {departments.map((department) => (
                      <option value={department._id}>{department.name}</option>
                    ))}
                  </select>
                </div>
                <div className="table-responsive m-t-15">
                  <table className="table table-striped custom-table">
                    <thead>
                      <tr>
                        <th>Module Permission</th>
                        <th className="text-center">Read</th>
                        <th className="text-center">Create</th>
                        <th className="text-center">Write</th>
                        <th className="text-center">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(AUTHORITIES).map((key) => (
                        <tr key={key}>
                          <td>{key}</td>
                          {AUTHORITIES[key].map((authority) => (
                            <td className="text-center">
                              <input
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setAuthoritiesToAdd((a) => [
                                      key + '_' + authority,
                                      ...a,
                                    ]);
                                  } else {
                                    setAuthoritiesToAdd((a) =>
                                      a.filter(
                                        (a) => a !== key + '_' + authority
                                      )
                                    );
                                  }
                                }}
                                type="checkbox"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Designation</h5>
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
                    Designation Name <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    defaultValue={designationToModify?.name || ''}
                    type="text"
                    onChange={(e) => {
                      setDesignationToModify({
                        ...designationToModify,
                        name: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="table-responsive m-t-15">
                  <table className="table table-striped custom-table">
                    <thead>
                      <tr>
                        <th>Module Permission</th>
                        <th className="text-center">Read</th>
                        <th className="text-center">Create</th>
                        <th className="text-center">Update</th>
                        <th className="text-center">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(AUTHORITIES).map((key) => (
                        <tr key={key}>
                          <td>{key}</td>
                          {AUTHORITIES[key].map((authority, i) => (
                            <td key={i} className="text-center">
                              <input
                                defaultChecked={designationToModify.authorities?.includes(
                                  key + '_' + authority
                                )}
                                onClick={(e) => {
                                  if (e.target.checked) {
                                    designationToModify.authorities?.push(
                                      key + '_' + authority
                                    );
                                  } else {
                                    console.log('here');
                                    designationToModify.authorities =
                                      designationToModify.authorities?.filter(
                                        (a) => a !== key + '_' + authority
                                      );
                                  }
                                }}
                                type="checkbox"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                <h3>Delete Designation</h3>
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

export default Designations;
