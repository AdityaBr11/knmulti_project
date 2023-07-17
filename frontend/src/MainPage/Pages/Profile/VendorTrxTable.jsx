import React from 'react'
import { Table } from 'antd';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { itemRender, onShowSizeChange } from '../../paginationfunction';

const VendorTrxTable = () => {

  const { userTrx } = useSelector((state) => state.account);

  const dat = userTrx.map((t) => t.transaction).flat();

  const data = dat.map((v, i) => ({
    ...v,
    id: i + 1,
  }))

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      sorter: (a, b) => a.id.length - b.id.length,
    },
    {
      title: 'Account',
      dataIndex: 'account',
      render: (account) => (<span>{account}</span>),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      render: (description) => (<span>{description}</span>),
    },
    {
      title: 'Contact',
      dataIndex: 'contact',
      render: (contact) => (<span>{contact}</span>),
    },
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
  )
}

export default VendorTrxTable