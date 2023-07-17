import { Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import httpService from '../../../../lib/httpService';
import { itemRender, onShowSizeChange } from '../../../paginationfunction';

const VendorBillView = () => {
  const { id } = useParams();

  const [ vendorBillData, setVendorBillData ] = useState([]);

  useEffect(() => {
    toast
      .promise(
        httpService.get(`/vendortrx/getvendorbills?vendorId=${id}`),
        {
          error: 'Failed to fetch vendor bills',
          success: 'Bills fetch successfully',
          pending: 'fetching vendor bill...',
        }
      )
      .then((res) => setVendorBillData(res.data));
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }, []);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'billDate',
      render: (billDate) => <span>{billDate?.split("T")[0]}</span>,
    },
    {
      title: 'Bill#',
      dataIndex: 'billNo',
    },
    {
      title: 'Order No',
      dataIndex: 'orderNo',
    },
    {
      title: 'Project',
      dataIndex: 'projectId',
      render: (projectId) => <span key={projectId?._id}>{projectId?.name}</span>,
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendorId',
      render: (vendorId) => <span key={vendorId?._id}>{vendorId?.name}</span>,
    },
    {
      title: 'Amount',
      dataIndex: 'total',
    },
    {
      title: 'Balance Due',
      dataIndex: 'balanceDue',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
  ]

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Vendor Bill</title>
        <meta name="description" content="vendor bill" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col">
              <h3 className="page-title">Vendor Bill</h3>
              
            </div>
            <div className="col-auto float-right ml-auto">
              <Link
                to="/app/purchase/addbill"
                className="btn add-btn"
              >
                <i className="fa fa-plus" /> Add New Bill
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
                  total: vendorBillData?.length,
                  showTotal: (total, range) =>
                    `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                  showSizeChanger: true,
                  onShowSizeChange: onShowSizeChange,
                  itemRender: itemRender,
                }}
                style={{ overflowX: 'auto' }}
                columns={columns}
                // bordered
                dataSource={vendorBillData}
                rowKey={(record) => record.id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorBillView