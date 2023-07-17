import { Delete } from '@mui/icons-material';
import { Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import httpService from '../../lib/httpService';
import { itemRender, onShowSizeChange } from '../paginationfunction';

const StockList = () => {

  const [stocks, setstocks] = useState([]);

  const fetchStocks = async () => {
    const res = await httpService.get("/stock");
    const resData = res.data.reverse().map((s, index) => {
      let ups = { ...s, sNo : index+1 }
      return ups
    });
    setstocks([ ...resData ]);
  }

  const handleDelete = async(id) => {
    await httpService.delete(`/stock/${id}`);
    await fetchStocks();
  }

  const [ qItem, setqItem ] = useState("");
  const [ qVendor, setqVendor ] = useState("");
  const [ qProject, setqProject ] = useState("");

  function search(data) {
    
    return data
      .filter(row => row.itemDetails.toLowerCase().indexOf(qItem) > -1)
      .filter(r => r.vendorId?.name.toLowerCase().indexOf(qVendor) > -1)
      .filter(c => c.projectId?.name.toLowerCase().indexOf(qProject) > -1);
  }

  // console.log({stocks});

  useEffect(() => {
    fetchStocks();
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
      title: 'Stock No',
      dataIndex: 'stockNo',
      align: 'center',
      // render: (text, record) => <span><Link to={`/app/stock/stockinfo/${record._id}`}>{text}</Link></span>
    },
    {
      title: 'Item Details',
      dataIndex: 'itemDetails',
      align: 'center',
      render: (text, record) => <span>{text}</span>
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      align: 'center',
    },
    {
      title: 'Left Quantity',
      dataIndex: 'leftQuantity',
      align: 'center',
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      align: 'center',
    },
    {
      title: 'Vendor',
      dataIndex: 'vendorId',
      render: (vendorId) =>  <span key={vendorId?._id}> <Link to={`/app/profile/vendor-profile/${vendorId?._id}`}>{vendorId?.name}</Link></span>,
      align: 'center',
    },
    {
      title: 'Project',
      dataIndex: 'projectId',
      render: (projectId) =>  <span key={projectId?._id}> <Link to={`/app/projects/projects-view/${projectId?._id}`}>{projectId?.name}</Link></span>,
      align: 'center',
    },
    // {
    //   title: 'Delete',
    //   dataIndex: 'stockNo',
    //   align: 'center',
    //   render: (text, record) => <span key={record?._id}><Delete onClick={() => handleDelete(record?._id)} /></span>,
    // },
    
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
              <h3 className="page-title">Stocks List</h3>
            </div>
            {/* <div className="col-auto float-right ml-auto">
              <Link
                to={"/app/stock/addstock"}
                className="btn add-btn"
              >
                <i className="fa fa-plus" /> Add Stocks
              </Link>
            </div> */}
            {/* <div className="col-auto float-right ml-auto">
              <Link
                to={"/app/stock/addbilledstock"}
                className="btn add-btn"
              >
                <i className="fa fa-plus" /> Add Billed Stocks
              </Link>
            </div> */}
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
                  placeholder={'Search by Vendor'}
                  className="form-control"
                  value={qVendor}
                  onChange={(e) => setqVendor(e.target.value)}
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
                  placeholder={'Search by Project'}
                  className="form-control"
                  value={qProject}
                  onChange={(e) => setqProject(e.target.value)}
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
                  total: stocks?.length,
                  showTotal: (total, range) =>
                    `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                  showSizeChanger: true,
                  onShowSizeChange: onShowSizeChange,
                  itemRender: itemRender,
                }}
                style={{ overflowX: 'auto' }}
                columns={columns}
                // bordered
                dataSource={search(stocks)}
                rowKey={(record) => record._id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StockList