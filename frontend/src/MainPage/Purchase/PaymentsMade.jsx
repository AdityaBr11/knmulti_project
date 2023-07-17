import { Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import httpService from '../../lib/httpService';
import { itemRender, onShowSizeChange } from '../paginationfunction';

const PaymentsMade = () => {

  const { search, state } = useLocation();

  const [ paymentData, setPaymentData ] = useState([]);

  const fetchPaymentOfBill = () => {
    toast 
      .promise( httpService.get(`/vendortrx/getpaymentofbill?vendorId=${state?.vendorId}&vendorBill=${state?.billId}`),
        { error: 'Failed to fetch payment of bill', 
          success: 'Payment of bill fetched successfully', 
          pending: 'fetching payment of bill...' } 
      ) 
      .then( (res) => setPaymentData(res.data.reverse()) ); 
      // document.querySelectorAll('.close')?.forEach((e) => e.click()); 
  }

  useEffect(() => {

    if(state?.vendorId) {
      fetchPaymentOfBill();
    } else { 

      toast
        .promise(
          httpService.get(`/vendortrx/getvendorbillpayment${search}`),
          {
            error: 'Failed to fetch vendor bills payment',
            success: 'Bills Payment Details fetched successfully',
            pending: 'fetching vendor bill payment...',
          }
        )
        .then((res) => setPaymentData(res.data.reverse()));

     }
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }, []);

  // Search 
  const [ qpayno, setqpayno ] = useState("");
  const [ qvendor, setqvendor ] = useState("");
  const [ qdatefrom, setqdatefrom ] = useState("");
  const [ qdateto, setqdateto ] = useState("");

  function searchTable(data) {

    let newData = data
      .filter(c => c?.paymentNo?.toLowerCase().indexOf(qpayno.toLowerCase()) > -1)
      .filter(c => c.vendorId?.name.toLowerCase().indexOf(qvendor.toLowerCase()) > -1)
      .filter(fd => fd?.paymentDate >= qdatefrom)

    if(qdateto){
      newData = newData.filter(fd => fd?.paymentDate.split("T")[0] <= qdateto);
    }

    return newData;
  }

  const columns = [
    {
      title: 'DATE',
      dataIndex: 'paymentDate',
      align: 'center',
      render: (paymentDate) => <span>{paymentDate?.split("T")[0]}</span>,
    },
    {
      title: 'PAYMENT#',
      dataIndex: 'paymentNo',
      align: 'center',
      render: (text, record) => <span><Link to={`/app/purchase/paymentinfo/${record._id}`}>{text}</Link></span>
    },
    {
      title: 'REFERENCE#',
      dataIndex: 'referenceId',
      align: 'center',
    },
    {
      title: 'VENDOR NAME',
      dataIndex: 'vendorId',
      render: (vendorId) => <span key={vendorId?._id}> <Link to={`/app/profile/vendor-profile/${vendorId?._id}`}>{vendorId?.name}</Link></span>,
      align: 'center',
    },
    {
      title: 'BILL#',
      dataIndex: 'vendorBill',
      align: 'center',
      render: (vendorBill) => <span>{vendorBill?.map((b) => <span>{b?.billNo}, </span>)}</span>
    },
    {
      title: 'MODE',
      dataIndex: 'paymentMode',
      render: (paymentMode) => <span>{paymentMode}</span>,
      align: 'center',
    },
    {
      title: 'AMOUNT',
      dataIndex: 'totalPaymentAmount',
      align: 'center',
      render: (totalPaymentAmount) => <span>₹ {totalPaymentAmount}</span>
    },
    {
      title: 'UNUSED AMOUNT',
      dataIndex: 'amountExcess',
      align: 'center',
      render: (amountExcess) => <span>₹ {amountExcess}</span>
    },
    
  ]

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>All Vendors Bills</title>
        <meta name="description" content="vendor bill" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col">
              <h3 className="page-title">All Payments</h3>
            </div>
            <div className="col-auto float-right ml-auto">
              <Link
                to={{pathname: "/app/purchase/billpayment", state: {length : paymentData.length}}}
                className="btn add-btn"
              >
                <i className="fa fa-plus" /> Add New Payment
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
                value={qpayno}
                onChange={(e) => setqpayno(e.target.value)}
              />
              <label className="focus-label">Profile Name</label>
            </div>
          </div>

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
          

        </div>


        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive">
              <Table
                className="table-striped"
                pagination={{
                  total: paymentData?.length,
                  showTotal: (total, range) =>
                    `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                  showSizeChanger: true,
                  onShowSizeChange: onShowSizeChange,
                  itemRender: itemRender,
                }}
                style={{ overflowX: 'auto' }}
                columns={columns}
                // bordered
                dataSource={searchTable(paymentData)}
                rowKey={(record) => record._id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentsMade