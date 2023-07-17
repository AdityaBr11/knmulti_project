import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
// import { Avatar_03, Avatar_04 } from '../../../Entryfile/imagepath';
import { Avatar_03, Avatar_04 } from '../../Entryfile/imagepath';

import { Table } from 'antd';
import 'antd/dist/antd.css';
import { itemRender, onShowSizeChange } from '../paginationfunction';
import '../antdstyle.css';

const SkillDevelopment = () => {
  const [data, setData] = useState([
    {
      id: 1,
      image: Avatar_03,
      name: 'Prateek Tiwari',
      invoicenumber: 'INV-0001',
      skill: '	Business Management',
      startdate: '11 Mar 2021',
      duedate: '11 Mar 2021',
      status: 'Learned',
    },
    {
      id: 2,
      invoicenumber: 'INV-0002',
      image: Avatar_03,
      name: 'Prateek Tiwari',
      skill: 'Lead Generation',
      startdate: '11 Mar 2021',
      duedate: '11 Mar 2021',
      status: 'Not Started',
    },
  ]);
  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }
  });

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      sorter: (a, b) => a.id.length - b.id.length,
    },
    {
      title: 'Employee',
      dataIndex: 'name',
      render: (text, record) => (
        <h2 className="table-avatar">
          <Link to="/app/profile/employee-profile" className="avatar">
            <img alt="" src={record.image} />
          </Link>
          <Link to="/app/profile/employee-profile">
            {text} <span>{record.number}</span>
          </Link>
        </h2>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: 'Skill',
      dataIndex: 'skill',
      sorter: (a, b) => a.skill.length - b.skill.length,
    },

    {
      title: 'Starting Date',
      dataIndex: 'startdate',
      sorter: (a, b) => a.startdate.length - b.startdate.length,
    },
    {
      title: 'Due Date',
      dataIndex: 'duedate',
      sorter: (a, b) => a.duedate.length - b.duedate.length,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text, record) => (
        <span
          className={
            text === 'Paid'
              ? 'badge bg-inverse-success'
              : 'badge bg-inverse-info'
          }
        >
          {text}
        </span>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
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
              href="#"
              className="dropdown-item"
              data-toggle="modal"
              data-target="#edit_skill"
            >
              <i className="fa fa-pencil m-r-5" /> Edit
            </a>
            <a
              href="#"
              className="dropdown-item"
              data-toggle="modal"
              data-target="#delete_skill"
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
        <title>Skill Development </title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Skill Development</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Skill Development</li>
              </ul>
            </div>
            <div className="col-auto float-right ml-auto">
              <a
                href="#"
                className="btn add-btn"
                data-toggle="modal"
                data-target="#add_job"
              >
                <i className="fa fa-plus" /> Assign Skill Development
              </a>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        {/* Search Filter */}
        <div className="row filter-row">
          <div className="col-sm-6 col-md-3">
            <div className="form-group form-focus select-focus">
              <div>
                <input
                  className="form-control floating datetimepicker"
                  type="date"
                />
              </div>
              <label className="focus-label">From</label>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="form-group form-focus select-focus">
              <div>
                <input
                  className="form-control floating datetimepicker"
                  type="date"
                />
              </div>
              <label className="focus-label">To</label>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="form-group form-focus select-focus">
              <select className="select floating">
                <option>Select Status</option>
                <option>Learning</option>
                <option>Learned</option>
                <option>Not Started</option>
              </select>
              <label className="focus-label">Status</label>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <a href="#" className="btn btn-success btn-block">
              {' '}
              Search{' '}
            </a>
          </div>
        </div>
        {/* /Search Filter */}
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
      {/* Add Job Modal */}
      <div id="add_job" className="modal custom-modal fade" role="dialog">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <button type="button" className="close" data-dismiss="modal">
              ×
            </button>
            <div className="modal-header">
              <h5 className="modal-title">Add Skill Development</h5>
              {/* <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button> */}
            </div>
            <div className="modal-body">
              <form>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Employee</label>
                      <select className="select">
                        <option>-</option>
                        <option>Employee 1</option>
                        <option>Employee 2</option>
                        <option>Employee 3</option>
                        <option>Employee 4</option>
                        <option>Employee 5</option>
                        <option>Employee 6</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Skill</label>
                      <select className="select">
                        <option>-</option>
                        <option>Marketing Head</option>
                        <option>Application Development</option>
                        <option>IT Management</option>
                        <option>Accounts Management</option>
                        <option>Support Management</option>
                        <option>Marketing</option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Job Location</label>
                      <input
                        className="form-control"
                        type="text"
                        defaultValue="California"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>No of Vacancies</label>
                      <input
                        className="form-control"
                        type="text"
                        defaultValue={5}
                      />
                    </div>
                  </div>
                </div> */}
                {/* <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Salary From</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="32k"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Salary To</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="38k"
                      />
                    </div>
                  </div>
                </div> */}
                <div className="row">
                  {/* <div className="col-md-6">
                    <div className="form-group">
                      <label>Job Type</label>
                      <select className="select">
                        <option>Full Time</option>
                        <option>Part Time</option>
                        <option>Internship</option>
                        <option>Temporary</option>
                        <option>Remote</option>
                        <option>Others</option>
                      </select>
                    </div>
                  </div> */}
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Status</label>
                      <select className="select">
                        <option>-</option>
                        <option>Not Started</option>
                        <option>Learned</option>
                        <option>Learning</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Start Date</label>
                      <input
                        type="text"
                        className="form-control datetimepicker"
                        defaultValue="3 Mar 2021"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Due Date</label>
                      <input
                        type="text"
                        className="form-control datetimepicker"
                        defaultValue="31 May 2021"
                      />
                    </div>
                  </div>
                </div>
                {/* <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Description</label>
                      <textarea className="form-control" defaultValue={''} />
                    </div>
                  </div>
                </div> */}
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Job Modal */}
      {/* Edit Job Modal */}
      <div id="edit_skill" className="modal custom-modal fade" role="dialog">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <button type="button" className="close" data-dismiss="modal">
              ×
            </button>
            <div className="modal-header">
              <h5 className="modal-title">Edit Skill Development</h5>
              {/* <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button> */}
            </div>
            <div className="modal-body">
              <form>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Employee</label>
                      <select className="select">
                        <option>-</option>
                        <option>Employee 1</option>
                        <option>Employee 2</option>
                        <option>Employee 3</option>
                        <option>Employee 4</option>
                        <option>Employee 5</option>
                        <option>Employee 6</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Skill</label>
                      <select className="select">
                        <option>-</option>
                        <option>Marketing Head</option>
                        <option>Application Development</option>
                        <option>IT Management</option>
                        <option>Accounts Management</option>
                        <option>Support Management</option>
                        <option>Marketing</option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Job Location</label>
                      <input
                        className="form-control"
                        type="text"
                        defaultValue="California"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>No of Vacancies</label>
                      <input
                        className="form-control"
                        type="text"
                        defaultValue={5}
                      />
                    </div>
                  </div>
                </div> */}
                {/* <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Salary From</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="32k"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Salary To</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="38k"
                      />
                    </div>
                  </div>
                </div> */}
                <div className="row">
                  {/* <div className="col-md-6">
                    <div className="form-group">
                      <label>Job Type</label>
                      <select className="select">
                        <option>Full Time</option>
                        <option>Part Time</option>
                        <option>Internship</option>
                        <option>Temporary</option>
                        <option>Remote</option>
                        <option>Others</option>
                      </select>
                    </div>
                  </div> */}
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Status</label>
                      <select className="select">
                        <option>-</option>
                        <option>Not Started</option>
                        <option>Learned</option>
                        <option>Learning</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Start Date</label>
                      <input
                        type="text"
                        className="form-control datetimepicker"
                        defaultValue="3 Mar 2021"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Due Date</label>
                      <input
                        type="text"
                        className="form-control datetimepicker"
                        defaultValue="31 May 2021"
                      />
                    </div>
                  </div>
                </div>
                {/* <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Description</label>
                      <textarea className="form-control" defaultValue={''} />
                    </div>
                  </div>
                </div> */}
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit Job Modal */}
      {/* Delete Job Modal */}
      <div className="modal custom-modal fade" id="delete_skill" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete Assigned Skill</h3>
                <p>Are you sure want to delete?</p>
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
      {/* /Delete Job Modal */}
    </div>
  );
};

export default SkillDevelopment;
