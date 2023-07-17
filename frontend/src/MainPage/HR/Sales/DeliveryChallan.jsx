import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';

import { Table } from 'antd';
import 'antd/dist/antd.css';
import { itemRender, onShowSizeChange } from '../../paginationfunction';
import '../../antdstyle.css';
import httpService from '../../../lib/httpService';

const DeliveryChallan = () => {
  const [data, setData] = useState([{}]);
  const [challanToEdit, setChallanToEdit] = useState();
  const [dataToRender, setDataToRender] = useState([{}]);  
  const { state } = useLocation()
  
  useEffect(async () => {
    if (state?.customerId) {
      const res = await httpService.get(`/customer/challans/${state?.customerId}`);
      setData(res.data);
      const deliveryChallans = [...res.data];
      setDataToRender(deliveryChallans);
      return;
    }
    const res = await httpService.get('/deliverychallan');
    setData(res.data);
    console.log(res.data);
    const deliveryChallans = [...res.data]  
    setDataToRender(deliveryChallans);
  }, []);
  const filterDate = (e) => {
    if (e.target.value === '') {
      setDataToRender([...data]);
      return;
    }
    const date = new Date(e.target.value);
    setDataToRender((dataToRender) =>
      dataToRender.filter(
        (data) => new Date(data.challanDate?.split('T')[0]) > date
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
        (data) => new Date(data.challanDate?.split('T')[0]) < date
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
          ?.includes(e.target.value.toLowerCase())
      )
    );
  };

  const filterChallan = (e) => {
    if (e.target.value === '') {
      setDataToRender([...data]);
      return;
    }
    setDataToRender((dataToRender) =>
      dataToRender.filter((data, i) =>
        data.deliveryChallan?.includes(e.target.value)
      )
    );
  };

  const handleDelete = async () => {
    await httpService.delete(`/deliveryChallan/${challanToEdit._id}`);
    setData(data.filter((challan) => challan._id !== challanToEdit._id));
    setDataToRender(
      data.filter((challan) => challan._id !== challanToEdit._id)
    );
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
  const columns = [
    {
      title: 'Date',
      dataIndex: 'challanDate',
      render: (text, record) => (
        <span>{record?.challanDate?.split('T')[0]}</span>
      ),
      sorter: (a, b) => a.challanDate.length - b.challanDate.length,
    },
    {
      title: 'Delivery Challan#',
      dataIndex: 'deliveryChallan',
      render: (text, record) => (
        <Link to={`/app/sales/deliverychallan-info/${record._id}`}>{text}</Link>
      ),
      sorter: (a, b) => a.deliveryChallan.length - b.deliveryChallan.length,
    },
    {
      title: 'Reference#',
      dataIndex: 'reference',
      sorter: (a, b) => a.reference.length - b.reference.length,
    },
    {
      title: 'Customer Name',
      dataIndex: 'customer',
      render: (text, record) => <span>{record?.customer?.displayName}</span>,
      sorter: (a, b) =>
        a.customer.displayName.length - b.customer.displayName.length,
    },
    // add status
    // add isInvoiced
    {
      title: 'Amount',
      dataIndex: 'grandTotal',
      render: (text, record) => <span>₹ {text}</span>,
      sorter: (a, b) => a.grandTotal.length - b.grandTotal.length,
    },
    {
      title: 'Action',
      render: (text, record) => (
        <div className="dropdown dropdown-action text-right">
          <a
            href="#"
            className="action-icon dropdown-toggle"
            data-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="material-icons">more_vert</i>
          </a>
          <div className="dropdown-menu dropdown-menu-right">
            <Link
              className="dropdown-item"
              to={{
                pathname: '/app/sales/createdeliverychallan',
                state: { ...record, edit: true },
              }}
            >
              <i className="fa fa-pencil m-r-5" /> Edit
            </Link>
            <a
              className="dropdown-item"
              href="#"
              data-toggle="modal"
              data-target="#delete_estimate"
              onClick={(e) => {
                setChallanToEdit(record);
              }}
            >
              <i className="fa fa-trash-o m-r-5" /> Delete
            </a>
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Delivery Challan </title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Delivery Challan</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Delivery Challan</li>
              </ul>
            </div>
            <div className="col-auto float-right ml-auto">
              <Link
                to="/app/sales/createdeliverychallan"
                className="btn add-btn"
              >
                <i className="fa fa-plus" /> New
              </Link>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        {/* Search Filter */}
        <div className="row filter-row">
          <div className="col-sm-6 col-md-3">
            <div className="form-group form-focus select-focus">
              <div>
                <input
                  className="form-control floating"
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
                  placeholder="Delivery Challan"
                  className="form-control floating"
                  type="text"
                  onChange={(e) => filterChallan(e)}
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
      </div>
      {/* /Page Content */}
      {/* Delete Estimate Modal */}
      <div
        className="modal custom-modal fade"
        id="delete_estimate"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete Estimate</h3>
                <p>Are you sure want to delete?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete();
                      }}
                      href=""
                      className="btn btn-primary continue-btn"
                    >
                      Delete
                    </a>
                  </div>
                  <div className="col-6">
                    <a
                      href=""
                      data-dismiss="modal"
                      className="btn btn-primary cancel-btn"
                    >
                      Cancel
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Delete Estimate Modal */}
    </div>
  );
};

export default DeliveryChallan;
