import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Table } from 'antd';
import 'antd/dist/antd.css';
import { itemRender, onShowSizeChange } from '../paginationfunction';
import '../antdstyle.css';
import httpService from '../../lib/httpService';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';
import AddVendorModel from './AddVendorModel';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
// import { icon11 } from 'https://ibb.co/yf8BkkR';

function Vendor() {
  const [data, setData] = useState([]);
  const [vendorToAdd, setVendorToAdd] = useState({});
  const [vendorToEdit, setVendorToEdit] = useState({});
  const [ vendorEdit, setvendorEdit ] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [ qName, setQName ] = useState("");
  const [ qEmail, setQEmail ] = useState("");
  const [ qCompany, setQCompany ] = useState("");
  const [ qtype, setqtype ] = useState("");

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    const res = await httpService.get('/vendor').then((res) => res.data);
    setData(
      res.reverse().map((item) => ({
        ...item,
        date: item?.createdAt?.split('T')[0],
        // date: item?.createdAt,
      }))
    );
    setIsLoading(false);
  };
  useEffect(() => {
    if ($('.select')?.length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }
    fetchVendors();
  }, []);


  function searchTable(data) {
    let newData = data
      .filter(row => row.name.toLowerCase().indexOf(qName.toLowerCase()) > -1)
      .filter(r => r.email.toLowerCase().indexOf(qEmail.toLowerCase()) > -1)
      .filter(c => c.company.toLowerCase().indexOf(qCompany.toLowerCase()) > -1);

    if(qtype){
      newData = newData.filter(s => s.vendorType?.toLowerCase()?.indexOf(qtype?.toLowerCase()) > -1);
    }
    return newData;
  }

  const addVendor = async () => {
    toast
      .promise(
        httpService.post('/vendor', {
          ...vendorToAdd,
        }),
        {
          error: 'Failed to add vendor',
          success: 'Vendor added successfully',
          pending: 'Adding vendor',
        }
      )
      .then(() => fetchVendors());
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  };

  const editVendor = async () => {
    toast
      .promise(
        httpService.put(`/vendor/${vendorToEdit._id}`, {
          ...vendorToEdit,
        }),
        {
          error: 'Failed to edit vendor',
          success: 'Vendor edited successfully',
          pending: 'Editing vendor',
        }
      )
      .then(() => fetchVendors());
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  };

  const deleteVendor = async () => {
    toast
      .promise(httpService.delete(`/vendor/${vendorToEdit._id}`), {
        success: 'Vendor deleted successfully',
        pending: 'Deleting vendor',
      })
      .then(() => fetchVendors());
    document.querySelectorAll('.cancel-btn')?.forEach((e) => e.click());
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      // align: 'center',
      render: (text, record) => (
        <h2 className="table-avatar">
          <Link to="/app/profile/employee-profile" className="avatar">
            <div
              style={{
                width: '100%',
                height: '100%',
                background: '#E33F3B',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '1.2rem',
                color: '#fff',
              }}
            >
              {record.name?.split(' ')[0].charAt(0)}
            </div>
          </Link>
          <Link to={`/app/profile/vendor-profile/${record._id}`}>{text}</Link>
        </h2>
      ),
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: 'Company',
      align: 'center',
      dataIndex: 'company',
    },
    {
      title: 'Email',
      align: 'center',
      dataIndex: 'email',
    },

    {
      title: 'Mobile',
      align: 'center',
      dataIndex: 'phone',
      // sorter: (a, b) => a.mobile.length - b.mobile.length,
    },
    // {
    //   title: 'Type',
    //   align: 'center',
    //   dataIndex: 'vendorType',
    //   // sorter: (vendorType) => <h1>{vendorType}</h1>,
    // },
    {
      title: 'Type',
      dataIndex: 'vendorType',
      // align: 'center',
      render: (text, record) => (
        <h2 className="table-avatar">
          {text == 	'landowner' ? <span className="">
            {/* <i className="fa fa-truck" /> */}
            <img src="https://byw10.agumentikgroup.com/images/house-owner.png"
       width="40" height="30" alt='aaa' />
          </span> :""}
          {text == 	'agent' ? <span className="">
           
            
            <img src="https://byw10.agumentikgroup.com/images/agent.png"
       width="40" height="30" alt='aaa' />
          </span> :""}
          {text == 	'supplier' ? 
          <span className="">
            {/* <i className="fa fa-truck" /> */}
            <img src="https://byw10.agumentikgroup.com/images/hotel-supplier.png"
       width="40" height="30" alt='aaa' />
          </span> :
          <span  >
           </span>}
          {/* {text} */}
        </h2>
      ),
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    // {
    //   title: 'Action',
    //   align: 'center',
    //   render: (text, record) => (
    //     <a
    //       className=""
    //       href="#"
    //       data-toggle="modal"
    //       data-target="#delete_client"
    //       onClick={() => {
    //         setVendorToEdit(record);
    //       }}
    //     >
    //       <DeleteForeverIcon />
    //     </a>
        
    //   ),
    // },
  ];

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Vendors </title>
        <meta name="description" content="Login page" />
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
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row align-items-center">
              <div className="col">
                <h3 className="page-title">Vendors</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/app/main/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Vendors</li>
                </ul>
              </div>
              <div className="col-auto float-right ml-auto">
                <Link
                  to="/app/purchase/addvendor"
                  className="btn add-btn"
                >
                  <i className="fa fa-plus" /> Add Vendor
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Search Filter */}
          <div className="row filter-row justify-content-between">
            <div className="col-sm-6 col-md-4">
              <div className="form-group form-focus focused">
                <input
                  type="text"
                  style={{
                    padding: '10px',
                  }}
                  placeholder={'Search by Vendor Name'}
                  className="form-control"
                  value={qName}
                  onChange={(e) => setQName(e.target.value)}
                />
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="form-group form-focus focused">
                <input
                  type="text"
                  style={{
                    padding: '8px',
                  }}
                  placeholder={'Search by Vendor Company'}
                  className="form-control"
                  value={qCompany}
                  onChange={(e) => setQCompany(e.target.value)}
                />
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="form-group form-focus focused">
                <input
                  type="email"
                  style={{
                    padding: '10px',
                  }}
                  placeholder={'Search by Vendor Email'}
                  className="form-control"
                  value={qEmail}
                  onChange={(e) => setQEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="col-sm-3 col-md-2">
              <div className="form-group form-focus focused">
                <select
                  className="custom-select form-control floating"
                  name=""
                  value={qtype}
                  onChange={(e) => setqtype(e.target.value)}
                >
                  <option value={""} selected>Choose Type</option>
                  <option value="supplier">Supplier</option>
                  <option value="landowner">Landowner</option>
                  <option value="agent">Agent</option>
                </select>
                <label className="focus-label">Type</label>
              </div>
            </div>
            
            {/* <div className="col-sm-6 col-md-3" style={{ visibility: "hidden" }}>
              <a href="#" className="btn btn-success btn-block">
                {' '}
                Search{' '}
              </a>
            </div> */}
          </div>
          {/* Search Filter */}
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <Table
                  className="table-striped"
                  pagination={{
                    total: data?.length,
                    showTotal: (total, range) =>
                      `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                    showSizeChanger: true,
                    onShowSizeChange: onShowSizeChange,
                    itemRender: itemRender,
                  }}
                  style={{ overflowX: 'auto' }}
                  columns={columns}
                  // bordered
                  dataSource={searchTable(data)}
                  rowKey={(record) => record.id}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* /Page Content */}
      {/* Add Vendor Modal */}
      <AddVendorModel fetchVendors={fetchVendors} />
      {/* <AddVendorModel fetchVendors={fetchVendors} editForm={true}  editVendorId={id} /> */}

      {/* /Add Client Modal */}
      {/* Edit Client Modal */}
      {/* <div id="edit_vendor" className="modal custom-modal fade" role="dialog">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Vendor</h5>
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
                  editVendor();
                }}
              >
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Name <span className="text-danger">*</span>
                      </label>
                      <input
                        defaultValue={vendorToEdit.name}
                        className="form-control"
                        type="text"
                        value={vendorToEdit.name}
                        onChange={(event) =>
                          setVendorToEdit({
                            ...vendorToEdit,
                            company: event.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="col-form-label">Phone </label>
                      <input
                        defaultValue={vendorToEdit.phone}
                        className="form-control"
                        type="text"
                        value={vendorToEdit.phone}
                        onChange={(event) =>
                          setVendorToEdit({
                            ...vendorToEdit,
                            phone: event.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        defaultValue={vendorToEdit.email}
                        className="form-control floating"
                        type="email"
                        value={vendorToEdit.email}
                        onChange={(event) =>
                          setVendorToEdit({
                            ...vendorToEdit,
                            email: event.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="col-form-label">Comapny</label>
                      <input
                        defaultValue={vendorToEdit.company}
                        className="form-control"
                        type="text"
                        value={vendorToEdit.company}
                        onChange={(event) =>
                          setVendorToEdit({
                            ...vendorToEdit,
                            address: event.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                      <div className="form-group">
                        <label className="col-form-label">Vendor Type</label>
                        <select className="custom-select" name="vendorType" 
                          defaultValue={vendorToEdit?.vendorType}
                          value={vendorToEdit?.vendorType}
                          onChange={(e) => {
                            setVendorToAdd({
                              ...vendorToEdit,
                              vendorType: e.target.value,
                            });
                          }}
                        >
                          <option value="none">none</option>
                          <option value="supplier">supplier</option>
                          <option value="landowner">landowner</option>
                          <option value="agent">agent</option>
                        </select>
                      </div>
                    </div>
                </div>
                <div>
                  <div className="form-group">
                    <label>Address</label>
                    <textarea
                      defaultValue={vendorToEdit.address}
                      onChange={(e) => {
                        setVendorToEdit({
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
      </div> */}
      {/* /Edit Vendor Modal */}
      
      {/* Delete Client Modal */}
      <div className="modal custom-modal fade" id="delete_client" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete Vendor</h3>
                <p>Are you sure want to delete?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <a
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        deleteVendor();
                      }}
                      className="btn btn-primary continue-btn"
                    >
                      Delete
                    </a>
                  </div>
                  <div className="col-6">
                    <a
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

export default Vendor;
