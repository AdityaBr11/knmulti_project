import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Table } from 'antd';
import 'antd/dist/antd.css';
import { itemRender, onShowSizeChange } from '../../paginationfunction';
import '../../antdstyle.css';

const CustomerSale = ({ tempu, invoices }) => {
  const [dataToRender, setDataToRender] = useState([
    {
      name: 'someone',
      invoiceTime: 1,
      total: 2,
      gTotal: 3,
    },
  ]);
  const [dataToRender2, setDataToRender2] = useState();
  const [invoiceCount, setInvoiceCount] = useState([]);
  const [invoiceSum, setInvoiceSum] = useState([]);

  const func1for = () => {
    for (let i = 0; i <= tempu?.length; i++) {
      invoices
        .filter((icount) => {
          if (icount?.customer?.email == tempu[i]) {
            return icount;
          }
        })
        .map((icount) => {
          setInvoiceCount((oldArray) => [...oldArray, icount]);
        });
    }
  };
  useEffect(() => {
    func1for();
  }, [tempu]);

  let filteredArr = [];
  let subFilteredArr;

  let forSize;
  for (let i = 0; i <= tempu?.length; i++) {
    subFilteredArr = Object.assign(
      [],
      invoiceCount.filter((icount) => {
        if (icount?.customer?.email == tempu[i]) {
          return icount;
        }
      })
    );
    filteredArr.push(subFilteredArr);
    forSize = forSize++;
  }

  console.log(filteredArr, 'filteredArr');

  //first run this to cal.
  var is;
  const myFunc = () => {
    for (is = 0; is < tempu?.length; is++) {
      const amount = filteredArr?.[is]
        .map((item) => {
          return item.amount;
        })
        .reduce((prev, curr) => prev + curr, 0);

      const paymentReceived = filteredArr?.[is]
        .map((item) => {
          let money = 0;
          item?.paymentReceived?.forEach((rAmount) => {
            money += rAmount.amount;
          });
          return money;
        })
        .reduce((prev, curr) => prev + curr, 0);

      const closingBalance = amount - paymentReceived;

      const name = filteredArr?.[is].map((item) => {
        var oneName = item?.customer?.displayName;
        return oneName;
      });

      setInvoiceSum((oldArray) => [
        ...oldArray,
        {
          name: name?.[0],
          total: amount,
          rTotal: paymentReceived,
          cTotal: closingBalance,
        },
      ]);
    }
  };

  console.log(dataToRender, 'data to render');

  //second run this to render
  const dataRenderFunc = (e) => {
    setDataToRender((oldArray) => [...oldArray, invoiceSum]);
  };

  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }
  }, []);

  useEffect(() => {
    dataRenderFunc();
    setDataToRender2(invoiceSum);
  }, [invoiceSum]);

  let deciderBtn = false;
  let lastElT = tempu[tempu.length - 1];
  console.log(lastElT, 'last el t');
  let lastElF = filteredArr[filteredArr.length - 2];
  console.log(lastElF, 'last el Filt');
  let lastMailF = lastElF?.[0]?.customer?.email;
  console.log(lastMailF, 'last mail Filt');

  if (lastElT === lastMailF && lastMailF != undefined) {
    deciderBtn = true;
  }

  useEffect(() => {
    if (deciderBtn === true) {
      myFunc();
    }
  }, [deciderBtn]);

  //invoiced total
  let invoicedMoney = [];
  let invoicedMoneySum = [];
  invoiceSum?.filter((e) => {
    if (isNaN(e.total) === false) {
      invoicedMoney.push(e?.total);
      return invoicedMoney;
    } else {
      return 0;
    }
  });
  invoicedMoneySum = invoicedMoney.reduce((prev, curr) => prev + curr, 0);

  //received payments total
  let receivedMoney = [];
  let receivedMoneySum = [];
  invoiceSum?.filter((e) => {
    if (isNaN(e.rTotal) === false) {
      receivedMoney.push(e?.rTotal);
      return receivedMoney;
    } else {
      return 0;
    }
  });
  receivedMoneySum = receivedMoney.reduce((prev, curr) => prev + curr, 0);

  //Closing balance total
  let closingMoney = [];
  let closingMoneySum = [];
  invoiceSum?.filter((e) => {
    if (isNaN(e.cTotal) === false) {
      closingMoney.push(e?.cTotal);
      return closingMoney;
    } else {
      return 0;
    }
  });
  closingMoneySum = closingMoney.reduce((prev, curr) => prev + curr, 0);

  const filterCustomerName = (e) => {
    if (e.target.value === '') {
      setDataToRender2(invoiceSum);
      return;
    }
    setDataToRender2((dataToRender2) =>
    dataToRender2.filter((data, i) =>
        data?.name.toLowerCase()?.includes(e.target.value?.toLowerCase())
      )
    );
  };

  const columns = [
    {
      title: 'CUSTOMER NAME',
      dataIndex: 'name',
      render: (text, record) => (
        <Link to="/app/sales/invoices-view">{record?.name}</Link>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: 'INVOICED AMOUNT',
      dataIndex: 'total',
      render: (text, record) => <span>₹ {record?.total}</span>,
      sorter: (a, b) => a.total.length - b.total.length,
    },
    {
      title: 'AMOUNT RECEIVED',
      dataIndex: 'received total',
      render: (text, record) => <span>₹ {record?.rTotal}</span>,
      sorter: (a, b) => a.rTotal.length - b.rTotal.length,
    },
    {
      title: 'CLOSING BALANCE',
      dataIndex: 'received total',
      render: (text, record) => <span>₹ {record?.cTotal}</span>,
      sorter: (a, b) => a.cTotal.length - b.cTotal.length,
    },
  ];
  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Sale by Customer </title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Customer Bal. Summary</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">
                  Customer Bal. Summary
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        {/* Search Filter */}
        <div className="row filter-row">
          <div className="col-sm-6 col-md-6">
            <div className="form-group form-focus select-focus">
              <div>
                <input className="form-control floating w-auto" type="text" onChange={(e) => filterCustomerName(e)}/>
              </div>
              <label className="focus-label">Customer Name</label>
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
                dataSource={dataToRender2}
                rowKey={(record) => record.id}
                // onChange={this.handleTableChange}
              />
            </div>
          </div>
        </div>
        <div className="row align-items-center pt-1">
          <h4 className="col-auto  mx-auto">Total</h4>
          <h4 className="col-auto  mx-auto">{invoicedMoneySum}</h4>
          <h4 className="col-auto  mx-auto">{receivedMoneySum}</h4>
          <h4 className="col-auto  mx-auto">{closingMoneySum}</h4>
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
      {/* /Page Content */}
    </div>
  );
};

export default CustomerSale;
