import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useHistory } from 'react-router-dom';
import { Table } from 'antd';
import 'antd/dist/antd.css';
import { itemRender, onShowSizeChange } from '../paginationfunction';
import '../antdstyle.css';
import Avatar from '@mui/material/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import httpService from '../../lib/httpService';
import { allemployee } from '../../lib/api';
import { red } from '@mui/material/colors';
import { CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

const PlannedLeavesList = ({empId,setCurrentRender}) => {
  console.log(empId,'employee Id Pres');
  const history = useHistory();
  const [data, setData] = useState([]);
  const [_data, set_data] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [_employees, set_employees] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const fetched = useSelector((state) => state.employee.fetched);
  const employeesFromStore = useSelector((state) => state.employee.value);
  const dispatch = useDispatch();
  const [employeeToAdd, setEmployeeToAdd] = useState(null);
  const [employeeToModify, setEmployeeToModify] = useState(null);
  const [employeeIdToSearch, setEmployeeIdToSearch] = useState('');
  const [employeeNameToSearch, setEmployeeNameToSearch] = useState('');
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [ idToDelete, setIdToDelete ] = useState("");

  // for seach bar 
  const [ qName, setQName ] = useState("");
  const [ qEmail, setQEmail ] = useState("");
  const [ qRole, setQRole ] = useState("");

  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }
    fetchemployeeslist();
    fetchRolesAndDepartments();
  }, []);

