import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Table } from 'antd';
import { Link } from 'react-router-dom'
import { itemRender, onShowSizeChange } from '../paginationfunction';
import httpService from '../../lib/httpService';
import { useEffect } from 'react';

const TransferStock = () => {

  const [ transferStock, setTransferStock ] = useState([]);

  const fetchTransferStocks = async () => {
    const res = await httpService.get(`/stock/transtock`);
    const resData = res.data.reverse().map((tsk, index) => {
      let utks = { ...tsk, sNo : index+1 }
      return utks;
    });
    setTransferStock([ ...resData ]);
  }

  const [ qItem, setqItem ] = useState("");
  const [ qprojectFrom, setqprojectFrom ] = useState("");
  const [ qprojectTo, setqprojectTo ] = useState("");

  function search(data) {

    return data
      .filter(row => row?.stockId?.itemDetails.toLowerCase().indexOf(qItem) > -1)
      .filter(r => r.projectFrom?.name?.toLowerCase().indexOf(qprojectFrom) > -1)
      .filter(c => c.projectTo?.name?.toLowerCase().indexOf(qprojectTo) > -1);
  }

  console.log({ transferStock });

  useEffect(() => {
    fetchTransferStocks();
  }, []);

  const columns = [
    {
      title: 'Sr No',
      dataIndex: 'sNo',
      align: 'center',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      align: 'center',
      render: (text, record) => <span>{text?.split("T")[0]}</span>
    },
    {
      title: 'Item Details',
      dataIndex: 'itemDetails',
      align: 'center',
      render: (text, record) => <span>{record?.stockId?.itemDetails}</span>
    },
    {
      title: 'Transfer Quantity',
      dataIndex: 'transferQuantity',
      align: 'center',
      render: (text, record) => <span>{text}</span>
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      align: 'center',
    },
    {
      title: 'Transfer From',
      dataIndex: 'projectFrom',
      align: 'center',
      render: (text, record) => <span><Link to={`/app/projects/projects-view/${record?.projectFrom?._id}`}>{record?.projectFrom?.name}</Link></span>
    },
    {
      title: 'Transfer To',
      dataIndex: 'projectTo',
      align: 'center',
      render: (text, record) => <span><Link to={`/app/projects/projects-view/${record?.projectTo?._id}`}>{record?.projectTo?.name}</Link></span>
    },

  ]

  return (
    <div className="page-wrapper"> 
      <Helmet>
        <title>Stocks List</title>
        <meta name="description" content="Stocks List" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col">
              <h3 className="page-title">Transfer Stocks</h3>
            </div>
            
          </div>
        </div>
        {/* Search Filter */}
        <div className="row filter-row justify-content-between">
            <div className="col-sm-6 col-md-6">
              <div className="form-group form-focus focused">
                <input
                  type="text"
                  style={{
                    padding: '10px',
                  }}
                  placeholder={'Search by Item'}
                  className="form-control"
                  value={qItem}
                  onChange={(e) => setqItem(e.target.value)}
                />
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="form-group form-focus focused">
                <input
                  type="text"
                  style={{
                    padding: '8px',
                  }}
                  placeholder={'Search Transfer From'}
                  className="form-control"
                  value={qprojectFrom}
                  onChange={(e) => setqprojectFrom(e.target.value)}
                />
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="form-group form-focus focused">
                <input
                  type="email"
                  style={{
                    padding: '10px',
                  }}
                  placeholder={'Search Transfer To'}
                  className="form-control"
                  value={qprojectTo}
                  onChange={(e) => setqprojectTo(e.target.value)}
                />
              </div>
            </div>
            
            {/* <div className="col-sm-6 col-md-3" style={{ visibility: "hidden" }}>
              <a href="#" className="btn btn-success btn-block">
                {' '}
                Search{' '}
              </a>
            </div> */}
          </div>
        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive">
              <Table
                className="table-striped"
                pagination={{
                  total: transferStock?.length,
                  showTotal: (total, range) =>
                    `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                  showSizeChanger: true,
                  onShowSizeChange: onShowSizeChange,
                  itemRender: itemRender,
                }}
                style={{ overflowX: 'auto' }}
                columns={columns}
                // bordered
                dataSource={search(transferStock)}
                rowKey={(record) => record._id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransferStock