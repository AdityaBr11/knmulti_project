import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { Helmet } from 'react-helmet';
import { itemRender, onShowSizeChange } from '../../paginationfunction';
import httpService from '../../../lib/httpService';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const VendorBalanceSum = () => {
  const [data, setData] = useState([]);
  const [reInsertData, setReInsertData] = useState();
  const [venderBills, setVenderBills] = useState();
  const [dataToRender, setDataToRender] = useState([]);
  const [timeName, setTimeName] = useState('Default');
  console.log(venderBills, 'venderBills**');
  console.log(dataToRender, 'dataTorender');
  console.log(data, 'data');

  const fetchVBalSum = async () => {
    const res = await httpService.get('/reportdata/vbalsummary');

    const resData = res.data.map((r, index) => {
      let upr = { ...r, sNo: index + 1 };
      return upr;
    });
    setData(resData);
    setReInsertData(resData);
  };

  const vendorBillsFetch = async () => {
    const res = await httpService.get(`/vendortrx/getvendorbills`);
    setVenderBills(res?.data);
  };

  useEffect(() => {
    vendorBillsFetch();
    fetchVBalSum();
  }, []);

  console.log({ data });
  console.log(reInsertData, 'reInsertData..');

  //filter
  const filterCustomerName = (e) => {
    if (e.target.value === '') {
      setData(reInsertData);
      return;
    }
    setData((resData) =>
      resData.filter((data, i) =>
        data?.vendorId?.name
          ?.toLowerCase()
          ?.includes(e.target.value?.toLowerCase())
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
    venderBills
      ?.filter((e) => {
        if (new Date(e?.billDate).toDateString() === today) {
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
    venderBills
      ?.filter((e) => {
        if (
          new Date(e?.billDate) >= firstday &&
          new Date(e?.billDate) <= lastday
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
    console.log(firstDayM,'first day m');
    console.log(lastDayM,'last day m');
    venderBills
      ?.filter((e) => {
        if (
          new Date(e?.billDate) >= firstDayM &&
          new Date(e?.billDate) <= lastDayM
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
    venderBills
      ?.filter((e) => {
        if (
          new Date(e?.billDate) >= firstDayY &&
          new Date(e?.billDate) <= lastDayY
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
    venderBills
      ?.filter((e) => {
        if (
          new Date(e?.billDate) >= firstPrevY &&
          new Date(e?.billDate) <= lastPrevY
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
    setData(reInsertData);
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

  //filter func
  const filterById = (arr1, arr2) => {
    const holdData = [];
    if (arr2.length === 0) {
      console.log(arr2, 'arr2');
      return toast.error('no data available!');
    }
    arr1
      .filter((e1) => {
        return arr2.some((e2) => {
          if (e1?.vendorId?._id === e2?.vendorId?._id) {
            console.log(e1, 'frm filterID');
            return e1;
          }
        });
      })
      .map((e) => {
        holdData.push(e);
        setData(holdData);
      });
    console.log(holdData, 'hold');
    if (arr2.length > 0) {
      // setDataToRender(venderBills);
    }
  };
  //filter func

  useEffect(() => {
    if (timeName != 'Default') {
      filterById(reInsertData, dataToRender);
    }
  }, [dataToRender]);
  //this time range

  const columns = [
    {
      title: 'Sr No',
      dataIndex: 'sNo',
      align: 'center',
    },
    {
      title: 'Vendor',
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
      title: 'Billed Amount',
      dataIndex: 'total',
      align: 'center',
    },
    {
      title: 'Amount Paid',
      dataIndex: 'amountPaid',
      align: 'center',
    },
    {
      title: 'Closing Balance',
      dataIndex: 'sNo',
      render: (text, record) => (
        <span>{record?.total - record?.amountPaid}</span>
      ),
      align: 'center',
    },
  ];

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Vendor Balance Summary</title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Vendor Balance Summary</h3>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <div className="stats-info">
              <h6>Total Bill Amount</h6>
              <h4>₹ {data?.reduce((acc, curr) => acc + curr?.total, 0)}</h4>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stats-info">
              <h6>Total Amount Paid</h6>
              <h4>
                ₹ {data?.reduce((acc, curr) => acc + curr?.amountPaid, 0)}
              </h4>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stats-info">
              <h6>Total Closing Balance </h6>
              <h4>
                ₹{' '}
                {data?.reduce((acc, curr) => {
                  let colsingBal = curr?.total - curr?.amountPaid;
                  return acc + colsingBal;
                }, 0)}
              </h4>
            </div>
          </div>
        </div>
        <div className="d-flex">
          {/* Search Filter */}
          <div className="row filter-row">
            <div className="col-sm-6 col-md-6">
              <div className="form-group form-focus select-focus">
                <div>
                  <input
                    className="form-control floating w-auto "
                    type="text"
                    onChange={(e) => filterCustomerName(e)}
                  />
                </div>
                <label className="focus-label">Vendor Name</label>
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
          {/* /Search Filter */}
        </div>
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
                dataSource={data}
                rowKey={(record) => record.id}
                // onChange={this.handleTableChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorBalanceSum;
