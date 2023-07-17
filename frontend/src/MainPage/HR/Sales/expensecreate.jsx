import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useHistory } from 'react-router-dom';
import httpService from '../../../lib/httpService';

const ExpenseCreate = () => {
  const [customers, setCustomers] = useState([]);
  const [invoiceType, setInvoiceType] = useState('');
  const [itemsToAdd, setItemsToAdd] = useState([
    {
      item: '',
      description: '',
      unitCost: 0,
      quantity: 0,
      amount: 0,
    },
  ]);
  const [invoiceToAdd, setInvoiceToAdd] = useState({});
  const history = useHistory();

  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const customers = await httpService.get('/vendor');
    setCustomers(customers.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await httpService.post('/expense', {
      ...invoiceToAdd,
      type: invoiceType,
      items: itemsToAdd,
      total: itemsToAdd.reduce((acc, cur) => acc + cur.amount, 0),
    });
    history.goBack();
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Add Expense </title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col-sm-12">
              <h3 className="page-title">Add Expense</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Create Expense</li>
              </ul>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        <div className="row">
          <div className="col-sm-12">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-sm-6 col-md-4">
                  <div className="form-group">
                    <label>
                      Customer <span className="text-danger">*</span>
                    </label>
                    <select
                      onChange={(e) => {
                        setInvoiceToAdd({
                          ...invoiceToAdd,
                          vendor: e.target.value,
                        });
                      }}
                      className="custom-select"
                    >
                      <option selected>Please Select</option>
                      {customers.map((customer) => (
                        <option key={customer._id} value={customer._id}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-sm-6 col-md-4">
                  <div className="form-group">
                    <label>
                      Expense date <span className="text-danger">*</span>
                    </label>
                    <div>
                      <input
                        onChange={(e) => {
                          setInvoiceToAdd({
                            ...invoiceToAdd,
                            expenseDate: e.target.value,
                          });
                        }}
                        className="form-control"
                        type="date"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-md-4">
                  <div className="form-group">
                    <label>
                      Due Date <span className="text-danger">*</span>
                    </label>
                    <div>
                      <input
                        className="form-control"
                        type="date"
                        onChange={(e) => {
                          setInvoiceToAdd({
                            ...invoiceToAdd,
                            dueDate: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 col-sm-12">
                  <div className="table-responsive">
                    <table className="table table-hover table-white">
                      <thead>
                        <tr>
                          <th style={{ width: '20px' }}>#</th>
                          <th className="col-sm-2">Item</th>
                          <th className="col-md-6">Description</th>
                          <th style={{ width: '100px' }}>Unit Cost</th>
                          <th style={{ width: '80px' }}>Qty</th>
                          <th>Amount</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itemsToAdd.map((item, index) => (
                          <tr>
                            <td>{index + 1}</td>
                            <td>
                              <input
                                onChange={(e) => {
                                  const items = itemsToAdd.map((item, i) => {
                                    if (index === i) {
                                      item.item = e.target.value;
                                    }
                                    return item;
                                  });
                                  setItemsToAdd(items);
                                }}
                                className="form-control"
                                type="text"
                                style={{ minWidth: '150px' }}
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="text"
                                style={{ minWidth: '150px' }}
                                onChange={(e) => {
                                  const items = itemsToAdd.map((item, i) => {
                                    if (index === i) {
                                      item.description = e.target.value;
                                    }
                                    return item;
                                  });
                                  setItemsToAdd(items);
                                }}
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                style={{ width: '100px' }}
                                type="text"
                                onChange={(e) => {
                                  const items = itemsToAdd.map((item, i) => {
                                    if (index === i) {
                                      item.unitCost = e.target.value;
                                      item.amount =
                                        e.target.value * item.quantity;
                                    }
                                    return item;
                                  });

                                  setItemsToAdd(items);
                                }}
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                style={{ width: '80px' }}
                                type="text"
                                onChange={(e) => {
                                  const items = itemsToAdd.map((item, i) => {
                                    if (index === i) {
                                      item.quantity = e.target.value;
                                      item.amount =
                                        e.target.value * item.unitCost;
                                    }
                                    return item;
                                  });

                                  setItemsToAdd(items);
                                }}
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                readOnly
                                style={{ width: '120px' }}
                                type="text"
                                value={item.amount}
                              />
                            </td>
                            <td>
                              <a
                                href="javascript:void(0)"
                                className={`${
                                  index + 1 !== itemsToAdd.length
                                    ? 'text-danger'
                                    : 'text-success'
                                } font-18`}
                                title="Add"
                                onClick={() => {
                                  if (index + 1 !== itemsToAdd.length) {
                                    setItemsToAdd((d) =>
                                      d.filter((_, i) => i !== index)
                                    );
                                    return;
                                  }
                                  setItemsToAdd([
                                    ...itemsToAdd,
                                    {
                                      item: '',
                                      description: '',
                                      unitCost: 0,
                                      quantity: 0,
                                      amount: 0,
                                    },
                                  ]);
                                }}
                              >
                                {index + 1 === itemsToAdd.length ? (
                                  <i className="fa fa-plus" />
                                ) : (
                                  <i className="fa fa-trash-o" />
                                )}
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover table-white">
                      <tbody>
                        <tr>
                          <td />
                          <td />
                          <td />
                          <td />
                          <td className="text-right">Total</td>
                          <td
                            style={{
                              textAlign: 'right',
                              paddingRight: '30px',
                              width: '230px',
                            }}
                          >
                            {itemsToAdd.reduce((p, c) => p + c.amount, 0)}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={5} className="text-right">
                            Tax
                          </td>
                          <td
                            style={{
                              textAlign: 'right',
                              paddingRight: '30px',
                              width: '230px',
                            }}
                          >
                            <input
                              className="form-control text-right"
                              defaultValue={0}
                              readOnly
                              type="text"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={5} className="text-right">
                            Discount %
                          </td>
                          <td
                            style={{
                              textAlign: 'right',
                              paddingRight: '30px',
                              width: '230px',
                            }}
                          >
                            <input
                              className="form-control text-right"
                              type="text"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td
                            colSpan={5}
                            style={{ textAlign: 'right', fontWeight: 'bold' }}
                          >
                            Grand Total
                          </td>
                          <td
                            style={{
                              textAlign: 'right',
                              paddingRight: '30px',
                              fontWeight: 'bold',
                              fontSize: '16px',
                              width: '230px',
                            }}
                          >
                            ₹ {itemsToAdd.reduce((p, c) => p + c.amount, 0)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Other Information</label>
                        <textarea
                          onChange={(e) => {
                            setInvoiceToAdd({
                              ...invoiceToAdd,
                              otherInformation: e.target.value,
                            });
                          }}
                          className="form-control"
                          defaultValue={''}
                        />
                      </div>
                    </div>
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
      {/* /Page Content */}
    </div>
  );
};

export default ExpenseCreate;
