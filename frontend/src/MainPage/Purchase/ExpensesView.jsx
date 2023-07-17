import React, { useState, useEffect } from 'react'
import { Table } from 'antd'
import { Helmet } from 'react-helmet'
import { Link, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import httpService from '../../lib/httpService';
import { itemRender, onShowSizeChange } from '../paginationfunction'

const ExpensesView = () => {

  const { search } = useLocation();

  const [ expenseData, setExpenseData ] = useState([]);
  // console.log(expenseData,'expdata');


  useEffect(() => {
    toast
      .promise(
        httpService.get(`/vendortrx/getvendorexpense${search}`),
        {
          error: 'Failed to fetch Expenses',
          success: 'Expenses Details fetched successfully',
          pending: 'fetching Expenses...',
        }
      )
      .then((res) => setExpenseData(res.data.reverse()));
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }, []);

  // Search 
  const [ qvendor, setqvendor ] = useState("");
  const [ qstatus, setqstatus ] = useState();
  const [ qdatefrom, setqdatefrom ] = useState("");
  const [ qdateto, setqdateto ] = useState("");

  function searchTable(data) {

    let newData = data
      .filter(c => c.vendorId?.name.toLowerCase().indexOf(qvendor.toLowerCase()) > -1)
      .filter(fd => fd?.expenseDate >= qdatefrom)

    if(qdateto){
      newData = newData.filter(fd => fd?.expenseDate.split("T")[0] <= qdateto);
    }

    if(qstatus){
      newData = newData.filter(s => s.status?.toLowerCase()?.indexOf(qstatus?.toLowerCase()) > -1);
    }
    return newData;
  }
  

  const columns = [
    {
      title: 'DATE',
      dataIndex: 'expenseDate',
      align: 'center',
      render: (expenseDate) => <span>{expenseDate?.split("T")[0]}</span>,
    },
    {
      title: 'EXPENSE ACCOUNT',
      dataIndex: 'expenseAccount',
      align: 'center',
      render: (text, record) => <span><Link to={`/app/purchase/expenseinfo/${record._id}`}>{text}</Link></span>
    },
    {
      title: 'REFERENCE#',
      dataIndex: 'invoiceId',
      align: 'center',
    },
    {
      title: 'VENDOR NAME',
      dataIndex: 'vendorId',
      render: (vendorId) => <span key={vendorId?._id}> <Link to={`/app/profile/vendor-profile/${vendorId?._id}`}>{vendorId?.name}</Link></span>,
      align: 'center',
    },
    {
      title: 'PAYED THROUGH',
      dataIndex: 'paymentThrough',
      align: 'center',
    },
    {
      title: 'CUSTOMER NAME',
      dataIndex: 'customerId',
      // render: (customerId) => <span key={customerId?._id}>{customerId?.displayName}</span>,
      render: (customerId) => <span key={customerId?._id}> <Link to={`/app/profile/customer-profile/${customerId?._id}`}>{customerId?.displayName}</Link></span>,
      align: 'center',
    },
    {
      title: 'AMOUNT',
      dataIndex: 'expenseAmount',
      // align: 'center',
      render: (expenseAmount) => <span>₹ {expenseAmount}</span>
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      align: 'center',
      render: (status) => <span 
          className={ status === 'INVOICED' ? 'badge bg-inverse-success' : status == 'UNBILLED' ? 'badge bg-inverse-danger' : 'badge bg-inverse-warning' } >
          {status}
        </span>
      // render: (status) => <span className={status == "INVOICED" ? 'text-primary' : 'text-muted'}>{status}</span>
    },
    
  ]

  return (
    <div className="page-wrapper"> 
      <Helmet>
        <title>All Expenses</title>
        <meta name="description" content="vendor all expenses" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col">
              <h3 className="page-title">All Expenses</h3>
            </div>
            <div className="col-auto float-right ml-auto">
              <Link
                to={{pathname: "/app/purchase/addexpense"}}
                className="btn add-btn"
              >
                <i className="fa fa-plus" /> Add New Expense
              </Link>
            </div>
            <div className="col-auto float-right ml-auto">
              <Link
                to={{pathname: "/app/purchase/addmileageexpense"}}
                className="btn add-btn"
              >
                <i className="fa fa-plus" /> Record Mileage
              </Link>
            </div>
          </div>
        </div>

        {/* Search Filter */}
        <div className="row filter-row justify-content-between">
          
          <div className="col-sm-4 col-md-3">
            <div className="form-group form-focus focused">
              <input
                type="text"
                className="form-control floating"
                value={qvendor}
                onChange={(e) => setqvendor(e.target.value)}
              />
              <label className="focus-label">Vendor</label>
            </div>
          </div>

          <div className="col-sm-3 col-md-3">
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

          <div className="col-sm-3 col-md-3">
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

          <div className="col-sm-3 col-md-3">
            <div className="form-group form-focus focused">
              <select
                className="custom-select form-control floating"
                name=""
                value={qstatus}
                onChange={(e) => setqstatus(e.target.value)}
              >
                <option value={""} selected>Choose status</option>
                <option value="UNBILLED">UNBILLED</option>
                <option value="NON-BILLABLE">NON-BILLABLE</option>
                <option value="INVOICED">INVOICED</option>
              </select>
              <label className="focus-label">Status</label>
            </div>
          </div>

        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive">
              <Table
                className="table-striped"
                pagination={{
                  total: expenseData?.length,
                  showTotal: (total, range) =>
                    `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                  showSizeChanger: true,
                  onShowSizeChange: onShowSizeChange,
                  itemRender: itemRender,
                }}
                style={{ overflowX: 'auto' }}
                columns={columns}
                // bordered
                dataSource={searchTable(expenseData)}
                rowKey={(record) => record._id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpensesView