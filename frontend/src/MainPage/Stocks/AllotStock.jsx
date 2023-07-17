import { Delete } from '@mui/icons-material'
import { Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import httpService from '../../lib/httpService'
import { itemRender, onShowSizeChange } from '../paginationfunction'

const AllotStock = () => {

  const [ splitStocks, setSplitStocks ] = useState([]);

  const fetchSplitStocks = async () => {
    const res = await httpService.get(`/stock/splitStock`);
    
    const resData = res.data.reverse().map((s, index) => {
      let ups = { ...s, sNo : index+1 }
      return ups
    });
    setSplitStocks([ ...resData ]);
  }

  const handleDelete = async (id) => {
    await httpService.delete(`/stock/splitStock/${id}`);
    await fetchSplitStocks();
  }

  useEffect(() => {
    fetchSplitStocks();
  }, []);

  const columns = [
    {
      title: 'Sr No',
      dataIndex: 'sNo',
      align: 'center',
    },
    {
      title: 'Date',
      dataIndex: 'splitStockdate',
      align: 'center',
      render: (text, record) => <span>{text?.split("T")[0]}</span>
    },
    {
      title: 'Split Stock No',
      dataIndex: 'splitStockNo',
      align: 'center',
      render: (text, record) => <span>{text}</span>
    },
    {
      title: 'Item Details',
      dataIndex: 'stockId',
      align: 'center',
      render: (text, record) => <span>{record?.stockId?.itemDetails}</span>
    },
    // {
    //   title: 'Total Quantity',
    //   dataIndex: 'stockId',
    //   align: 'center',
    //   render: (text, record) => <span>{record?.stockId?.quantity}</span>
    // },
    {
      title: 'Allocated Quantity',
      dataIndex: 'usedQuantity',
      align: 'center',
    },
    {
      title: 'Purpose',
      dataIndex: 'purpose',
      align: 'center',
    },
    {
      title: 'Project',
      dataIndex: 'projectId',
      align: 'center',
      render: (text, record) => <span><Link to={`/app/projects/projects-view/${record?.projectId?._id}`}>{record?.projectId?.name}</Link></span>
    },
    {
      title: 'VENDOR NAME',
      dataIndex: 'vendorId',
      render: (vendorId) => <span key={vendorId?._id}> <Link to={`/app/profile/vendor-profile/${vendorId?._id}`}>{vendorId?.name}</Link></span>,
      align: 'center',
    },
    {
      title: 'Delete',
      dataIndex: 'stockNo',
      align: 'center',
      render: (text, record) => <span key={record?._id}><Delete onClick={() => handleDelete(record?._id)} /></span>,
    },
    
  ]

  return (
    <div className="page-wrapper"> 
      <Helmet>
        <title>Alloted Stock List</title>
        <meta name="description" content="Alloted Stock List" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col">
              <h3 className="page-title">Alloted Stock List</h3>
            </div>
            <div className="col-auto float-right ml-auto">
              <Link
                to={"/app/stock/splitstock"}
                className="btn add-btn"
              >
                <i className="fa fa-plus" /> Split Stocks
              </Link>
            </div>
            
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive">
              <Table
                className="table-striped"
                pagination={{
                  total: splitStocks?.length,
                  showTotal: (total, range) =>
                    `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                  showSizeChanger: true,
                  onShowSizeChange: onShowSizeChange,
                  itemRender: itemRender,
                }}
                style={{ overflowX: 'auto' }}
                columns={columns}
                // bordered
                dataSource={splitStocks}
                rowKey={(record) => record._id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllotStock