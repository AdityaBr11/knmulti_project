import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';
import { Table } from 'antd';
import 'antd/dist/antd.css';
import { itemRender, onShowSizeChange } from '../../paginationfunction';
import '../../antdstyle.css';
import httpService from '../../../lib/httpService';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';

function Customer() {
  const [data, setData] = useState([]);
  const [dataToRender, setDataToRender] = useState([]);
  const [customerToAdd, setCustomerToAdd] = useState({});
  const [customerToEdit, setCustomerToEdit] = useState({});
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }
    fetchCustomer();
    const routState = location.state;
    if (routState && routState.new) {
      setCustomerToAdd(routState.lead);
      location.state = {};
    }
  }, []);

  const fetchCustomer = async () => {
    const customers = await httpService.get('/customer');
    const customersArr = [...customers.data]
    setData(customers.data);
    setDataToRender(customersArr);
    setIsLoading(false);
    setTimeout(() => {
      const routState = location.state;
      if (routState && routState.new)
        document.querySelector('.add-btn')?.click();
    }, 400);
  };

  const handleAdd = async () => {
    console.log(customerToAdd);
    const customer = await httpService.post('/customer', customerToAdd);
    setData([...data, customer.data]);
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  };

  const handleEdit = async () => {
    toast
      .promise(
        httpService.put(`/customer/${customerToEdit._id}`, customerToEdit),
        {
          error: 'Customer Updated Failed',
          success: 'Customer Updated Sucessfully',
          pending: 'Upadting Customer',
        }
      )
      .then(() => {
        setData(
          data.map((customer) =>
            customer._id === customerToEdit._id ? customerToEdit : customer
          )
        );
      });
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  };

  const handleDelete = async () => {
    await httpService.delete(`/customer/${customerToEdit._id}`);
    setData(data.filter((customer) => customer._id !== customerToEdit._id));
    setDataToRender(data.filter((customer) => customer._id !== customerToEdit._id));
    document.querySelectorAll('.cancel-btn')?.forEach((e) => e.click());
  };


  const [ qName, setQName ] = useState("");
  const [ qEmail, setQEmail ] = useState("");
  const [ qCompany, setQCompany ] = useState("");

  function searchTable(data) {
    let newData = data
      .filter(row => row.displayName.toLowerCase().indexOf(qName.toLowerCase()) > -1)
      .filter(r => r.email.toLowerCase().indexOf(qEmail.toLowerCase()) > -1)
      .filter(c => (c?.companyName?.toLowerCase() || "").indexOf(qCompany.toLowerCase()) > -1);

    return newData;
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'displayName',
      render: (text, record) => (
        <h2 className="table-avatar">
          <Link
            to={`/app/profile/customer-profile/${record._id}`}
            className="avatar"
          >
            <Avatar sx={{ bgcolor: red[400] }}>
              {record?.displayName?.charAt(0).toUpperCase()}
            </Avatar>
          </Link>
          <Link to={`/app/profile/customer-profile/${record._id}`}>{text}</Link>
        </h2>
      ),
      sorter: (a, b) => a.displayName.length - b.displayName.length,
    },
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      sorter: (a, b) => a.companyName.length - b.companyName.length,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: 'Mobile',
      dataIndex: 'phone',
      // sorter: (a, b) => a.phone.length - b.phone.length,
    },
    // {
    //   title: 'Recievables',
    //   dataIndex: 'recievables',
    //   sorter: (a, b) => a.mobile.length - b.mobile.length,
    // },
    // {
    //   title: 'Used Credits',
    //   dataIndex: 'used_credits',
    //   sorter: (a, b) => a.mobile.length - b.mobile.length,
    // },
    {
      title: 'Created At',
      render: (text, record) => (
        <div>
          <span>{record?.createdAt?.split('T')[0]}</span>
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
          <Link className="dropdown-item" to={{ pathname: "/app/sales/add-customers", state: { ...record, edit: true }}}>
            <i 
              className="fa fa-pencil m-r-5"
            /> Edit
          </Link>
            <a
              className="dropdown-item"
              href="#"
              data-toggle="modal"
              data-target="#delete_client"
              onClick={(e) => {
                setCustomerToEdit(record);
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
        <title>Customers </title>
        <meta name="description" content="Customers" />
      </Helmet>
      {/* Page Content */}
      {isLoading ? (
        <div
          style={{
            height: '90vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          className="content container-fluid"
        >
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="content container-fluid">
            {/* Page Header */}
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col">
                  <h3 className="page-title">Customers</h3>
                  
                </div>
                <div className="col-auto float-right ml-auto">
                  <Link
                    to={`/app/sales/add-customers`}
                  >
                    <a
                      href="#"
                      className="btn add-btn"
                      // data-toggle="modal"
                      // data-target="#add_client"
                    >
                      <i className="fa fa-plus" /> Add Customer
                    </a>                  
                  </Link>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            {/* Search Filter */}
            <div className="row filter-row">
              <div className="col-sm-6 col-md-4">
                <div className="form-group form-focus focused">
                  <input
                    type="text"
                    placeholder="Customer Name"
                    className="form-control"
                    style={{
                      padding: '10px',
                    }}
                    value={qName}
                    onChange={(e) => setQName(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-sm-6 col-md-4">
                <div className="form-group form-focus focused">
                  <input
                    type="text"
                    placeholder="Customer Company"
                    className="form-control"
                    style={{
                      padding: '10px',
                    }}
                    value={qCompany}
                    onChange={(e) => setQCompany(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-sm-6 col-md-4">
                <div className="form-group form-focus focused">
                  <input
                    type="text"
                    placeholder="Customer Email"
                    className="form-control"
                    style={{
                      padding: '10px',
                    }}
                    value={qEmail}
                  onChange={(e) => setQEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {/* Search Filter */}
            <div className="row">
              <div className="col-md-12">
                <div className="table-responsive">
                  <Table
                    className="table-striped"
                    pagination={{
                      total: dataToRender.length,
                      showTotal: (total, range) =>
                        `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                      showSizeChanger: true,
                      onShowSizeChange: onShowSizeChange,
                      itemRender: itemRender,
                    }}
                    style={{ overflowX: 'auto' }}
                    columns={columns}
                    // bordered
                    dataSource={searchTable(dataToRender)}
                    rowKey={(record) => record._id}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/* /Page Content */}
      {/* Add Customer Modal */}
      <div id="add_client" className="modal custom-modal fade" role="dialog">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Customer</h5>
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
                onSubmit={async (e) => {
                  e.preventDefault();
                  await handleAdd();
                  e.target.reset();
                }}
              >
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Name <span className="text-danger">*</span>
                      </label>
                      <input
                        defaultValue={customerToAdd.name}
                        onChange={(e) => {
                          setCustomerToAdd({
                            ...customerToAdd,
                            name: e.target.value,
                          });
                          console.log(customerToAdd);
                        }}
                        className="form-control"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="col-form-label">Phone </label>
                      <input
                        defaultValue={customerToAdd.phone}
                        onChange={(e) => {
                          setCustomerToAdd({
                            ...customerToAdd,
                            phone: e.target.value,
                          });
                        }}
                        className="form-control"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        defaultValue={customerToAdd.email}
                        onChange={(e) => {
                          setCustomerToAdd({
                            ...customerToAdd,
                            email: e.target.value,
                          });
                        }}
                        className="form-control floating"
                        type="email"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="col-form-label">Comapny</label>
                      <input
                        onChange={(e) => {
                          setCustomerToAdd({
                            ...customerToAdd,
                            company: e.target.value,
                          });
                        }}
                        className="form-control"
                        type="text"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="form-group">
                    <label>Address</label>
                    <textarea
                      defaultValue={customerToAdd.address}
                      onChange={(e) => {
                        setCustomerToAdd({
                          ...customerToAdd,
                          address: e.target.value,
                        });
                      }}
                      className="form-control"
                      rows={4}
                    />
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
      {/* /Add Client Modal */}
      {/* Edit Client Modal */}
      <div id="edit_client" className="modal custom-modal fade" role="dialog">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Customer</h5>
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
                      <label className="col-form-label">
                        Name <span className="text-danger">*</span>
                      </label>
                      <input
                        defaultValue={customerToEdit.name}
                        onChange={(e) => {
                          setCustomerToEdit({
                            ...customerToEdit,
                            name: e.target.value,
                          });
                        }}
                        className="form-control"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="col-form-label">Phone </label>
                      <input
                        defaultValue={customerToEdit.phone}
                        onChange={(e) => {
                          setCustomerToEdit({
                            ...customerToEdit,
                            phone: e.target.value,
                          });
                        }}
                        className="form-control"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        defaultValue={customerToEdit.email}
                        onChange={(e) => {
                          setCustomerToEdit({
                            ...customerToEdit,
                            email: e.target.value,
                          });
                        }}
                        className="form-control floating"
                        type="email"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="col-form-label">Company</label>
                      <input
                        defaultValue={customerToEdit.company}
                        onChange={(e) => {
                          setCustomerToEdit({
                            ...customerToEdit,
                            company: e.target.value,
                          });
                        }}
                        className="form-control"
                        type="text"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="form-group">
                    <label>Address</label>
                    <textarea
                      defaultValue={customerToEdit.address}
                      onChange={(e) => {
                        setCustomerToEdit({
                          ...customerToEdit,
                          address: e.target.value,
                        });
                      }}
                      className="form-control"
                      rows={4}
                    />
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
      {/* /Edit Client Modal */}
      {/* Delete Client Modal */}
      <div className="modal custom-modal fade" id="delete_client" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete Client</h3>
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
      {/* /Delete Client Modal */}
    </div>
  );
}

export default Customer;
