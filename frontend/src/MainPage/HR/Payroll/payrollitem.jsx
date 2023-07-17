import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Table } from 'antd';
import 'antd/dist/antd.css';
import '../../antdstyle.css';
// import { LEAVE_STATES } from '../../model/shared/leaveStates';

import { itemRender, onShowSizeChange } from '../../paginationfunction';
import PayrollEditForm from './PayrollEditForm';
import PayrollView from './PayrollView';

import { Avatar_02, Avatar_10, Avatar_20 } from '../../../Entryfile/imagepath';
import PayrollForm from './PayrollForm';
import httpService from '../../../lib/httpService';
import { toast } from 'react-toastify';
import { LEAVE_STATES, PAYROLL_STATES } from '../../../model/shared/leaveStates';


const PayrollItems = () => {
  const [renderEdit, setRenderEdit] = useState(true);
  const [selectRender, setSelectRender] = useState('default');
  const [reInsertData, setReInsertData] = useState();
  const [data, setData] = useState([]);
  const [Payroll_status1, setPayroll_status] = useState();

  const [filterQueries, setFilterQueries] = useState({
    fromDate: '',
    toDate: '',
  });
  console.log(filterQueries, 'filterQueries..');

  console.log(selectRender, 'selectrndr');
  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }
  });

  const fetchEmpSalary = async () => {
    const res = await httpService.get(`/payroll`);
    console.log(res.data, 'payroll data');
    setData(res.data.reverse());
    setReInsertData(res.data);
  };

  const handleDelete = async (id) => {
    httpService.delete(`/payroll/${id}`).then(() => fetchEmpSalary());
  };

  useEffect(() => {
    fetchEmpSalary();
  }, []);

  const handleFilterQueryChange = (e) => {
    e.preventDefault();
    setFilterQueries({ ...filterQueries, [e.target.name]: e.target.value });
  };
  const handleLeaveStatusEdit = async (record, newStatus) => {
    console.log(record, newStatus, 'newStatus');
    // const Payroll_status45={
    //   Payroll_status:newStatus
    // }
    const Payroll_status45 = {
      Payroll_status: newStatus,

    };
    httpService.put(`/payroll/${record?._id}`, Payroll_status45).then(async (res) => {
      // history.goBack();
      console.log(res, newStatus, 'newStatus');
      const res1 = await httpService.get(`/payroll`);
      console.log(res1.data, 'payroll data');
      setData(res1.data.reverse());

    });



  };

  //filter by dates
  const onFilterClick = async (e) => {
    e.preventDefault();
    const res = await httpService.get(`/payroll`);
    let filteredData = [...res.data];
    console.log(filteredData, 'filteredData..');
    if (filterQueries?.fromDate) {
      filteredData = filteredData.filter(
        (fd) => fd?.fromDate?.split("T")[0] >= filterQueries?.fromDate
      );
    }
    if (filterQueries?.toDate) {
      filteredData = filteredData.filter(
        (fd) => fd?.toDate?.split('T')[0] <= filterQueries?.toDate
      );
    }

    if (!filteredData.length) {
      toast.warn('No Data Found related to the search');
    }
    let uniqueFilteredData = [];
    filteredData.forEach((c) => {
      if (!uniqueFilteredData.includes(c)) {
        uniqueFilteredData.push(c);
      }
    });
    setData(uniqueFilteredData);
  };

  //filter by names
  const filterCustomerName = (e) => {
    if (e.target.value === '') {
      setData(reInsertData);
      return;
    }
    setData((resData) =>
      resData.filter((data, i) =>
        data?.employeeId?.name
          ?.toLowerCase()
          ?.includes(e.target.value?.toLowerCase())
      )
    );
  };

  const columns = [
    {
      title: 'Employee',
      dataIndex: 'employeeId',
      render: (text, record) => (
        <h2 className="table-avatar">
          {/* <Link to={`/app/profile/employee-profile/${record._id}`}>
            <Avatar sx={{ bgcolor: red[400] }}>
              {record?.employeeId?.name?.substr(0, 1).toUpperCase()}
            </Avatar>
          </Link> */}
          <Link
            // onClick={(e) => {
            //   setRenderEdit(record?._id);
            //   setSelectRender('payrollView');
            // }}
            to={{ pathname: `/app/administrator/payroll-view`, state: { id: record?._id, payrollData: data, setSelectRender: 'payrollView' } }}
          >
            {record?.employeeId?.name}{' '}
            <span>{record?.employeeId?.jobRole?.name}</span>
          </Link>
        </h2>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
    },

    {
      title: 'From',
      dataIndex: 'fromDate',
      render: (text, record) => <span>{text?.split('T')[0]}</span>,
      sorter: (a, b) => a.fromDate.length - b.fromDate.length,
    },
    {
      title: 'To',
      dataIndex: 'toDate',
      render: (text, record) => <span>{text?.split('T')[0]}</span>,
      sorter: (a, b) => a.toDate.length - b.toDate.length,
    },

    {
      title: 'Amount',
      dataIndex: 'netSalary',
      sorter: (a, b) => a.reason.length - b.reason.length,
      render: (text, record) => (<span>{Math.round(text)}</span>)
    },
    {
      title: 'Payroll status',
      dataIndex: 'Payroll_status',
      sorter: (a, b) => a.reason.length - b.reason.length,
      render: (text, record) => (
        <div className="dropdown action-label text-center">
          {!record?.connfirm == '1' ? (
            <> {text || 'Pending'}{' '}</>
          ) : (
            <>
              {text == 'CREADIT' ? text :
                <a
                  className="btn btn-white btn-sm btn-rounded dropdown-toggle"
                  href="#"
                  data-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i
                    className={
                      text === 'CREADIT'
                        ? 'fa fa-dot-circle-o text-purple'
                        : text === 'PENDING'
                          ? 'fa fa-dot-circle-o text-danger'
                          : text === 'APPROVED'
                            ? 'fa fa-dot-circle-o text-success'
                            : 'fa fa-dot-circle-o text-danger'
                    }
                  />{' '}
                  {text || 'Pending'}{''}
                </a>
              }

              <div className="dropdown-menu dropdown-menu-right">
                {Object.keys(PAYROLL_STATES).map((state, index) => (
                  <span
                    key={index}
                    className="dropdown-item text-left"
                    onClick={() => {
                      handleLeaveStatusEdit(record, PAYROLL_STATES[state]);
                    }}
                  >
                    {String(state).toUpperCase()}
                  </span>
                ))}
              </div>
            </>)
          }

        </div>
      )
    },

    {
      title: 'Action',
      render: (text, record) => (

        <div className="row ">
          <div className='col-md-4'>

          </div>
          {/* <div className='col-md-2'>

          </div> */}
          <div className='col-md-2'>
            {record?.connfirm == '1' ? (
              <></>
            ) : (
              <>
                <Link
                  // onClick={() => {
                  //   setRenderEdit(record?._id);
                  //   setSelectRender('payrollEdit');
                  // }}
                  to={{ pathname: `/app/administrator/payroll-form`, state: { edit: true, payId: record?._id, record } }}
                  className="btn btn-info"
                // data-toggle="modal"
                // data-target="#edit_leave"
                >
                  <i className="fa fa-pencil  m-r-5" />
                </Link>
              </>
            )}
          </div>
          <div className='col-md-3'>
            <a
              className="btn btn-primary"
              href="#"
              data-toggle="modal"
              data-target="#delete_approve"
              onClick={() => handleDelete(record?._id)}
            >
              <i className="fa fa-trash-o m-r-5" />
            </a>
          </div>
          {/* <div className="dropdown dropdown-action text-right"> */}

          {/* <a
            href="#"
            className="action-icon dropdown-toggle"
            data-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="material-icons">more_vert</i>
          </a> */}
          {/* <div className="dropdown-menu dropdown-menu-right">
            {record?.connfirm == '1' ? (
              <></>
            ) : (
              <>
                <Link
                  // onClick={() => {
                  //   setRenderEdit(record?._id);
                  //   setSelectRender('payrollEdit');
                  // }}
                  to={{ pathname: `/app/administrator/payroll-form`, state: { edit: true, payId: record?._id, record } }}
                  className="dropdown-item"
                // data-toggle="modal"
                // data-target="#edit_leave"
                >
                  <i className="fa fa-pencil m-r-5" /> Edit
                </Link>
              </>
            )} */}
          {/* <Link
              // onClick={() => {
              //   setRenderEdit(record?._id);
              //   setSelectRender('payrollEdit');
              // }}
              to={{ pathname: `/app/administrator/payroll-form`, state: { edit : true, payId: record?._id, record } }}
              className="dropdown-item"
              // data-toggle="modal"
              // data-target="#edit_leave"
            >
              <i className="fa fa-pencil m-r-5" /> Edit
            </Link> */}

          {/* <a
              className="dropdown-item"
              href="#"
              data-toggle="modal"
              data-target="#delete_approve"
              onClick={() => handleDelete(record?._id)}
            >
              <i className="fa fa-trash-o m-r-5" /> Delete
            </a> */}
          {/* </div> */}
        </div>
      ),
    },
  ];

  return (
    <>
      {selectRender === 'default' ? (
        <>
          <div className="page-wrapper">
            <Helmet>
              <title>Payroll Items11 </title>
              <meta name="description" content="Login page" />
            </Helmet>
            {/* Page Content */}
            <div className="content container-fluid">
              {/* Page Header */}
              <div className="page-header">
                <div className="row align-items-center">
                  <div className="col">
                    <h3 className="page-title">Payroll Items</h3>
                    <ul className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Link to="/app/main/dashboard">Dashboard</Link>
                      </li>
                      <li className="breadcrumb-item active">Payroll Items</li>
                    </ul>
                  </div>
                  <div className="col-auto float-right ml-auto">
                    <Link
                      to={`/app/administrator/payroll-form`}
                      className="btn add-btn"
                    // data-toggle="modal"
                    // data-target="#add_payroll"
                    >
                      <i className="fa fa-plus" /> Add Payroll
                    </Link>
                  </div>
                </div>
              </div>
              {/* Search Filter */}
              <div className="row filter-row">
                <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
                  <div className="form-group form-focus focused">
                    <input
                      name="name"
                      type="text"
                      className="form-control floating"
                      onChange={(e) => filterCustomerName(e)}
                    />
                    <label className="focus-label">Candidate Name</label>
                  </div>
                </div>
                <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
                  <div className="form-group form-focus select-focus">
                    <input
                      name="fromDate"
                      className="form-control floating"
                      type="date"
                      value={filterQueries?.fromDate}
                      onChange={handleFilterQueryChange}
                    />
                    <label className="focus-label">From</label>
                  </div>
                </div>
                <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
                  <div className="form-group form-focus select-focus">
                    <input
                      name="toDate"
                      className="form-control floating"
                      type="date"
                      value={filterQueries?.toDate}
                      onChange={handleFilterQueryChange}
                    />
                    <label className="focus-label">To</label>
                  </div>
                </div>
                <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
                  <btn
                    className="btn btn-success btn-block"
                    onClick={onFilterClick}
                  >
                    Search
                  </btn>
                </div>
                <div className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12">
                  <btn
                    className="btn btn-danger btn-block"
                    onClick={(e) => {
                      fetchEmpSalary();
                      setFilterQueries({
                        ...filterQueries,
                        toDate: "",
                        fromDate: "",
                      });
                    }}
                  >
                    Reset
                  </btn>
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
                      onChange={console.log('chnage')}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* <div id="add_payroll" className="modal custom-modal fade" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Payroll</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <form>
              <div className="form-group">
                <label>
                  Employee Name <span className="text-danger">*</span>
                </label>
                <input className="form-control" />
              </div>
              <div className="form-group">
                <label>
                  From <span className="text-danger">*</span>
                </label>
                <div>
                  <input
                    className="form-control datetimepicker"
                    type="date"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>
                  To <span className="text-danger">*</span>
                </label>
                <div>
                  <input
                    className="form-control datetimepicker"
                    type="date"
                  />
                </div>
              </div>
             
              <div className="form-group">
                <label>
                  Amount <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  readOnly
                  defaultValue={5}
                  type="text"
                />
              </div>
              <div className="submit-section">
                <button className="btn btn-primary submit-btn">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div> */}
          </div>
        </>
      ) : selectRender === 'payrollView' ? (
        <PayrollView id={renderEdit} payrollData={data} setSelectRender={setSelectRender} />
      ) : selectRender === 'payrollEdit' ? (
        <PayrollEditForm id={renderEdit} payrollData={data} setSelectRender={setSelectRender} />
      ) : (
        <></>
      )}
    </>
  );
};

export default PayrollItems;