const tempArr = [2,4,6,7];

  const fetchemployeeslist = async () => {
    const res = await allemployee();
    console.log(res,'all employee PresentL');
    setEmployees(
      res.filter((data)=>{
        return empId.includes(data._id);
      }).map((data) => ({
        ...data,
        name: data?.firstName + ' ' + data?.lastName,
        joindate: data?.joinDate?.split('T')[0],
        role: data?.jobRole?.name,
      }))
    );
    set_employees(res);
    setisLoading(false);
  };

  const fetchRolesAndDepartments = async () => {
    const roles = await httpService.get('/role');
    const departments = await httpService.get('/department');
    setRoles(roles?.data);
    setDepartments(departments?.data);
  };

  const handleSearch = () => {
    const filteredEmployees = _data.filter((data) => {
      if (employeeIdToSearch === '') {
        return data?.name
          .toLowerCase()
          .includes(employeeNameToSearch.toLowerCase());
      } else {
        return data?.userId.toString() === employeeIdToSearch;
      }
    });
    setData(filteredEmployees);
  };

  function search(data) {
    console.log(qRole);
    return data.filter(row => row.name.toLowerCase().indexOf(qName) > -1).filter(r => r.email.toLowerCase().indexOf(qEmail) > -1).filter(c => c.role.indexOf(qRole) > -1);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await httpService.put(
      `/private/user/${employeeToModify?.userId}`,
      employeeToModify
    );
    if (response.status === 200) {
      const newEmployee = response.data;
      setEmployees(
        employees.map((employee) => {
          if (employee?.userId === newEmployee?.userId) {
            return newEmployee;
          }
          return employee;
        })
      );
      document.querySelectorAll('.close')?.forEach((e) => e.click());
    }
  };

  const handleEmployeeDelete = async (e) => {
    e.preventDefault();
    await httpService.delete(`/employee/${idToDelete}`);
    document.querySelectorAll('.close')?.forEach((e) => e.click());
    await fetchemployeeslist();
  }

  const handleNewSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...employeeToAdd,
    };
    if(data.password !== data.cnfPassword) { 
      toast.error("Password and Confirm Password does not match"); 
      return;
   }
   if(data?.jobRole == undefined || data?.jobRole == "" || data?.jobRole == "Please Select role"){
     // alert("Please select a job role");
     toast.error("Please select a job role");
     return;
   }
   console.log(data);
    const user = await httpService.post('/employee', data);
    document.querySelectorAll('.close')?.forEach((e) => e.click());
    fetchemployeeslist();
  };

  const getJobName = (jobId) => {
    const job = roles.filter((role) => role?._id == jobId);

    return job[0]?.name || '';
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => (
        <h2 className="table-avatar">
          <Link to={`/app/profile/employee-profile/${record._id}`}>
            <Avatar sx={{ bgcolor: red[400] }}>
              {record.firstName?.substr(0, 1).toUpperCase()}
            </Avatar>
          </Link>
          <div
            style={{
              display: 'inline-block',
              marginLeft: '10px',
            }}
          >
            <Link to={`/app/profile/employee-profile/${record?._id}`}>
              {text} <span>{record?.role}</span>
            </Link>
          </div>
        </h2>
      ),
      sorter: (a, b) => a?.name?.length - b?.name?.length,
    },
    {
      title: 'Employee ID',
      dataIndex: '_id',
      sorter: (a, b) => a?.employee_id?.length - b?.employee_id?.length,
    },

    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email.length - b.email.length,
    },

    {
      title: 'Mobile',
      dataIndex: 'mobileNo',
      sorter: (a, b) => a.mobile.length - b.mobile.length,
    },

    {
      title: 'Join Date',
      dataIndex: 'joindate',
      sorter: (a, b) => a.joindate.length - b.joindate.length,
    },
    {
      title: 'Role',
      dataIndex: 'role',
    },
    {
      title: 'Action',
      render: (text, record) => (
        <div className="dropdown dropdown-action text-right">
          <a
            href="#"
            className="action-icon dropdown-toggle"
            data-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="material-icons">more_vert</i>
          </a>
          <div className="dropdown-menu dropdown-menu-right">
            {/* <a
              className="dropdown-item"
              href="#"
              data-toggle="modal"
              data-target="#edit_employee"
              onClick={() => {
                setEmployeeToModify(
                  employees.find((item) => item?.userId === record?._id)
                );
              }}
            >
              <i className="fa fa-pencil m-r-5" /> Edit
            </a> */}
            <a
              className="dropdown-item"
              href="#"
              data-toggle="modal"
              data-target="#delete_employee"
              onClick={() => {
                setIdToDelete(record._id)
              }}
            >
              <i className="fa fa-trash-o m-r-5" /> Delete
            </a>
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="page-wrapper">
      <Helmet>
        <title>EmployeesPresentList </title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      {isLoading ? (
        <div
          style={{
            height: '90vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          className="content container-fluid"
        >
          <CircularProgress />
        </div>
      ) : (
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row align-items-center">
              <div className="col">
                <h3 className="page-title">Planned Leaves Employee</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/app/main/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active"
                   onClick={()=>setCurrentRender('default')} role="button" >Leave Request</li>
                  <li className="breadcrumb-item active">Planned Leaves Employee</li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Search Filter */}
          <div className="row filter-row">
            <div className="col-sm-6 col-md-6">
              <div className="form-group form-focus focused">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Employee Name"
                  style={{
                    padding: '10px',
                  }}
                  value={qName}
                  onChange={(e) => setQName(e.target.value)}
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
                  placeholder={'Search by Vendor Email'}
                  className="form-control"
                  value={qEmail}
                  onChange={(e) => setQEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="form-group form-focus select-focus">
                <select
                  onChange={(e) => setQRole(e.target.value)}
                  className="custom-select"
                  style={{
                    height: '100%',
                    border: '1px solid #CED4DA',
                  }}
                >
                  <option value={''}>All Designations</option>
                  {roles.map((role) => (
                    <option key={role?._id} value={role?.name}>
                      {role?.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* <div className="col-sm-6 col-md-3" onClick={handleSearch}>
              <a className="btn btn-success btn-block"> Filter </a>
            </div> */}
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
                  dataSource={search(employees)}
                  rowKey={(record) => record._id}
                  onChange={console.log('change')}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* /Page Content */}

      {/* Delete Employee Modal */}
      <div
        className="modal custom-modal fade close"
        id="delete_employee"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete Employee</h3>
                <p>Are you sure want to delete?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <a href="" className="btn btn-primary continue-btn"
                    onClick={handleEmployeeDelete}
                    >
                      Delete
                    </a>
                  </div>
                  <div className="col-6">
                    <a
                      href=""
                      data-dismiss="modal"
                      className="btn btn-primary cancel-btn"
                    >
                      Cancel
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Delete Employee Modal */}
    </div>
  );
};

export default PlannedLeavesList;
