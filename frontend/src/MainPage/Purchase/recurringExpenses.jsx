import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import { Table } from 'antd';
import 'antd/dist/antd.css';
import { itemRender, onShowSizeChange } from '../paginationfunction';
import '../antdstyle.css';

const RecurringExpenses = () => {
  const [data, setData] = useState([
    {
      id: 1,
      invoicenumber: 'INV-0001',
      client: '	Sunteck Realty Ltd',
      createddate: '11 Mar 2021',
      duedate: '11 Mar 2021',
      amount: '2099',
      status: 'Paid',
    },
    {
      id: 2,
      invoicenumber: 'INV-0002',
      client: 'Godrej Properties Ltd',
      createddate: '11 Mar 2021',
      duedate: '11 Mar 2021',
      amount: '2099',
      status: 'Partially Paid',
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
      title: 'Invoice Number',
      dataIndex: 'invoicenumber',
      render: (text, record) => (
        <Link to="/app/sales/invoices-view">#{text}</Link>
      ),
      sorter: (a, b) => a.invoicenumber.length - b.invoicenumber.length,
    },
    {
      title: 'Client',
      dataIndex: 'client',
      sorter: (a, b) => a.client.length - b.client.length,
    },

    {
      title: 'Created Date',
      dataIndex: 'createddate',
      sorter: (a, b) => a.createddate.length - b.createddate.length,
    },
    {
      title: 'Due Date',
      dataIndex: 'duedate',
      sorter: (a, b) => a.duedate.length - b.duedate.length,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      render: (text, record) => <span>₹ {text}</span>,
      sorter: (a, b) => a.amount.length - b.amount.length,
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
              data-target="#edit_expense"
            >
              <i className="fa fa-pencil m-r-5" /> Edit
            </a>
            <a className="dropdown-item" href="#">
              <i className="fa fa-file-pdf-o m-r-5" /> Download
            </a>
            <a
              href="#"
              className="dropdown-item"
              data-toggle="modal"
              data-target="#delete_expense"
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
        <title>Recurring Expenses </title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Recurring Expenses</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Recurring Expenses</li>
              </ul>
            </div>
            <div className="col-auto float-right ml-auto">
              <a
                href="#"
                className="btn add-btn"
                data-toggle="modal"
                data-target="#add_expense"
              >
                <i className="fa fa-plus" /> Add Recurring Expense
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
      <div id="add_expense" className="modal custom-modal fade" role="dialog">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Recurring Expense</h5>
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
                      <label>Invoice Number</label>
                      <input className="form-control" type="text" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    {/* <div className="form-group">
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
                    </div> */}
                    <div className="form-group">
                      <label>Client</label>
                      <input className="form-control" type="text" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Amount Sent</label>
                      <input className="form-control" type="text" />
                    </div>
                  </div>
                  {/* <div className="col-md-6">
                    <div className="form-group">
                      <label>Age</label>
                      <input className="form-control" type="text" />
                    </div>
                  </div> */}
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Sent From</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Sent To</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Payment Mode</label>
                      <select className="select">
                        <option>Online</option>
                        <option>Net Banking</option>
                        <option>Cash</option>
                        <option>Cheque</option>
                        <option>Demand Draft</option>
                        <option>Others</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Status</label>
                      <select className="select">
                        <option>Partially Paid</option>
                        <option>Paid</option>
                        <option>Pending</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Payment Start Date</label>
                      <input
                        type="text"
                        className="form-control datetimepicker"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Payment Processed Date</label>
                      <input
                        type="text"
                        className="form-control datetimepicker"
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
                  <button className="btn btn-primary submit-btn" type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Job Modal */}
      {/* Edit Job Modal */}
      <div id="edit_expense" className="modal custom-modal fade" role="dialog">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Expense</h5>
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
                      <label>Invoice Number</label>
                      <input className="form-control" type="text" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    {/* <div className="form-group">
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
                    </div> */}
                    <div className="form-group">
                      <label>Client</label>
                      <input className="form-control" type="text" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Amount Sent</label>
                      <input className="form-control" type="text" />
                    </div>
                  </div>
                  {/* <div className="col-md-6">
                    <div className="form-group">
                      <label>Age</label>
                      <input className="form-control" type="text" />
                    </div>
                  </div> */}
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Sent From</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Sent To</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Payment Mode</label>
                      <select className="select">
                        <option>Online</option>
                        <option>Net Banking</option>
                        <option>Cash</option>
                        <option>Cheque</option>
                        <option>Demand Draft</option>
                        <option>Others</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Status</label>
                      <select className="select">
                        <option>Partially Paid</option>
                        <option>Paid</option>
                        <option>Pending</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Payment Start Date</label>
                      <input
                        type="text"
                        className="form-control datetimepicker"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Payment Processed Date</label>
                      <input
                        type="text"
                        className="form-control datetimepicker"
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
                  <button className="btn btn-primary submit-btn" type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit Job Modal */}
      {/* Delete Job Modal */}
      <div
        className="modal custom-modal fade"
        id="delete_expense"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete Expense</h3>
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

export default RecurringExpenses;
