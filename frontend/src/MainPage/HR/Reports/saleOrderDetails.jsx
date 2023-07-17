import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import { Table } from 'antd';
import 'antd/dist/antd.css';
import { itemRender, onShowSizeChange } from '../../paginationfunction';
import '../../antdstyle.css';
import httpService from '../../../lib/httpService';

const SaleOrderDetails = () => {
  useEffect(() => {
    (async () => {
      const res = await httpService.get('/sale-order');
      setData(res.data);
      const orders = [...res.data];
      setReInsertData(orders);
      setDataToRender(orders);
    })();
  }, []);
  const [data, setData] = useState([{}]);
  const [orderToEdit, setOrderToEdit] = useState();
  const [dataToRender, setDataToRender] = useState([{}]);
  const [reInsertData, setReInsertData] = useState([]);
  const [timeName, setTimeName] = useState();

  const totalOrder = data
    ?.map((item) => {
      return item?.amount;
    })
    .reduce((prev, curr) => prev + curr, 0);

  const filterDate = (e) => {
    if (e.target.value === '') {
      setDataToRender([...data]);
      return;
    }
    const date = new Date(e.target.value);
    setDataToRender((dataToRender) =>
      dataToRender.filter(
        (data) => new Date(data.orderDate?.split('T')[0]) > date
      )
    );
  };

  const filterDateLess = (e) => {
    if (e.target.value === '') {
      setDataToRender([...data]);
      return;
    }
    const date = new Date(e.target.value);
    setDataToRender((dataToRender) =>
      dataToRender.filter(
        (data) => new Date(data.orderDate?.split('T')[0]) < date
      )
    );
  };

  const filterCustomerName = (e) => {
    if (e.target.value === '') {
      setDataToRender([...data]);
      return;
    }
    setDataToRender((dataToRender) =>
      dataToRender.filter((data, i) =>
        data.customer?.displayName
          ?.toLowerCase()
          ?.includes(e.target.value?.toLowerCase())
      )
    );
  };

  const filterSalesOrder = (e) => {
    if (e.target.value === '') {
      setDataToRender([...data]);
      return;
    }
    setDataToRender((dataToRender) =>
      dataToRender.filter((data, i) =>
        data.salesOrder?.toLowerCase()?.includes(e.target.value?.toLowerCase())
      )
    );
  };

  const handleDelete = async () => {
    await httpService.delete(`/sale-order/${orderToEdit._id}`);
    setData(data.filter((order) => order._id !== orderToEdit._id));
    setDataToRender(data.filter((order) => order._id !== orderToEdit._id));
    document.querySelectorAll('.cancel-btn')?.forEach((e) => e.click());
  };

  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }
  });

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
  var lastDayM = new Date(curr.getFullYear(), curr.getMonth()+ 1, 0);
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
        if (new Date(e?.orderDate).toDateString() === today) {
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
          new Date(e?.orderDate) >= firstday &&
          new Date(e?.orderDate) <= lastday
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
          new Date(e?.orderDate) >= firstDayM &&
          new Date(e?.orderDate) <= lastDayM
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
          new Date(e?.orderDate) >= firstDayY &&
          new Date(e?.orderDate) <= lastDayY
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
          new Date(e?.orderDate) >= firstPrevY &&
          new Date(e?.orderDate) <= lastPrevY
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
      title: 'STATUS',
      dataIndex: 'status',
      render: (text, record) => (
        <span
          className={
            text === 'Accepted'
              ? 'badge bg-inverse-success'
              : 'badge bg-inverse-info'
          }
        >
          {text}
        </span>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
    },
    {
      title: 'DATE',
      dataIndex: 'orderDate',
      render: (text, record) => <span>{record?.orderDate?.split('T')[0]}</span>,
      sorter: (a, b) => a.orderDate.length - b.orderDate.length,
    },
    {
      title: 'EXPECTED SHIPMENT DATE',
      dataIndex: 'shipmentDate',
      render: (text, record) => <span>{record?.createdAt?.split('T')[0]}</span>,
      sorter: (a, b) => a.shipmentDate.length - b.shipmentDate.length,
    },
    {
      title: 'SALES ORDER#',
      dataIndex: 'salesOrder',
      render: (text, record) => (
        <Link to={`/app/sales/salesorder-info/${record._id}`}>{text}</Link>
      ),
      sorter: (a, b) => a.salesOrder.length - b.salesOrder.length,
    },
    {
      title: 'CUSTOMER NAME',
      dataIndex: 'customer',
      render: (text, record) => <span>{record?.customer?.displayName}</span>,
      sorter: (a, b) =>
        a.customer?.displayName.length - b.customer?.displayName.length,
    },
    // add status
    // add isInvoiced
    // add isPayed
    {
      title: 'AMOUNT',
      dataIndex: 'grandTotal',
      render: (text, record) => <span>₹ {text}</span>,
      sorter: (a, b) => a.amount.length - b.amount.length,
    },
  ];
  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Sales Orders Details </title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        <div className='d-flex'>
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Sales Orders Details</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Sales Orders Details</li>
              </ul>
            </div>
          </div>
        </div>
        {/* /Page Header */}
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
        {/* Search Filter */}
        <div className="row filter-row">
          <div className="col-sm-6 col-md-3">
            <div className="form-group form-focus select-focus">
              <div>
                <input
                  className="form-control floating w-auto"
                  type="date"
                  onChange={(e) => filterDate(e)}
                />
              </div>
              <label className="focus-label">From</label>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="form-group form-focus select-focus">
              <div>
                <input
                  className="form-control floating"
                  type="date"
                  onChange={(e) => filterDateLess(e)}
                />
              </div>
              <label className="focus-label">To</label>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="form-group form-focus focused">
              <div>
                <input
                  placeholder="Sales Order"
                  className="form-control floating"
                  type="text"
                  onChange={(e) => filterSalesOrder(e)}
                />
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="form-group form-focus focused">
              <div>
                <input
                  placeholder="Customer Name"
                  className="form-control floating"
                  type="text"
                  onChange={(e) => filterCustomerName(e)}
                />
              </div>
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
                dataSource={dataToRender}
                rowKey={(record) => record.id}
                // onChange={this.handleTableChange}
              />
            </div>
          </div>
        </div>
        <div className="row align-items-center pt-1">
          <h3 className="col">Total</h3>
          <h4 className="col-auto float-right ml-auto">{totalOrder}</h4>
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

export default SaleOrderDetails;
