import React, { useEffect, useState } from 'react'
import { Table } from 'antd';
import { itemRender, onShowSizeChange } from '../../paginationfunction';
import httpService from '../../../lib/httpService';
import { useParams } from 'react-router-dom';

const VendorProjectTable = ({ vendor }) => {

  // let { id } = useParams();

  // const [ vendor, setVendor ] = useState();

  // async function fetchApi() {
  //   const res = await httpService.get('/vendor/' + id);
  //   setVendor(res.data);
  // }

  // useEffect(() => {
  //   fetchApi()
  // }, []);


  const data = vendor?.projectList?.map((v, i) => ({
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
      title: 'Name',
      dataIndex: 'name',
      render: (name) => (<span>{name}</span>),
    },
    {
      title: 'Cost',
      dataIndex: 'costPerSqFeet',
      render: (costPerSqFeet) => (<span>{costPerSqFeet}</span>),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      render: (type) => (<span>{type}</span>),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => (<span>{status}</span>),
    },
    {
      title: 'View',
      dataIndex: 'status',
      render: (status) => (<button className='btn btn-primary'>view</button>),
    },
  ]

  console.log("v", vendor)

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

export default VendorProjectTable