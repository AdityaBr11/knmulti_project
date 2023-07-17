import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { Helmet } from 'react-helmet';
import { itemRender, onShowSizeChange } from '../../paginationfunction';
import httpService from '../../../lib/httpService';
import { Link } from 'react-router-dom';

const ProjectsReport = () => {
  const [data, setData] = useState([]);
  const [reInsertData, setReInsertData] = useState();

  const fetchPReport = async () => {
    const res = await httpService.get('/reportdata/allprojectsummary');

    const resData = res.data.map((r, index) => {
      let upr = { ...r, sNo: index + 1 };
      return upr;
    });
    setData(resData);
    setReInsertData(resData);
  };

  useEffect(() => {
    fetchPReport();
  }, []);

  console.log({ data });
  //filter
  const filterCustomerName = (e) => {
    if (e.target.value === '') {
      setData(reInsertData);
      return;
    }
    setData((resData) =>
      resData.filter((data, i) =>
        data?.projectName
          ?.toLowerCase()
          ?.includes(e.target.value?.toLowerCase())
      )
    );
  };

  const columns = [
    {
      title: 'Sr No',
      dataIndex: 'sNo',
      align: 'center',
    },
    {
      title: 'Project',
      dataIndex: 'projectId',
      render: (text, record) => (
        <span key={record?.projectId}>
          {' '}
          <Link to={`/app/projects/projects-view/${record?.projectId}`}>
            {record?.projectName}
          </Link>
        </span>
      ),
      align: 'center',
    },
    {
      title: 'Total Area',
      dataIndex: 'totalArea',
      align: 'center',
    },
    {
      title: 'Total Area Sold',
      dataIndex: 'totalAreaSold',
      align: 'center',
    },
    {
      title: 'Total Plots',
      dataIndex: 'totalPlots',
      align: 'center',
    },
    {
      title: 'Total Plots Sold',
      dataIndex: 'totalPlotsSoldOut',
      align: 'center',
    },
  ];

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Project Report</title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Project Report</h3>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-3">
            <div className="stats-info">
              <h6>Total Area</h6>
              <h4>
                {data?.reduce((acc, curr) => acc + curr?.totalArea, 0)}{' '}
                <span>Sq ft</span>
              </h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stats-info">
              <h6>Total Area Sold</h6>
              <h4>
                {data?.reduce((acc, curr) => acc + curr?.totalAreaSold, 0)}{' '}
                <span>Sq ft</span>
              </h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stats-info">
              <h6>Total Plots</h6>
              <h4>{data?.reduce((acc, curr) => acc + curr?.totalPlots, 0)}</h4>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stats-info">
              <h6>Total Plots Sold</h6>
              <h4>
                {data?.reduce((acc, curr) => acc + curr?.totalPlotsSoldOut, 0)}
              </h4>
            </div>
          </div>
        </div>
        {/* Search Filter */}
        <div className="row filter-row">
          <div className="col-sm-6 col-md-6">
            <div className="form-group form-focus select-focus">
              <div>
                <input
                  className="form-control floating w-auto "
                  type="text"
                  onChange={(e) => filterCustomerName(e)}
                />
              </div>
              <label className="focus-label">Vendor Name</label>
            </div>
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
                rowKey={(record) => record._id}
                // onChange={this.handleTableChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsReport;
