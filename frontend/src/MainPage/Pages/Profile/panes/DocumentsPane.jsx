import { Table } from 'antd';
import 'antd/dist/antd.css';
import React from 'react';
import { itemRender, onShowSizeChange } from '../../../paginationfunction';

const DocumentsPane = ({ documents }) => {
  if (!documents) return null;
  const { uploads } = documents;

  const columns = [
    {
      title: 'Description',
      render: (text, record) => (
        <>{String(record?.description).substring(0, 25)}</>
      ),
    },
    {
      title: 'Document',
      dataIndex: 'data',
      render: (text, record) => (
        <>
          <a href={text}>Click to view/download</a>
          {/* <iframe src={text}>Click to view/download</iframe> */}
        </>
      ),
    },
    {
      title: 'Uploaded On',
      dataIndex: 'uploadedAt',
      render: (text, record) => (
        <>
          {new Date(text).toLocaleDateString()} -{' '}
          {new Date(text).toLocaleTimeString()}
        </>
      ),
    },
  ];

  return (
    <div>
      {/* <ul>
        {uploads?.map((doc, index) => (
          <li key={index}>{doc?.data}</li>
        ))}
      </ul> */}
      <div className="row">
        <div className="col-md-12">
          <div className="table-responsive">
            <Table
              className="table-striped"
              pagination={{
                total: uploads.length,
                showTotal: (total, range) =>
                  `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                showSizeChanger: true,
                onShowSizeChange: onShowSizeChange,
                itemRender: itemRender,
              }}
              style={{ overflowX: 'auto' }}
              columns={columns}
              // bordered
              dataSource={uploads}
              rowKey={(record) => record.data}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPane;
