import { Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import httpService from '../../lib/httpService';
import { itemRender, onShowSizeChange } from '../paginationfunction';

const VendorBills = () => {
  const { search } = useLocation();

  const [vendorBillsData, setVendorBillsData] = useState([]);

  useEffect(() => {
    toast
      .promise(httpService.get(`/vendortrx/getvendorbills${search}`), {
        error: 'Failed to fetch vendor bills',
        success: 'Bills fetch successfully',
        pending: 'fetching vendor bill...',
      })
      .then((res) => setVendorBillsData(res.data.reverse()));
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }, []);

  // Search

  const [qbill, setqbill] = useState('');
  const [qproject, setqproject] = useState('');
  const [qvendor, setqvendor] = useState('');
  const [qdatefrom, setqdatefrom] = useState('');
  const [qdateto, setqdateto] = useState('');
  const [qdateby, setqdateby] = useState('billdateby');

  function searchTable(data) {
    let newData = data
      .filter(
        (row) => row.billNo.toLowerCase().indexOf(qbill.toLowerCase()) > -1
      )
      .filter(
        (r) =>
          r.projectId?.name.toLowerCase().indexOf(qproject.toLowerCase()) > -1
      )
      .filter(
        (c) =>
          c.vendorId?.name.toLowerCase().indexOf(qvendor.toLowerCase()) > -1
      );

    if (qdateby == 'duedateby') {
      newData = newData.filter((fd) => fd?.dueDate >= qdatefrom);
      if (qdateto !== '') {
        newData = newData.filter((fd) => fd?.dueDate?.split('T')[0] <= qdateto);
      }
    } else {
      newData = newData.filter((fd) => fd?.billDate >= qdatefrom);
      if (qdateto !== '') {
        newData = newData.filter(
          (fd) => fd?.billDate?.split('T')[0] <= qdateto
        );
      }
    }

    return newData;
  }

  const columns = [
    {
      title: 'DATE',
      dataIndex: 'billDate',
      align: 'center',
      render: (billDate) => <span>{billDate?.split('T')[0]}</span>,
    },
    {
      title: 'BILL#',
      dataIndex: 'billNo',
      align: 'center',
      render: (text, record) => (
        <span>
          <Link to={`/app/purchase/billinfo/${record._id}`}>{text}</Link>
        </span>
      ),
    },
    {
      title: 'REFERENCE NUMBER',
      dataIndex: 'orderNo',
      align: 'center',
    },
    {
      title: 'PROJECT',
      dataIndex: 'projectId',
      render: (projectId) => (
        <span key={projectId?._id}>
          <Link to={`/app/projects/projects-view/${projectId?._id}`}>
            {projectId?.name}
          </Link>
        </span>
      ),
    },
    {
      title: 'VENDOR NAME',
      dataIndex: 'vendorId',
      align: 'center',
      render: (vendorId) => (
        <span key={vendorId?._id}>
          {' '}
          <Link to={`/app/profile/vendor-profile/${vendorId?._id}`}>
            {vendorId?.name}
          </Link>
        </span>
      ),
    },
    {
      title: 'DUE DATE',
      dataIndex: 'dueDate',
      align: 'center',
      render: (dueDate) => <span>{dueDate?.split('T')[0]}</span>,
    },
    {
      title: 'AMOUNT',
      dataIndex: 'total',
      // align: 'center',
      render: (total) => <span>₹ {total}</span>,
    },
    {
      title: 'BALANCE DUE',
      dataIndex: 'balanceDue',
      // align: 'center',
      render: (balanceDue) => <span>₹ {balanceDue}</span>,
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      align: 'center',
      render: (status) => (
        <span 
          className={ status === 'PAID' ? 'badge bg-inverse-success' : status == 'PARTIAL' ? 'badge bg-inverse-warning' : 'badge bg-inverse-danger' } >
          {status}
        </span>
        // <span className={status == 'OPEN' ? 'text-primary' : 'text-success'}>
        //   {status}
        // </span>
      ),
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
              <h3 className="page-title">All Vendors Bills</h3>
            </div>
            <div className="col-auto float-right ml-auto">
              <Link to="/app/purchase/createbill" className="btn add-btn">
                <i className="fa fa-plus" /> Add New Bill
              </Link>
            </div>
          </div>
        </div>

        {/* Search Filter */}
        <div className="row filter-row justify-content-between">
          <div className="col-sm-3 col-md-2">
            <div className="form-group form-focus focused">
              <input
                type="text"
                className="form-control floating"
                value={qbill}
                onChange={(e) => setqbill(e.target.value)}
              />
              <label className="focus-label">Bill No</label>
            </div>
          </div>
          <div className="col-sm-3 col-md-2">
            <div className="form-group form-focus focused">
              <input
                type="text"
                className="form-control floating"
                value={qproject}
                onChange={(e) => setqproject(e.target.value)}
              />
              <label className="focus-label">Project</label>
            </div>
          </div>
          <div className="col-sm-3 col-md-2">
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
                value={qdateby}
                onChange={(e) => setqdateby(e.target.value)}
              >
                <option value="billdateby">Bill Date</option>
                <option value="duedateby">Due Date</option>
              </select>
              <label className="focus-label">Filter By</label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive">
              <Table
                className="table-striped"
                pagination={{
                  total: vendorBillsData?.length,
                  showTotal: (total, range) =>
                    `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                  showSizeChanger: true,
                  onShowSizeChange: onShowSizeChange,
                  itemRender: itemRender,
                }}
                style={{ overflowX: 'auto' }}
                columns={columns}
                // bordered
                dataSource={searchTable(vendorBillsData)}
                rowKey={(record) => record._id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorBills;
