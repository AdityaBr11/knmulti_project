import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { Helmet } from 'react-helmet';
import { itemRender, onShowSizeChange } from '../../paginationfunction';
import httpService from '../../../lib/httpService';
import { Link } from 'react-router-dom';

const VendorCreditSummary = () => {
  const [data, setData] = useState([]);
  const [reInsertData, setReInsertData] = useState();

  const fetchVCredit = async () => {
    const res = await httpService.get('/reportdata/vcreditsum');

    const resData = res.data.map((r, index) => {
      let upr = { ...r, sNo: index + 1 };
      return upr;
    });
    setData(resData);
    setReInsertData(resData);
  };

  useEffect(() => {
    fetchVCredit();
  }, []);

  console.log({ data });
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
      title: 'Total Credit',
      dataIndex: 'total',
      align: 'center',
    },
    {
      title: 'Credit Used',
      dataIndex: 'creditUsed',
      align: 'center',
    },
    {
      title: 'Credit Balance',
      dataIndex: 'creditBalance',
      align: 'center',
    },
  ];

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Vendor Credit Summary</title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Vendor Credit Summary</h3>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <div className="stats-info">
              <h6>Total Credit</h6>
              <h4>₹ {data?.reduce((acc, curr) => acc + curr?.total, 0)}</h4>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stats-info">
              <h6>Total Credit Used</h6>
              <h4>
                ₹ {data?.reduce((acc, curr) => acc + curr?.creditUsed, 0)}
              </h4>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stats-info">
              <h6>Total Credit Balance</h6>
              <h4>
                ₹ {data?.reduce((acc, curr) => acc + curr?.creditBalance, 0)}
              </h4>
            </div>
          </div>
        </div>
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
        {/* /Search Filter */}
        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive">
              <Table
                className="table-striped"
                pagination={{
                  total: data.length,
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

export default VendorCreditSummary;
