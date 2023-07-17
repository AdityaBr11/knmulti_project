import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Avatar_04, Avatar_03, PlaceHolder } from '../../Entryfile/imagepath';

import { Table } from 'antd';
import 'antd/dist/antd.css';
import '../antdstyle.css';
import { itemRender, onShowSizeChange } from '../paginationfunction';
import { fetchInvestment } from '../../lib/api/index';
import httpService from '../../lib/httpService';

const Investments = () => {
  const [data, setData] = useState([]);
  const [investmentToAdd, setInvestmentToAdd] = useState({});
  const [investmentToEdit, setInvestmentToEdit] = useState({});

  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    const investments = await httpService.get('/investment');
    setData(
      investments.data.map((d) => ({
        ...d,
        Investmentdate: d.date.split('T')[0],
      }))
    );
  };

  const handleAdd = async () => {
    const response = await httpService.post('/investment', investmentToAdd);
    if (response.status < 400) {
      fetchInvestments();
      setInvestmentToAdd({});
      document.querySelectorAll('.close')?.forEach((e) => e.click());
    }
  };

  const handleEdit = async () => {
    const response = await httpService.put(
      `/investment/${investmentToEdit._id}`,
      investmentToEdit
    );
    if (response.status < 400) {
      fetchInvestments();
      setInvestmentToEdit({});
      document.querySelectorAll('.close')?.forEach((e) => e.click());
    }
  };

  const handleDelete = async () => {
    const response = await httpService.delete(
      `/investment/${investmentToEdit._id}`
    );
    if (response.status < 400) {
      fetchInvestments();
      setInvestmentToEdit({});
      document.querySelectorAll('.cancel-btn')?.forEach((e) => e.click());
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: 'Investment Date',
      dataIndex: 'Investmentdate',
      sorter: (a, b) => a.Investmentdate.length - b.Investmentdate.length,
    },
    {
      title: 'Commodity',
      dataIndex: 'for',
      render: (text, record) => <h2 className="table-avatar">{text}</h2>,
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      render: (text, record) => <span>₹ {text}</span>,
      sorter: (a, b) => a.amount.length - b.amount.length,
    },

    {
      title: 'Paid By',
      dataIndex: 'paidBy',
      sorter: (a, b) => a.paidby.length - b.paidby.length,
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
              data-target="#edit_expense"
              onClick={() => setInvestmentToEdit(record)}
            >
              <i className="fa fa-pencil m-r-5" /> Edit
            </a>
            <a
              className="dropdown-item"
              href="#"
              data-toggle="modal"
              data-target="#delete_expense"
              onClick={() => setInvestmentToEdit(record)}
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
        <title>Investments </title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Investments</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Investments</li>
              </ul>
            </div>
            <div className="col-auto float-right ml-auto">
              <a
                href="#"
                className="btn add-btn"
                data-toggle="modal"
                data-target="#add_expense"
              >
                <i className="fa fa-plus" /> Add Investment
              </a>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        {/* Search Filter */}
        <div className="row filter-row">
          <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
            <div className="form-group form-focus focused">
              <input type="text" className="form-control floating" />
              <label className="focus-label">Item Name</label>
            </div>
          </div>
          <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
            <div className="form-group form-focus select-focus">
              <select className="select floating">
                <option> -- Select -- </option>
                <option>Kamla Singh</option>
                <option>Tarah Shropshire</option>
              </select>
              <label className="focus-label">Investmentd To</label>
            </div>
          </div>
          <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
            <div className="form-group form-focus select-focus">
              <select className="select floating">
                <option> -- Select -- </option>
                <option> Cash </option>
                <option> Cheque </option>
              </select>
              <label className="focus-label">Paid By</label>
            </div>
          </div>
          <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
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
          <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
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
          <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
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
                dataSource={data}
                rowKey={(record) => record.id}
              />
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
      {/* Add Expense Modal */}
      <div id="add_expense" className="modal custom-modal fade" role="dialog">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Investment</h5>
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
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        onChange={(e) => {
                          setInvestmentToAdd((d) => ({
                            ...d,
                            name: e.target.value,
                          }));
                        }}
                        className="form-control"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Paid By</label>
                      <select
                        onChange={(e) => {
                          setInvestmentToAdd((d) => ({
                            ...d,
                            paidBy: e.target.value,
                          }));
                        }}
                        className="custom-select"
                      >
                        <option value={''}>Select method</option>
                        <option>Cash</option>
                        <option>Cheque</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Investment Date</label>
                      <div>
                        <input
                          onChange={(e) => {
                            setInvestmentToAdd((d) => ({
                              ...d,
                              date: e.target.value,
                            }));
                          }}
                          className="form-control"
                          type="date"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Commodity</label>
                      <input
                        placeholder="Commodity"
                        className="form-control"
                        type="text"
                        onChange={(e) => {
                          setInvestmentToAdd((d) => ({
                            ...d,
                            for: e.target.value,
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Amount</label>
                      <input
                        placeholder="₹
                        50"
                        className="form-control"
                        type="text"
                        onChange={(e) => {
                          setInvestmentToAdd((d) => ({
                            ...d,
                            amount: e.target.value,
                          }));
                        }}
                      />
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
      {/* /Add Expense Modal */}
      {/* Edit Expense Modal */}
      <div id="edit_expense" className="modal custom-modal fade" role="dialog">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Investment</h5>
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
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        defaultValue={investmentToEdit.name}
                        onChange={(e) => {
                          setInvestmentToEdit((d) => ({
                            ...d,
                            name: e.target.value,
                          }));
                        }}
                        className="form-control"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Paid By</label>
                      <select
                        defaultValue={investmentToEdit.paidBy}
                        onChange={(e) => {
                          setInvestmentToEdit((d) => ({
                            ...d,
                            paidBy: e.target.value,
                          }));
                        }}
                        className="custom-select"
                      >
                        <option>Cash</option>
                        <option>Cheque</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Investment Date</label>
                      <div>
                        <input
                          defaultValue={
                            investmentToEdit?.date
                              ? new Date(investmentToEdit.date)
                                  .toISOString()
                                  .substring(0, 10)
                              : ''
                          }
                          onChange={(e) => {
                            setInvestmentToEdit((d) => ({
                              ...d,
                              date: e.target.value,
                            }));
                          }}
                          className="form-control"
                          type="date"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Commodity</label>
                      <input
                        placeholder="Commodity"
                        className="form-control"
                        type="text"
                        defaultValue={investmentToEdit.for}
                        onChange={(e) => {
                          setInvestmentToEdit((d) => ({
                            ...d,
                            for: e.target.value,
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Amount</label>
                      <input
                        placeholder="₹50"
                        className="form-control"
                        type="text"
                        defaultValue={investmentToEdit.amount}
                        onChange={(e) => {
                          setInvestmentToEdit((d) => ({
                            ...d,
                            amount: e.target.value,
                          }));
                        }}
                      />
                    </div>
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
      {/* /Edit Expense Modal */}
      {/* Delete Expense Modal */}
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
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete();
                      }}
                      href=""
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
      {/* Delete Expense Modal */}
    </div>
  );
};

export default Investments;
