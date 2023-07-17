import { Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import httpService from '../../../lib/httpService';
import {
  itemRender,
  onShowSizeChange,
} from '../../../MainPage/paginationfunction';

const PaymentsMade = () => {
  const { search, state } = useLocation();

  const [paymentData, setPaymentData] = useState([]);
  const [dataToRender, setDataToRender] = useState([]);
  const [reInsertData, setReInsertData] = useState([]);
  const [timeName, setTimeName] = useState();
  console.log(dataToRender, 'dataToRender//');
  console.log(reInsertData, 'reInsertData--');

  //total amount
  const totalAmount = dataToRender
    ?.map((item) => {
      return item?.totalPaymentAmount;
    })
    .reduce((prev, curr) => prev + curr, 0);
  //total amount

  const fetchPaymentOfBill = () => {
    toast
      .promise(
        httpService.get(
          `/vendortrx/getpaymentofbill?vendorId=${state?.vendorId}&vendorBill=${state?.billId}`
        ),
        {
          error: 'Failed to fetch payment of bill',
          success: 'Payment of bill fetched successfully',
          pending: 'fetching payment of bill...',
        }
      )
      .then((res) => {
        setPaymentData(res.data.reverse());
        setDataToRender(res?.data);
        setReInsertData(res?.data);
      });
    // document.querySelectorAll('.close')?.forEach((e) => e.click());
  };

  useEffect(() => {
    if (state?.vendorId) {
      fetchPaymentOfBill();
    } else {
      toast
        .promise(httpService.get(`/vendortrx/getvendorbillpayment${search}`), {
          error: 'Failed to fetch vendor bills payment',
          success: 'Bills Payment Details fetched successfully',
          pending: 'fetching vendor bill payment...',
        })
        .then((res) => {
          setPaymentData(res.data);
          setDataToRender(res?.data);
          setReInsertData(res?.data);
        });
    }
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }, []);

  // Search
  const [qpayno, setqpayno] = useState('');
  const [qvendor, setqvendor] = useState('');
  const [qdatefrom, setqdatefrom] = useState('');
  const [qdateto, setqdateto] = useState('');

  function searchTable(data) {
    let newData = data
      .filter(
        (c) => c?.paymentNo?.toLowerCase().indexOf(qpayno.toLowerCase()) > -1
      )
      .filter(
        (c) =>
          c.vendorId?.name.toLowerCase().indexOf(qvendor.toLowerCase()) > -1
      )
      .filter((fd) => fd?.paymentDate >= qdatefrom);

    if (qdateto) {
      newData = newData.filter(
        (fd) => fd?.paymentDate.split('T')[0] <= qdateto
      );
    }

    return newData;
  }

  //this time range
  const THIS = [
    { name: 'Default' },
    { name: 'Today' },
    { name: 'This Week' },
    { name: 'This Month' },
    { name: 'This Year' },
    { name: 'Previous Year' },
  ];
  //week
  var curr = new Date(); // get current date
  var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
  var last = first + 6; // last day is the first day + 6
  var firstday = new Date(curr.setDate(first));
  var lastday = new Date(curr.setDate(last));
  //week
  //month
  var firstDayM = new Date(curr.getFullYear(), curr.getMonth(), 1);
  var lastDayM = new Date(curr.getFullYear(), curr.getMonth()+1, 0);
  //month
  //year
  const currentYear = new Date().getFullYear();
  const firstDayY = new Date(currentYear, 0, 1);
  const lastDayY = new Date(currentYear, 11, 31);
  //year
  //previous year
  const previousYear = new Date().getFullYear() - 1;
  const firstPrevY = new Date(previousYear, 0, 1);
  const lastPrevY = new Date(previousYear, 11, 31);
  //previous year

  const today = new Date().toDateString();
  const rangeData = [];

  //today filter
  const todayFilter = (e) => {
    paymentData
      ?.filter((e) => {
        if (new Date(e?.paymentDate).toDateString() === today) {
          return e;
        } else {
          return setDataToRender([]);
        }
      })
      .map((e) => {
        rangeData.push(e);
        setDataToRender(rangeData);
      });
  };
  //today filter

  //week filter
  const weekFilter = (e) => {
    paymentData
      ?.filter((e) => {
        if (
          new Date(e?.paymentDate) >= firstday &&
          new Date(e?.paymentDate) <= lastday
        ) {
          return e;
        } else {
          return setDataToRender([]);
        }
      })
      .map((e) => {
        rangeData.push(e);
        setDataToRender(rangeData);
      });
  };
  //week filter

  //month filter
  const monthFilter = (e) => {
    paymentData
      ?.filter((e) => {
        if (
          new Date(e?.paymentDate) >= firstDayM &&
          new Date(e?.paymentDate) <= lastDayM
        ) {
          return e;
        } else {
          return setDataToRender([]);
        }
      })
      .map((e) => {
        rangeData.push(e);
        setDataToRender(rangeData);
      });
  };
  //month filter

  //year filter
  const yearFilter = (e) => {
    paymentData
      ?.filter((e) => {
        if (
          new Date(e?.paymentDate) >= firstDayY &&
          new Date(e?.paymentDate) <= lastDayY
        ) {
          return e;
        } else {
          return setDataToRender([]);
        }
      })
      .map((e) => {
        rangeData.push(e);
        setDataToRender(rangeData);
      });
  };
  //year filter

  //previous year filter
  const previousYearFilter = (e) => {
    paymentData
      ?.filter((e) => {
        if (
          new Date(e?.paymentDate) >= firstPrevY &&
          new Date(e?.paymentDate) <= lastPrevY
        ) {
          return e;
        } else {
          return setDataToRender([]);
        }
      })
      .map((e) => {
        rangeData.push(e);
        setDataToRender(rangeData);
      });
  };
  //previous year filter
  const reset = (e) => {
    setDataToRender(reInsertData);
  };

  useEffect(() => {
    switch (timeName) {
      case 'Today':
        todayFilter();
        break;
      case 'This Week':
        weekFilter();
        break;
      case 'This Month':
        monthFilter();
        break;
      case 'This Year':
        yearFilter();
        break;
      case 'Previous Year':
        previousYearFilter();
        break;
      case 'Default':
        reset();
        break;
    }
  }, [timeName]);
  //this time range

  const columns = [
    {
      title: 'DATE',
      dataIndex: 'paymentDate',
      align: 'center',
      render: (paymentDate) => <span>{paymentDate?.split('T')[0]}</span>,
    },
    {
      title: 'PAYMENT#',
      dataIndex: 'paymentNo',
      align: 'center',
      render: (text, record) => (
        <span>
          <Link to={`/app/purchase/paymentinfo/${record._id}`}>{text}</Link>
        </span>
      ),
    },
    {
      title: 'REFERENCE#',
      dataIndex: 'referenceId',
      align: 'center',
    },
    {
      title: 'VENDOR NAME',
      dataIndex: 'vendorId',
      render: (vendorId) => (
        <span key={vendorId?._id}>
          {' '}
          <Link to={`/app/profile/vendor-profile/${vendorId?._id}`}>
            {vendorId?.name}
          </Link>
        </span>
      ),
      align: 'center',
    },
    {
      title: 'BILL#',
      dataIndex: 'vendorBill',
      align: 'center',
      render: (vendorBill) => (
        <span>
          {vendorBill?.map((b) => (
            <span>{b?.billNo}, </span>
          ))}
        </span>
      ),
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
    },
  ];

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
              {/* Search Filter Time*/}
              <div className="">
                <div className="form-group form-focus focused text-left">
                  <a
                    className="btn form-control btn-white dropdown-toggle px-5 pt-3"
                    href="#"
                    data-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {timeName || 'Default'}
                  </a>
                  <div className="dropdown-menu dropdown-menu-right">
                    {THIS.map((thisTime, index) => (
                      <span
                        key={index}
                        className="dropdown-item"
                        onClick={() => {
                          setTimeName(thisTime?.name);
                        }}
                      >
                        {thisTime?.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {/* /Search Filter Time*/}
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
                dataSource={searchTable(dataToRender)}
                rowKey={(record) => record._id}
              />
            </div>
          </div>
        </div>
        <div className="row align-items-center pt-1">
          <h4 className="col">Total Amount</h4>
          <h4 className="col-auto float-right ml-auto">{totalAmount}</h4>
        </div>
        <hr
          style={{
            backgroundColor: 'rgb(189 186 186)',
            width: '100%',
            height: '2px',
            marginTop: '0px',
          }}
        />
      </div>
    </div>
  );
};

export default PaymentsMade;
