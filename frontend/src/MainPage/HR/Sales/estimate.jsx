import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';

import { Table } from 'antd';
import 'antd/dist/antd.css';
import { itemRender, onShowSizeChange } from '../../paginationfunction';
import '../../antdstyle.css';
import httpService from '../../../lib/httpService';
import { DeleteForever } from '@material-ui/icons';

const Estimates = () => {
  
  const [data, setData] = useState([{}]);
  const [estimateToEdit, setEstimateToEdit] = useState()
  const [dataToRender, setDataToRender] = useState([{}]);
  const { state } = useLocation()
  
  useEffect(async () => {
    if (state?.customerId) {
      const res = await httpService.get(`/customer/estimate/${state?.customerId}`);
      setData(res.data);
      const estimates = [...res.data];
      setDataToRender(estimates);
      return;
    }
    const res = await httpService.get('/sale-estimate');
    setData(res.data);
    const estimates = [...res.data]
    setDataToRender(estimates);
    console.log(res.data);
    
  }, []);

  const filterDate = (e) => {
    if (e.target.value === '') {
      setDataToRender([...data])
      return;
    }
    const date = new Date(e.target.value) 
    setDataToRender((dataToRender) => dataToRender.filter((data) => (new Date(data.estimateDate?.split('T')[0])) > date))
  }

  const filterDateLess = (e) => {
    if (e.target.value === '') {
      setDataToRender([...data])
      return;
    }
    const date = new Date(e.target.value) 
    setDataToRender((dataToRender) => dataToRender.filter((data) => (new Date(data.estimateDate?.split('T')[0])) < date))
  }

  const filterCustomerName = (e) => {
    if (e.target.value === '') {
      setDataToRender([...data])
      return;
    }
    setDataToRender((dataToRender) => dataToRender.filter((data, i) => data.customer?.displayName?.includes(e.target.value)))
  }

  const filterEstimateNumber = (e) => {
    if (e.target.value === '') {
      setDataToRender([...data])
      return;
    }
    setDataToRender((dataToRender) => dataToRender.filter((data, i) => data.estimate?.includes(e.target.value)))
  }

  const handleDelete = async () => {
    await httpService.delete(`/sale-estimate/${estimateToEdit._id}`);
    setData(data.filter((estimate) => estimate._id !== estimateToEdit._id));
    setDataToRender(data.filter((estimate) => estimate._id !== estimateToEdit._id));
    document.querySelectorAll('.cancel-btn')?.forEach((e) => e.click());
  }

  // Search 

  const [ qest, setqest ] = useState("");
  const [ qcustomer, setqcustomer ] = useState("");
  const [ qdatefrom, setqdatefrom ] = useState("");
  const [ qdateto, setqdateto ] = useState("");
  const [ qdateby, setqdateby ] = useState("estdateby");

  function searchTable(data) {

    let newData = data
      .filter(row => row.estimate?.toLowerCase()?.indexOf(qest.toLowerCase()) > -1)
      .filter(c => c.customer?.displayName.toLowerCase().indexOf(qcustomer.toLowerCase()) > -1);

      if(qdateby == "expdateby"){
        newData = newData.filter(fd => fd?.expiryDate >= qdatefrom);
        if(qdateto !== ""){
          newData = newData.filter(fd => fd?.expiryDate.split("T")[0] <= qdateto);
        }
      } 
      else{
        newData = newData.filter(fd => fd?.estimateDate >= qdatefrom);
        if(qdateto !== ""){
          newData = newData.filter(fd => fd?.estimateDate.split("T")[0] <= qdateto);
        }
      }
      
    return newData;
  }

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
      title: 'Estimate Number',
      dataIndex: 'estimate',
      render: (text, record) => (
        <Link to={{pathname: `/app/sales/estimatesview/${record._id}`}}>{text}</Link>
      ),
      sorter: (a, b) => a.estimate.length - b.estimate.length,
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      render: (text, record) => (
        <Link to={`/app/profile/customer-profile/${record?.customer?._id}`}>
          {record?.customer?.displayName}
        </Link>
      ),
      sorter: (a, b) => a.customer.displayName.length - b.customer.displayName.length,
    },

    {
      title: 'Estimate Date',
      dataIndex: 'estimateDate',
      render: (text, record) => (
        <p>{record?.estimateDate?.split('T')[0]}</p>
      ),
      sorter: (a, b) => a.estimateDate.length - b.estimateDate.length,
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      render: (text, record) => (
        <p>{record?.expiryDate?.split('T')[0]}</p>
      ),
      sorter: (a, b) => a.expiryDate.length - b.expiryDate.length,
    },
    {
      title: 'Amount',
      dataIndex: 'grandTotal',
      render: (text, record) => <span>₹ {text}</span>,
      sorter: (a, b) => a.amount.length - b.amount.length,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text, record) => (
        <span
          className={
            text === 'INVOICED'
              ? 'badge bg-inverse-success'
              : 'badge bg-inverse-warning'
          }
        >
          {text}
        </span>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
    },
    // {
    //   title: 'Action',
    //   align: "center",
    //   render: (text, record) => (
    //     <a
    //           className="dropdown-item"
    //           href="#"
    //           data-toggle="modal"
    //           data-target="#delete_estimate"
    //           onClick={(e) => {
    //             setEstimateToEdit(record);
    //           }}
    //         >
    //           <DeleteForever />
    //         </a>
    //     // <div className="dropdown dropdown-action text-right">
    //     //   <a
    //     //     href="#"
    //     //     className="action-icon dropdown-toggle"
    //     //     data-toggle="dropdown"
    //     //     aria-expanded="false"
    //     //   >
    //     //     <i className="material-icons">more_vert</i>
    //     //   </a>
    //     //   <div className="dropdown-menu dropdown-menu-right">
    //     //     <Link className="dropdown-item" to={{ pathname: "/app/sales/createestimates", state: { ...record, edit: true }}}>
    //     //       <i 
    //     //         className="fa fa-pencil m-r-5"
    //     //       /> Edit
    //     //     </Link>
    //     //     <a
    //     //       className="dropdown-item"
    //     //       href="#"
    //     //       data-toggle="modal"
    //     //       data-target="#delete_estimate"
    //     //       onClick={(e) => {
    //     //         setEstimateToEdit(record);
    //     //       }}
    //     //     >
    //     //       <i className="fa fa-trash-o m-r-5" /> Delete
    //     //     </a>
    //     //   </div>
    //     // </div>
    //   ),
    // },
  ];
  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Estimates </title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Estimates</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Estimates</li>
              </ul>
            </div>
            <div className="col-auto float-right ml-auto">
              <Link to="/app/sales/createestimates" className="btn add-btn">
                <i className="fa fa-plus" /> Create Estimate
              </Link>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        {/* Search Filter */}
        <div className="row filter-row justify-content-between">
          <div className="col-sm-3 col-md-3">
            <div className="form-group form-focus focused">
              <input
                type="text"
                className="form-control floating"
                value={qest}
                onChange={(e) => setqest(e.target.value)}
              />
              <label className="focus-label">Estimate No</label>
            </div>
          </div>
          <div className="col-sm-3 col-md-3">
            <div className="form-group form-focus focused">
              <input
                type="text"
                className="form-control floating"
                value={qcustomer}
                onChange={(e) => setqcustomer(e.target.value)}
              />
              <label className="focus-label">Customer</label>
            </div>
          </div>
          <div className="col-sm-3 col-md-2">
            <div className="form-group form-focus focused">
              <input
                className="form-control floating"
                type="date"
                value={qdatefrom}
                  onChange={(e) => setqdatefrom(e.target.value)}
              />
              <label className="focus-label">From</label>
            </div>
          </div>
          <div className="col-sm-3 col-md-2">
            <div className="form-group form-focus focused">
              <input
                className="form-control floating"
                type="date"
                value={qdateto}
                onChange={(e) => setqdateto(e.target.value)}
              />
              <label className="focus-label">To</label>
            </div>
          </div>
          <div className="col-sm-3 col-md-2">
            <div className="form-group form-focus focused">
              <select
                className="custom-select form-control floating"
                name=""
                value={qdateby}
                onChange={(e) => setqdateby(e.target.value)}
              >
                <option value="estdateby">Estimate Date</option>
                <option value="expdateby">Expiry Date</option>
              </select>
              <label className="focus-label">Filter By</label>
            </div>
          </div>

        </div>
        {/* /Search Filter */}
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
                rowKey={(record) => record.id}
                // onChange={this.handleTableChange}
              />
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
      {/* Delete Estimate Modal */}
      <div
        className="modal custom-modal fade"
        id="delete_estimate"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete Estimate</h3>
                <p>Are you sure want to delete?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <a onClick={(e) => {
                      e.preventDefault();
                      handleDelete()
                    }}
                     href="" className="btn btn-primary continue-btn">
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
      {/* /Delete Estimate Modal */}
    </div>
  );
};

export default Estimates;
