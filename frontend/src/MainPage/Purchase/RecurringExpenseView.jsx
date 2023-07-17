import { Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import httpService from '../../lib/httpService'
import { itemRender, onShowSizeChange } from '../paginationfunction'

const RecurringExpenseView = () => {

  const [ recurringExpenseData, setRecurringExpenseData ] = useState([]);

  useEffect(() => {
    toast
      .promise(
        httpService.get(`/vendortrx/getrecurringexpense`),
        {
          error: 'Failed to fetch vendor recurring expense',
          success: 'recurring expense Details fetched successfully',
          pending: 'fetching vendor recurring expense...',
        }
      )
      .then((res) => setRecurringExpenseData(res.data.reverse()));
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }, []);

  // Search 
  const [ qname, setqname ] = useState("");
  const [ qvendor, setqvendor ] = useState("");
  const [ qfreq, setqfreq ] = useState();
  const [ qstatus, setqstatus ] = useState();
  const [ qdatefrom, setqdatefrom ] = useState("");
  const [ qdateto, setqdateto ] = useState("");

  function searchTable(data) {

    let newData = data
      .filter(c => c?.profileName?.toLowerCase().indexOf(qname.toLowerCase()) > -1)
      .filter(c => c.vendorId?.name.toLowerCase().indexOf(qvendor.toLowerCase()) > -1)
      .filter(fd => fd?.expenseNextDate >= qdatefrom)

    if(qdateto){
      newData = newData.filter(fd => fd?.expenseNextDate.split("T")[0] <= qdateto);
    }
      
    if(qfreq){
      newData = newData.filter(s => s.repeatEvery?.repeatUnit?.toLowerCase() == qfreq?.toLowerCase());
    }
    if(qstatus){
      newData = newData.filter(s => s.status?.toLowerCase() == qstatus?.toLowerCase());
    }
    return newData;
  }

  const columns = [
    {
      title: 'Profile Name',
      dataIndex: 'profileName',
      align: 'center',
      render: (text, record) => <span><Link to={`/app/purchase/recurringexpenseinfo/${record._id}`}>{text}</Link></span>
    },
    {
      title: 'EXPENSE ACCOUNT',
      dataIndex: 'expenseAccount',
      align: 'center',
      // render: (text, record) => <span><Link to={`/app/purchase/recurringexpenseinfo/${record._id}`}>{text}</Link></span>
    },
    {
      title: 'VENDOR NAME',
      dataIndex: 'vendorId',
      render: (vendorId) => <span key={vendorId?._id}> <Link to={`/app/profile/vendor-profile/${vendorId?._id}`}>{vendorId?.name}</Link></span>,
      align: 'center',
    },
    {
      title: 'Frequency',
      dataIndex: 'repeatEvery',
      align: 'center',
      render: (repeatEvery) => <span>{repeatEvery?.repeatNumber} {repeatEvery?.repeatUnit}</span>
    },
    {
      title: 'Last Expense Date',
      dataIndex: 'expenseEndDate',
      align: 'center',
      render: (expenseEndDate) => <span>{expenseEndDate ? expenseEndDate?.split("T")[0] : "Goes Forever"}</span>,
    },
    {
      title: 'Next Expense Date',
      dataIndex: 'expenseNextDate',
      align: 'center',
      render: (expenseNextDate) => <span>{expenseNextDate?.split("T")[0]}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
    },
    {
      title: 'AMOUNT',
      dataIndex: 'expenseAmount',
      align: 'center',
      render: (expenseAmount) => <span>₹{expenseAmount}</span>
    },
    
  ]

  return (
    <div className="page-wrapper"> 
      <Helmet>
        <title>Recurring Expense List</title>
        <meta name="description" content="vendor all Recurring Expense" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col">
              <h3 className="page-title">All Recurring Expense</h3>
            </div>
            <div className="col-auto float-right ml-auto">
              <Link
                to={{pathname: "/app/purchase/addrecurringexpense"}}
                className="btn add-btn"
              >
                <i className="fa fa-plus" /> Add Recurring Expense 
              </Link>
            </div>
          </div>
        </div>

        {/* Search Filter */}
        <div className="row filter-row justify-content-between">
          
          <div className="col-sm-4 col-md-2">
            <div className="form-group form-focus focused">
              <input
                type="text"
                className="form-control floating"
                value={qname}
                onChange={(e) => setqname(e.target.value)}
              />
              <label className="focus-label">Profile Name</label>
            </div>
          </div>

          <div className="col-sm-4 col-md-2">
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

          <div className="col-sm-3 col-md-2">
            <div className="form-group form-focus focused">
              <select
                className="custom-select form-control floating"
                name=""
                value={qfreq}
                onChange={(e) => setqfreq(e.target.value)}
              >
                <option value={""} selected>Choose Frequency</option>
                <option value="days">Daily</option>
                <option value="weeks">Weekly</option>
                <option value="months">Monthly</option>
                <option value="years">Yearly</option>
              </select>
              <label className="focus-label">Frequency</label>
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
            <label className="focus-label">Next Expense From</label>
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
            <label className="focus-label">Next Expense To</label>
            </div>
          </div>
          
          <div className="col-sm-3 col-md-2">
            <div className="form-group form-focus focused">
              <select
                className="custom-select form-control floating"
                name=""
                value={qstatus}
                onChange={(e) => setqstatus(e.target.value)}
              >
                <option value={""} selected>Choose status</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
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
                  total: recurringExpenseData?.length,
                  showTotal: (total, range) =>
                    `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                  showSizeChanger: true,
                  onShowSizeChange: onShowSizeChange,
                  itemRender: itemRender,
                }}
                style={{ overflowX: 'auto' }}
                columns={columns}
                // bordered
                dataSource={searchTable(recurringExpenseData)}
                rowKey={(record) => record._id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecurringExpenseView