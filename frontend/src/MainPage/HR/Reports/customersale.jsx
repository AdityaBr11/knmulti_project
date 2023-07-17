import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Table } from 'antd';
import 'antd/dist/antd.css';
import { itemRender, onShowSizeChange } from '../../paginationfunction';
import '../../antdstyle.css';

const CustomerSale = ({ tempu, invoices, tempuSize }) => {
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
  console.log(invoiceCount, 'invoice counting..');
  console.log(invoiceSum, 'invoicesum');

  const func1for = () => {
    console.log('from func1 for');
    for (let i = 0; i <= tempu?.length; i++) {
      invoices
        .filter((icount) => {
          if (icount?.customer?.email == tempu[i]) {
            return icount;
          }
        })
        .map((icount) => {
          setInvoiceCount((oldArray) => [...oldArray, icount]);
          console.log(icount, 'icount');
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

      const grandTotal = filteredArr?.[is]
        .map((item) => {
          return item.grandTotal;
        })
        .reduce((prev, curr) => prev + curr, 0);

      const countI = filteredArr?.[is].length;

      const name = filteredArr?.[is].map((item) => {
        var oneName = item?.customer?.displayName;
        return oneName;
      });

      setInvoiceSum((oldArray) => [
        ...oldArray,
        {
          name: name?.[0],
          invoiceTime: countI,
          total: amount,
          gTotal: grandTotal,
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

console.log(dataToRender2,'replace add');

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
      title: 'NAME',
      dataIndex: 'name',
      render: (text, record) => (
        <Link to="/app/sales/invoices-view">{record?.name}</Link>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: 'INVOICE COUNT',
      dataIndex: 'invoiceTime',
      render: (text, record) => <span> {record?.invoiceTime}</span>,
      sorter: (a, b) => a.invoiceTime.length - b.invoiceTime.length,
    },
    {
      title: 'SALES',
      dataIndex: 'total',
      render: (text, record) => <span>₹ {record?.total}</span>,
      sorter: (a, b) => a.total.length - b.total.length,
    },
    {
      title: 'SALES WITH TAX',
      dataIndex: 'gTotal',
      render: (text, record) => <span>₹ {record?.gTotal}</span>,
      sorter: (a, b) => a.gTotal.length - b.gTotal.length,
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
              <h3 className="page-title">Sale By Customer</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">
                  Credit notes
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
                <input className="form-control floating w-auto" type="text" onChange={(e) => filterCustomerName(e)} />
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
      </div>
      {/* /Page Content */}
    </div>
  );
};

export default CustomerSale;
