import React, { useEffect, useState } from 'react'
import { Table } from 'antd';
import { Helmet } from 'react-helmet'
import { itemRender, onShowSizeChange } from '../../paginationfunction';
import httpService from '../../../lib/httpService';
import { Link } from 'react-router-dom';

const ProjectsBalSummary = () => {
  const [ data, setData ] = useState([]);
  const [reInsertData, setReInsertData] = useState();
  console.log(data,'data frm bill');

  const fetchPBalSum = async () => {
    const res = await httpService.get("/reportdata/pbalsummary");
    
    const resData = res.data.map((r, index) => {
      let upr = { ...r, sNo : index+1 }
      return upr
    });
    setData(resData);
    setReInsertData(resData);
  }

  useEffect(() => {
    fetchPBalSum();
  }, []);

  console.log({ data })
  //filter
  const filterCustomerName = (e) => {
    if (e.target.value === '') {
      setData(reInsertData);
      return;
    }
    setData((resData) =>
      resData.filter((data, i) =>
        data?.projectId?.name
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
      render: (projectId) =>  <span key={projectId?._id}> <Link to={`/app/projects/projects-view/${projectId?._id}`}>{projectId?.name}</Link></span>,
      align: 'center',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      align: 'center',
    },
    {
      title: 'Amount Paid',
      dataIndex: 'amountPaid',
      align: 'center',
    },
    {
      title: 'Closing Balance',
      dataIndex: 'balanceDue',
      align: 'center',
    },
  ];


  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Project Bill Report</title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Project Bill Report</h3>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <div className="stats-info">
              <h6>Total Bill Amount</h6>
              <h4>₹ {data?.reduce((acc, curr) => acc + curr?.total, 0)}</h4>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stats-info">
              <h6>Total Amount Paid</h6>
              <h4>
              ₹ {data?.reduce((acc, curr) => acc + curr?.amountPaid, 0)}
                
              </h4>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stats-info">
              <h6>Total Closing Balance </h6>
              <h4>
              ₹ {data?.reduce((acc, curr) => acc + curr?.balanceDue, 0)}
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

        {/* <div className="row">
        <div className="col-md-12">
          <div className="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th scope="col" className='text-center'>#</th>
                <th scope="col" className='text-center'>Total</th>
                <th scope="col" className='text-center'>{data?.reduce((acc, curr) => acc + curr?.total, 0)}</th>
                <th scope="col" className='text-center'>{data?.reduce((acc, curr) => acc + curr?.amountPaid, 0)}</th>
                <th scope="col" className='text-center'>{data?.reduce((acc, curr) => acc + curr?.balanceDue, 0)}</th>
                
              </tr>
            </thead>
          </table>
          </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default ProjectsBalSummary