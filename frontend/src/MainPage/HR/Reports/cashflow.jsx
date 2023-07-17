import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import { Table } from 'antd';
import 'antd/dist/antd.css';

import { itemRender, onShowSizeChange } from '../../paginationfunction';
import '../../antdstyle.css';

const CashFlow = () => {
  const [data, setData] = useState([
    {
      id: 1,
      invoicenumber: 'SKW-0001',
      client: '	Sunteck Realty Ltd',
      createddate: '5',
      duedate: '500',
      amount: '2099',
      status: 'Paid',
    },
    {
      id: 2,
      invoicenumber: 'SKW-0002',
      client: 'Godrej Properties Ltd',
      createddate: '1',
      duedate: '500',
      amount: '2099',
      status: 'Sent',
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
      title: 'Cash',
      dataIndex: 'invoicenumber',
      render: (text, record) => (
        <Link to="/app/sales/invoices-view">#{text}</Link>
      ),
      sorter: (a, b) => a.invoicenumber.length - b.invoicenumber.length,
    },
    {
      title: 'Cash in Date',
      dataIndex: 'client',
      sorter: (a, b) => a.client.length - b.client.length,
    },

    {
      title: 'Cash out Date',
      dataIndex: 'createddate',
      sorter: (a, b) => a.createddate.length - b.createddate.length,
    },
    {
      title: 'Amount',
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
            {/* <a className="dropdown-item" href="#">
              <i className="fa fa-file-pdf-o m-r-5" /> Edit
            </a> */}

            <a className="dropdown-item" href="#">
              <i className="fa fa-file-pdf-o m-r-5" /> Download
            </a>
            <a className="dropdown-item" href="#">
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
        <title>Cash Flow </title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Cash Flow</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Cash Flow</li>
              </ul>
            </div>
            <div className="col-auto float-right ml-auto">
              <a
                href="#"
                className="btn add-btn"
                data-toggle="modal"
                data-target="#add_job"
              >
                <i className="fa fa-plus" /> Manage Cash Flows
              </a>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        {/* Search Filter */}
        <div className="row filter-row">
          <div className="col-sm-6 col-md-6">
            <div className="form-group form-focus select-focus">
              <div>
                <input className="form-control floating " type="text" />
              </div>
              <label className="focus-label">Total Amount Cash</label>
            </div>
          </div>

          {/* <div className="form-group form-focus select-focus">
              <div>
                <input
                  className="form-control floating datetimepicker"
                  type="date"
                />
              </div>
              <label className="focus-label"></label>
            </div> */}

          <div className="col-sm-6 col-md-3">
            <div className="form-group form-focus select-focus">
              <select className="select floating">
                <option>Select Status</option>
                <option>Pending</option>
                <option>Paid</option>
                <option>Partially Paid</option>
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

        {/* / add credit modal */}
        <div id="add_job" className="modal custom-modal fade" role="dialog">
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Cash Flow</h5>
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
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Total Amount Cash</label>
                        <input className="form-control" type="text" />
                      </div>
                    </div>
                    {/* <div className="col-md-6">
                      <div className="form-group">
                        <label>Department</label>
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
                    </div> */}
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Cash-IN Date</label>
                        <input className="form-control" type="date" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Cash-OUT Date</label>
                        <input
                          className="form-control l datetimepicker"
                          type="date"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Amount </label>
                        <input
                          className="form-control l datetimepicker"
                          type="text"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Status</label>
                        <select className="select">
                          <option>-</option>
                          <option>Paid</option>
                          <option>Not Paid</option>
                          <option>Partially paid</option>
                          {/* <option>Accounts Management</option>
                          <option>Support Management</option>
                          <option>Marketing</option> */}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Description</label>
                        <textarea className="form-control" defaultValue={''} />
                      </div>
                    </div>
                  </div>
                  <div className="submit-section">
                    <button
                      className="btn btn-primary submit-btn"
                      type="submit"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* edit credit */}
        <div id="edit_job" className="modal custom-modal fade" role="dialog">
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            role="document"
          >
            <button type="button" className="close" data-dismiss="modal">
              ×
            </button>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Job</h5>
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
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Job Title</label>
                        <input
                          className="form-control"
                          type="text"
                          defaultValue="Product Manager"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Department</label>
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
                  <div className="row">
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
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Experience</label>
                        <input
                          className="form-control"
                          type="text"
                          defaultValue="2 Years"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Age</label>
                        <input
                          className="form-control"
                          type="text"
                          defaultValue="-"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
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
                  </div>
                  <div className="row">
                    <div className="col-md-6">
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
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Status</label>
                        <select className="select">
                          <option>Open</option>
                          <option>Closed</option>
                          <option>Cancelled</option>
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
                        <label>Expired Date</label>
                        <input
                          type="text"
                          className="form-control datetimepicker"
                          defaultValue="31 May 2021"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Description</label>
                        <textarea className="form-control" defaultValue={''} />
                      </div>
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
        {/* end of edit credit modal}
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
    </div>
  );
};

export default CashFlow;
