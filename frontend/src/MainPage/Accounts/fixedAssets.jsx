import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Table } from 'antd';
import 'antd/dist/antd.css';
import { itemRender, onShowSizeChange } from '../paginationfunction';
import '../antdstyle.css';
import { useDispatch, useSelector } from 'react-redux';
import { columns } from './generalLedger';
import { getLedgers } from '../../features/account/accountSlice';
import ModelGeneralLedger from './ModelGeneralLedger';

const FixedAssets = () => {

  const dispatch = useDispatch();

  const { accounts} = useSelector(state => state.account);

  useEffect(() => {
    dispatch(getLedgers());
  }, [])

  const dat = accounts.filter(trx => trx.journalType === "fixed");

  const data = dat.map((v, i) => ({
    ...v,
    id: i + 1,
  }))
  

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Fixed Assets</title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Assets</h3>
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

export default FixedAssets;
