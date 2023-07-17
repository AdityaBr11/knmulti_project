import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useParams } from 'react-router-dom'
import 'antd/dist/antd.css';
import '../antdstyle.css';
import { Table } from 'antd';
import { itemRender, onShowSizeChange } from '../paginationfunction';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactionByUserId } from '../../features/account/accountSlice';

const UserTransect = () => {
  // name ref wid crid
  const dispatch = useDispatch();
  const { clientId } = useParams();

  const { userTrx } = useSelector((state) => state.account);

  

  const dat = userTrx.map((t) => t.transaction).flat();

  let totalAmount = dat.reduce((previousValue, currentValue) => {
    let amount = currentValue.credits ? previousValue + currentValue.credits : previousValue - currentValue.debits;
    return amount;
  }, 0);

  const data = dat.map((v, i) => ({
    ...v,
    id: i + 1,
  }))

  // console.log(totalAmount);

  // const data = userTrx;

  useEffect(() => {
    // if(clientId){
      dispatch(getTransactionByUserId(clientId));
    // }
  }, []);


  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      sorter: (a, b) => a.id.length - b.id.length,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      render: (date) => (<span>{date?.split("T")[0]}</span>),
    },
    {
      title: 'Particulars',
      dataIndex: 'description',
      render: (description) => (<span>{description}</span>),
    },
    // {
    //   title: 'Contact',
    //   dataIndex: 'contact',
    //   render: (contact) => (<span>{contact}</span>),
    // },
    {
      title: 'Debits',
      dataIndex: 'debits',
      render: (debits) => (<span>{debits}</span>),
    },
    {
      title: 'Credits',
      dataIndex: 'credits',
      render: (credits) => (<span>{credits}</span>),
    },
    
  ]

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Payments </title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
      {/* Page Header */}
        <div className="page-header">
            <div className="row align-items-center">
              <div className="col">
                <h3 className="page-title">Name : {userTrx[0]?.clientName?.name}</h3>
                <h4 className="page-title" style={{ fontSize: "1rem" }}>Total Amount : {totalAmount}</h4>
                {/* <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/app/main/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Payments</li>
                </ul> */}
              </div>
            </div>
        </div>
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
  )
}

export default UserTransect