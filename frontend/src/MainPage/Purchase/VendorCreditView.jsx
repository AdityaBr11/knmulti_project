import { Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import httpService from '../../lib/httpService'
import { itemRender, onShowSizeChange } from '../paginationfunction'

const VendorCreditView = () => {

  const { search, state } = useLocation();

  const [ vendorCredit, setvendorCredit ] = useState([]);

  const fetchCreditOfBill = () => {
    toast 
      .promise( httpService.get(`/vendortrx/getcreditofbill?vendorId=${state?.vendorId}&vendorBill=${state?.billId}`),
        { error: 'Failed to fetch Credit of bill', 
          success: 'Credit of bill fetched successfully', 
          pending: 'fetching Credit of bill...' } 
      ) 
      .then( (res) => setvendorCredit(res.data.reverse()) ); 
      // document.querySelectorAll('.close')?.forEach((e) => e.click()); 
  }

  useEffect(() => { 
    if(state?.vendorId) {
      fetchCreditOfBill();
    } else { 
    toast
      .promise(
        httpService.get(`/vendortrx/getvendorcredit${search}`),
        {
          error: 'Failed to get vendor credit',
          success: 'vendor credit fetched successfully',
          pending: 'fetching vendor vendor credit...',
        }
      )
      .then((res) => setvendorCredit(res.data.reverse()));
    }
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }, []);

  // Search 

  const [ qvc, setqvc ] = useState("");
  const [ qvendor, setqvendor ] = useState("");
  const [ qstatus, setqstatus ] = useState();
  const [ qdatefrom, setqdatefrom ] = useState("");
  const [ qdateto, setqdateto ] = useState("");

  function searchTable(data) {

    let newData = data
      .filter(row => row.creditOrder.toLowerCase().indexOf(qvc.toLowerCase()) > -1)
      .filter(c => c.vendorId?.name.toLowerCase().indexOf(qvendor.toLowerCase()) > -1)
      .filter(fd => fd?.vendorCreditDate >= qdatefrom)
      // .filter(fd => fd?.vendorCreditDate.split("T")[0] <= qdateto);

    if(qdateto){
      newData = newData.filter(fd => fd?.vendorCreditDate.split("T")[0] <= qdateto);
    }
    if(qstatus){
      newData = newData.filter(s => s.status?.toLowerCase()?.indexOf(qstatus?.toLowerCase()) > -1);
    }
    return newData;
  }

  const columns = [
    {
      title: 'DATE',
      dataIndex: 'vendorCreditDate',
      align: 'center',
      render: (vendorCreditDate) => <span>{vendorCreditDate?.split("T")[0]}</span>,
    },
    {
      title: 'CREDIT NOTE#',
      dataIndex: 'creditOrder',
      align: 'center',
      render: (text, record) => <span><Link to={`/app/purchase/vendorcreditinfo/${record._id}`}>{text}</Link></span>
    },
    {
      title: 'REFERENCE#',
      dataIndex: 'orderNo',
      align: 'center',
    },
    {
      title: 'VENDOR NAME',
      dataIndex: 'vendorId',
      render: (vendorId) => <span key={vendorId?._id}> <Link to={`/app/profile/vendor-profile/${vendorId?._id}`}>{vendorId?.name}</Link></span>,
      align: 'center',
    },
    {
      title: 'AMOUNT',
      dataIndex: 'total',
      // align: 'center',
      render: (total) => <span>₹ {total}</span>,
      // render: (isBillable) => <span className={isBillable ? 'text-primary' : 'text-dark'}>{isBillable ? "BILLED": "UNBILLED"}</span>
    },
    {
      title: 'BALANCE',
      dataIndex: 'balance',
      // align: 'center',
      render: (balance) => <span>₹ {balance}</span>,
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      align: 'center',
      render: (status) => <span 
      className={ status === 'OPEN' ? 'badge bg-inverse-success' : status == 'PARTIAL' ? 'badge bg-inverse-warning' : 'badge bg-inverse-danger' } >
      {status}
    </span>
      // render: (status) => <span className={status != "OPEN" ? 'text-primary' : 'text-success'}>{status}</span>
    },
    
  ]

  return (
    <div className="page-wrapper"> 
      <Helmet>
        <title>vendor credit List</title>
        <meta name="description" content="vendor all vendor credit" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col">
              <h3 className="page-title">All Vendor Credit</h3>
            </div>
            <div className="col-auto float-right ml-auto">
              <Link
                to={{pathname: "/app/purchase/addvendorcredit"}}
                className="btn add-btn"
              >
                <i className="fa fa-plus" /> Add Vendor Credit
              </Link>
            </div>
          </div>
        </div>

        {/* Search Filter */}
        <div className="row filter-row justify-content-between">
          <div className="col-sm-3 col-md-3">
            <div className="form-group form-focus focused">
              <input
                type="text"
                className="form-control floating"
                value={qvc}
                onChange={(e) => setqvc(e.target.value)}
              />
              <label className="focus-label">Credit No</label>
            </div>
          </div>
          <div className="col-sm-3 col-md-3">
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
                value={qstatus}
                onChange={(e) => setqstatus(e.target.value)}
              >
                <option value={""} selected>Choose status</option>
                <option value="OPEN">OPEN</option>
                <option value="PARTIAL">PARTIAL</option>
                <option value="CLOSED">CLOSED</option>
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
                  total: vendorCredit?.length,
                  showTotal: (total, range) =>
                    `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                  showSizeChanger: true,
                  onShowSizeChange: onShowSizeChange,
                  itemRender: itemRender,
                }}
                style={{ overflowX: 'auto' }}
                columns={columns}
                // bordered
                dataSource={searchTable(vendorCredit)}
                rowKey={(record) => record._id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorCreditView