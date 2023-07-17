import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Avatar_03, Avatar_04 } from '../../../Entryfile/imagepath';

import { Table } from 'antd';
import 'antd/dist/antd.css';
import { itemRender, onShowSizeChange } from '../../paginationfunction';
import '../../antdstyle.css';
import httpService from '../../../lib/httpService';

const DailyReport = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const employees = await httpService.get('/employee');
    setData(
      employees.data.map((employee) => ({
        ...employee,
        key: employee._id,
        name: employee.firstName + ' ' + employee.lastName,
      }))
    );
  };

  const columns = [
    {
      title: 'Employee',
      dataIndex: 'name',
      render: (text, record) => (
        <h2 className="table-avatar">
          <Link to="/app/profile/employee-profile" className="avatar">
            <img alt="" src={record.image} />
          </Link>
          <Link to={`/app/administrator/activities/${record._id}`}>
            {text} <span>{record.number}</span>
          </Link>
        </h2>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: 'ID',
      dataIndex: '_id',
      sorter: (a, b) => a.date.length - b.date.length,
    },

    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.department.length - b.department.length,
    },
    {
      title: 'Mobile',
      dataIndex: 'mobileNo',
    },
  ];
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <Helmet>
          <title>Daily Report </title>
          <meta name="description" content="Login page" />
        </Helmet>
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col">
                <h3 className="page-title">Daily Report</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/app/main/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Daily Report</li>
                </ul>
              </div>
              <div className="col-auto">
                <a href="#" className="btn btn-primary">
                  PDF
                </a>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Content Starts */}
          <div className="row justify-content-center">
            <div className="col-md-3 col-sm-6">
              <div className="card">
                <div className="card-body text-center">
                  <h3>
                    <b>{data.length}</b>
                  </h3>
                  <p>Total Employees</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="card">
                <div className="card-body text-center">
                  <h3 className="text-success">
                    <b>{data.length}</b>
                  </h3>
                  <p>Today Present</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="card">
                <div className="card-body text-center">
                  <h3 className="text-danger">
                    <b>0</b>
                  </h3>
                  <p>Today Absent</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="card">
                <div className="card-body text-center">
                  <h3>
                    <b>0</b>
                  </h3>
                  <p>Today Left</p>
                </div>
              </div>
            </div>
          </div>
          {/* Search Filter */}
          <div className="row filter-row mb-4">
            <div className="col-sm-6 col-md-3">
              <div className="form-group form-focus focused">
                <input className="form-control floating" type="text" />
                <label className="focus-label">Employee</label>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="form-group form-focus select-focus">
                <div>
                  <input className="form-control floating" type="date" />
                </div>
                <label className="focus-label">From</label>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="form-group form-focus select-focus">
                <div>
                  <input className="form-control floating" type="date" />
                </div>
                <label className="focus-label">To</label>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <a href="#" className="btn btn-success btn-block">
                {' '}
                Search{' '}
              </a>
            </div>
          </div>
          {/* /Search Filter */}
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
                  //  onChange={this.handleTableChange}
                />
              </div>
            </div>
          </div>
          {/* /Content End */}
        </div>
        {/* /Page Content */}
      </div>
      {/* /Page Wrapper */}
    </>
  );
};

export default DailyReport;
