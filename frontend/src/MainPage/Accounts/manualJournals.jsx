import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Dropdown, Table } from 'antd';
import 'antd/dist/antd.css';
import { itemRender, onShowSizeChange } from '../paginationfunction';
import '../antdstyle.css';
import { fetchPayment } from '../../lib/api';
import { Checkbox, MenuItem, Select } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// import { columns } from './generalLedger';
import { getLedgers } from '../../features/account/accountSlice';
import ModelGeneralLedger from './ModelGeneralLedger';


const ManualJournals = ({ match }) => {

  const dispatch = useDispatch();

  const { accounts} = useSelector(state => state.account);

  useEffect(() => {
    dispatch(getLedgers());
  }, [])

  const dat = accounts.filter(trx => trx.journalType === "manual");

  const data = dat.map((v, i) => ({
    ...v,
    id: i + 1,
  }))

  // console.log(data);
  
  const columns = [
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
  
  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Manual Journals </title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Manual Journals</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Manual Journals</li>
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

        {/* <div>
          {data.map((a) => {
            return (<div><span>{a.journalId}</span>
              <span>
                <Link to={`${match.url}/${a.clientName?.userId}/transaction`}>
                  {a.clientName?.name}
                </Link>
              </span>
            </div>)
          })}
        </div> */}
            
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

export default ManualJournals;
