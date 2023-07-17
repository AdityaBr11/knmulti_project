import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Table } from 'antd';
import 'antd/dist/antd.css';
import { itemRender, onShowSizeChange } from '../paginationfunction';
import '../antdstyle.css';
import { fetchPayment } from '../../lib/api';
import { useDispatch, useSelector } from 'react-redux';
import { getLedgers, reset } from '../../features/account/accountSlice';
import ModelGeneralLedger from './ModelGeneralLedger';

export const columns = [
  {
    title: '#',
    dataIndex: 'id',
    sorter: (a, b) => a.id.length - b.id.length,
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    render: (text, record) => <span>{text.split('T')[0]}</span>,
  },
  {
    title: 'Journal Id',
    dataIndex: 'journalId',
    render: (text, record) => (<Link to={`/app/accounts/ledger-info/${record._id}`}>
    {text}</Link>),
  },
  {
    title: 'Journal Type',
    dataIndex: 'journalType',
  },
  {
    title: 'Category',
    dataIndex: 'category',
  },
  {
    title: 'Name',
    dataIndex: 'clientName',
    render: (clientName) => (<Link to={`/app/accounts/manual-journals/${clientName.userId}`}>
      {clientName?.name}</Link>),
  },
  {
    title: 'referenceId',
    dataIndex: 'referenceId',
  },
  {
    title: 'Currency',
    dataIndex: 'currency',
  },
  {
    title: 'Net Balance',
    dataIndex: 'total',
    render: (text, record) => <span>₹ {text}</span>,
  }
];

const GeneralLedger = () => {
    
  const dispatch = useDispatch();
  
  const { accounts, isLoading, isSuccess} = useSelector((state) => state.account);

  const data = accounts.map((v, i) => ({
    ...v,
    id: i + 1,
  }))

  useEffect(() => {
    dispatch(getLedgers());

    // return () => {
    //   dispatch(reset());
    // }
  }, []);


  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Customer Ledger</title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Ledgers</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Ledgers</li>
              </ul>
            </div>
            <div className="col-auto float-right ml-auto">
              <Link
                to="/app/accounts/add-general-ledger"
                className="btn add-btn"
              >
                <i className="fa fa-plus" /> Add Ledger
              </Link>
            </div>
          </div>
        </div>
        {/* Modal  */}
        {/* <ModelGeneralLedger /> */}
        {/* /Page Header */}
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
      {/* /Page Content */}
    </div>
  );
};

export default GeneralLedger;
