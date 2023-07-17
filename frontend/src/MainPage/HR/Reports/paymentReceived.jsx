import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Table } from 'antd';
import 'antd/dist/antd.css';
import { itemRender, onShowSizeChange } from '../../paginationfunction';
import '../../antdstyle.css';
import { fetchPayment } from '../../../lib/api';
import httpService from '../../../lib/httpService';

const PaymentReceived = () => {
  const { state } = useLocation();

  useEffect(async () => {
    if (state?.customerId) {
      const res = await httpService.get(
        `/customer/payments/${state?.customerId}`
      );
      setData(res.data);
      setDataToRender([...res.data]);
      return;
    }
    const res = await fetchPayment();
    setData(res);
    setReInsertData([...res]);
    setDataToRender([...res]);
  }, []);

  const [data, setData] = useState([]);
  const [dataToRender, setDataToRender] = useState([]);
  const [reInsertData, setReInsertData] = useState([]);
  const [timeName, setTimeName] = useState();
  console.log(data, 'data//');
  console.log(dataToRender, 'dataToRender//');
  console.log(reInsertData, 'reInsertData--');

  //total amount
  const totalAmount = dataToRender
    ?.map((item) => {
      return item?.amountReceived;
    })
    .reduce((prev, curr) => prev + curr, 0);
  //total amount
  //total unUsed amount
  const totalUnusedAmount = dataToRender
    ?.map((item) => {
      return item?.excessAmount;
    })
    .reduce((prev, curr) => prev + curr, 0);
  //total unUsed amount

  const filterCustomerName = (e) => {
    if (e.target.value === '') {
      setDataToRender([...data]);
      return;
    }
    setDataToRender((dataToRender) =>
      dataToRender.filter((data, i) =>
        data.customer?.displayName
          ?.toLowerCase()
          ?.includes(e.target.value.toLowerCase())
      )
    );
  };

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
    data
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
    data
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
    data
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
    data
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
    data
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
      title: 'Date',
      dataIndex: 'paymentDate',
      render: (text, record) => (
        <span>{record?.paymentDate?.split('T')[0]}</span>
      ),
      // sorter: (a, b) => a.paymentDate.length - b.paymentDate.length,
    },
    {
      title: 'Payment #',
      dataIndex: 'paymentNumber',
      render: (text, record) => (
        <Link to={`/app/sales/payment-view/${record._id}`}>#{text}</Link>
      ),
      // sorter: (a, b) => b.invoicenumber.length - a.invoicenumber.length,
    },
    {
      title: 'Reference Number',
      dataIndex: 'reference',
      render: (text, record) => <span>{text}</span>,
      // sorter: (a, b) => b.reference.length - a.reference.length,
    },
    {
      title: 'Customer Name',
      dataIndex: 'customer',
      render: (text, record) => <span>{record?.customer?.displayName}</span>,
      // sorter: (a, b) => a.customer.name.length - b.customer.name.length,
    },
    {
      title: 'Invoice #',
      dataIndex: 'invoice',
      render: (text, record) => {
        let invoices = '';
        record.invoice.map((inv) => {
          invoices = invoices.concat(`${inv.invoiceNumber}, `);
        });
        return <span>{invoices}</span>;
      },
      // sorter: (a, b) => a.customer.name.length - b.customer.name.length,
    },
    {
      title: 'Mode',
      dataIndex: 'paymentMode',
      // sorter: (a, b) => a.paymenttype.length - b.paymenttype.length,
    },
    {
      title: 'Amount',
      dataIndex: 'amountReceived',
      render: (text, record) => <span>₹ {text}</span>,
      // sorter: (a, b) => a.duedate.length - b.duedate.length,
    },
    {
      title: 'Unused Amount',
      dataIndex: 'excessAmount',
      render: (text, record) => <span>₹ {text}</span>,
      // sorter: (a, b) => a.amount.length - b.amount.length,
    },
  ];

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Payment Received</title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
      <div className='d-flex'>
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Payments Received</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Payments Received</li>
              </ul>
            </div>
          </div>
        </div>
        {/* Search Filter Time*/}
        <div className="col-sm-6 col-md-3 col-auto float-right ml-auto">
          <div className="form-group form-focus focused text-left">
            <a
              className="btn form-control btn-white dropdown-toggle"
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
        {/* /Page Header */}
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
                dataSource={dataToRender}
                rowKey={(record) => record.id}
                // onChange={this.handleTableChange}
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
        <div className="row align-items-center pt-1">
          <h4 className="col">Total Unused Amount</h4>
          <h4 className="col-auto float-right ml-auto">{totalUnusedAmount}</h4>
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

export default PaymentReceived;
