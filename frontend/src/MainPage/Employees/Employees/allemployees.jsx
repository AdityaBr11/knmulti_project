import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar_02 } from '../../../Entryfile/imagepath';
import httpService from '../../../lib/httpService';
import { allemployee } from '../../../lib/api';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';

const AllEmployees = () => {
  const [employees, setEmployees] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const dispatch = useDispatch();
  const [employeeToModify, setEmployeeToModify] = useState(null);
  const [employeeIdToSearch, setEmployeeIdToSearch] = useState('');
  const [employeeNameToSearch, setEmployeeNameToSearch] = useState('');
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [_employees, set_employees] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [designation, setDesignation] = useState('');
  const [designationToFilter, setDesignationToFilter] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [rolesForDepartment, setRolesForDepartment] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    fetchEmployees();
    fetchRolesAndDepartments();
  }, []);

  const fetchEmployees = async () => {
    const res = await allemployee();
    setEmployees(res);
    set_employees(res);
    setIsLoading(false);
  };

  const fetchRolesAndDepartments = async () => {
    const roles = await httpService.get('/role');
    const departments = await httpService.get('/department');
    setRoles(roles.data);
    setDepartments(departments.data);
  };

  useEffect(() => {
    const filteredRoles = roles.filter(
      (role) => role.department._id === selectedDepartment
    );
    console.log(filteredRoles, roles, selectedDepartment);
    setRolesForDepartment(filteredRoles);
  }, [selectedDepartment]);

  const handleAddEmployee = async () => {
    const data = {
      firstName: firstName,
      lastName: lastName,
      mobileNo: phone,
      joinDate: new Date(joiningDate).toISOString(),
      userName: username,
      password: password,
      jobRole: selectedRole,
      userAuthorites: [],
      workLocation: '61ded9d3bc62af7e13239163',
      dob: new Date(joiningDate).toISOString(),
      salary: 60000,
      email,
    };
    const user = await httpService.post('/employee', data);
    fetchEmployees();
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  };

  const handleSearch = () => {
    if (
      designationToFilter === '' &&
      employeeIdToSearch === '' &&
      employeeNameToSearch === ''
    )
      return setEmployees(_employees);
    const filteredEmployees = _employees.filter((employee) => {
      if (
        (employeeNameToSearch &&
          employee.firstName
            .toLowerCase()
            .includes(employeeNameToSearch.toLowerCase())) ||
        (employeeNameToSearch &&
          employee.lastName
            .toLowerCase()
            .includes(employeeNameToSearch.toLowerCase())) ||
        (employeeIdToSearch &&
          employee._id.toString().includes(employeeIdToSearch.toLowerCase())) ||
        (designationToFilter &&
          employee.jobRole._id
            .toLowerCase()
            .includes(designationToFilter.toLowerCase()))
      ) {
        return employee;
      }
    });
    setEmployees(filteredEmployees);
  };

  const handleSubmit = async (e) => {
    const response = await httpService.put(
      `/employee/${employeeToModify._id}`,
      employeeToModify
    );
    if (response.status === 200) {
      const newEmployee = response.data;
      setEmployees(
        _employees.map((employee) => {
          if (employee._id === employeeToModify._id) {
            return employeeToModify;
          }
          return employee;
        })
      );
      document.querySelectorAll('.close')?.forEach((e) => e.click());
    }
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Employee </title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Employee</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Employee</li>
              </ul>
            </div>
            <div className="col-auto float-right ml-auto">
              <a
                href="#"
                className="btn add-btn"
                data-toggle="modal"
                data-target="#add_employee"
              >
                <i className="fa fa-plus" /> Add Employee
              </a>
              <div className="view-icons">
                <Link
                  to="/app/employee/allemployees"
                  className="grid-view btn btn-link active"
                >
                  <i className="fa fa-th" />
                </Link>
                <Link
                  to="/app/employee/employees-list"
                  className="list-view btn btn-link"
                >
                  <i className="fa fa-bars" />
                </Link>
              </div>
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
                value={employeeNameToSearch}
                onChange={(e) => setEmployeeNameToSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="form-group form-focus select-focus">
              <select
                onChange={(e) => setDesignationToFilter(e.target.value)}
                className="custom-select"
                style={{
                  height: '100%',
                  border: '1px solid #CED4DA',
                }}
              >
                <option value={''}>All Designations</option>
                {roles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-sm-6 col-md-3" onClick={handleSearch}>
            <a className="btn btn-success btn-block"> Filter </a>
          </div>
        </div>
        {/* Search Filter */}
        <div className="row staff-grid-row">
          {isLoading &&
            [1, 2, 3, 4, 5, 6, 7, 8, 9].map((v) => (
              <div
                key={v}
                className="col-md-4 col-sm-6 col-12 col-lg-4 col-xl-3"
              >
                <div className="profile-widget">
                  <div className="profile-img">
                    <Skeleton />
                  </div>
                  <div className="dropdown profile-action">
                    <a
                      href="#"
                      className="action-icon dropdown-toggle"
                      data-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="material-icons">more_vert</i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right">
                      <a
                        className="dropdown-item"
                        href="#"
                        data-toggle="modal"
                        data-target="#edit_employee"
                      >
                        <i className="fa fa-pencil m-r-5" /> Edit
                      </a>
                      <a
                        className="dropdown-item"
                        href="#"
                        data-toggle="modal"
                        data-target="#delete_employee"
                      >
                        <i className="fa fa-trash-o m-r-5" />
                      </a>
                    </div>
                  </div>
                  <h4 className="user-name m-t-10 mb-0 text-ellipsis">
                    <Link to="/app/profile/employee-profile">
                      <Skeleton />
                    </Link>
                  </h4>
                  <div className="small text-muted">
                    <Skeleton />
                  </div>
                </div>
              </div>
            ))}
          {employees.map((employee) => (
            <div
              key={employee._id}
              className="col-md-4 col-sm-6 col-12 col-lg-4 col-xl-3"
            >
              <div className="profile-widget">
                <div className="profile-img">
                  <Link
                    to={'/app/profile/employee-profile' + '/' + employee._id}
                  >
                    <Avatar sx={{ bgcolor: red[400], height: 70, width: 70 }}>
                      {employee.firstName?.substr(0, 1).toUpperCase()}
                    </Avatar>
                  </Link>
                </div>
                <div className="dropdown profile-action">
                  <a
                    href="#"
                    className="action-icon dropdown-toggle"
                    data-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="material-icons">more_vert</i>
                  </a>
                  <div className="dropdown-menu dropdown-menu-right">
                    <a
                      className="dropdown-item"
                      href="#"
                      data-toggle="modal"
                      data-target="#edit_employee"
                      onClick={() => {
                        setEmployeeToModify(employee);
                        console.log(employee);
                      }}
                    >
                      <i className="fa fa-pencil m-r-5" /> Edit
                    </a>
                    <a
                      className="dropdown-item"
                      href="#"
                      data-toggle="modal"
                      data-target="#delete_employee"
                      onClick={() => {}}
                    >
                      <i className="fa fa-trash-o m-r-5" /> Delete
                    </a>
                  </div>
                </div>
                <h4 className="user-name m-t-10 mb-0 text-ellipsis">
                  <Link to="/app/profile/employee-profile">
                    {employee.firstName + ' ' + employee.lastName}
                  </Link>
                </h4>
                <div className="small text-muted">
                  {employee.jobRole?.name || 'Marketing Lead'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* /Page Content */}
      {/* Add Employee Modal */}
      <div id="add_employee" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Employee</h5>
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
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddEmployee();
                }}
              >
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        First Name <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        onChange={(event) => setFirstName(event.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">Last Name</label>
                      <input
                        className="form-control"
                        type="text"
                        onChange={(event) => setLastName(event.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Username <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        onChange={(event) => setUserName(event.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        type="email"
                        onChange={(event) => setEmail(event.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">Password</label>
                      <input
                        className="form-control"
                        type="password"
                        onChange={(event) => setPassword(event.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">Confirm Password</label>
                      <input className="form-control" type="password" />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Joining Date <span className="text-danger">*</span>
                      </label>
                      <div>
                        <input
                          className="form-control"
                          type="date"
                          onChange={(event) =>
                            setJoiningDate(event.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">Phone </label>
                      <input
                        className="form-control"
                        type="text"
                        onChange={(event) => setPhone(event.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Department <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-control select"
                        onChange={(event) =>
                          setSelectedDepartment(event.target.value)
                        }
                      >
                        <option value={''}>Select Department</option>
                        {departments.map((department) => (
                          <option key={department._id} value={department._id}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Designation <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-control select"
                        onChange={(event) =>
                          setSelectedRole(event.target.value)
                        }
                      >
                        <option value={''}>Select Designation</option>
                        {rolesForDepartment.map((role) => (
                          <option key={role._id} value={role._id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="table-responsive m-t-15">
                  <table className="table table-striped custom-table">
                    <thead>
                      <tr>
                        <th>Module Permission</th>
                        <th className="text-center">Read</th>
                        <th className="text-center">Write</th>
                        <th className="text-center">Create</th>
                        <th className="text-center">Delete</th>
                        <th className="text-center">Import</th>
                        <th className="text-center">Export</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Holidays</td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                      </tr>
                      <tr>
                        <td>Leaves</td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                      </tr>
                      <tr>
                        <td>Clients</td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                      </tr>
                      <tr>
                        <td>Projects</td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                      </tr>
                      <tr>
                        <td>Tasks</td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                      </tr>
                      <tr>
                        <td>Chats</td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                      </tr>
                      <tr>
                        <td>Assets</td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                      </tr>
                      <tr>
                        <td>Timing Sheets</td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn" type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Employee Modal */}
      {/* Edit Employee Modal */}
      <div id="edit_employee" className="modal custom-modal fade" role="dialog">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Employee</h5>
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
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        First Name <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="firstName"
                        defaultValue={employeeToModify?.firstName || ''}
                        onChange={(e) => {
                          setEmployeeToModify({
                            ...employeeToModify,
                            firstName: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">Last Name</label>
                      <input
                        className="form-control"
                        defaultValue={employeeToModify?.lastName || ''}
                        onChange={(e) => {
                          setEmployeeToModify({
                            ...employeeToModify,
                            lastName: e.target.value,
                          });
                        }}
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Username <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        disabled
                        defaultValue={employeeToModify?.userName || ''}
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        defaultValue={employeeToModify?.email || ''}
                        disabled
                        type="email"
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Employee ID <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        defaultValue={employeeToModify?._id || ''}
                        readOnly
                        className="form-control floating"
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Joining Date <span className="text-danger">*</span>
                      </label>
                      <div>
                        <input
                          className="form-control datetimepicker"
                          readOnly
                          defaultValue={
                            employeeToModify
                              ? new Date(employeeToModify?.joinDate)
                                  .toISOString()
                                  .substring(0, 10)
                              : ''
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">Phone </label>
                      <input
                        className="form-control"
                        defaultValue={employeeToModify?.mobileNo || ''}
                        onChange={(e) => {
                          setEmployeeToModify({
                            ...employeeToModify,
                            mobileNo: e.target.value,
                          });
                        }}
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">Company</label>
                      <select className="select form-control" disabled>
                        <option>KN Multiprojects</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>
                        Department <span className="text-danger">*</span>
                      </label>
                      <select
                        value={employeeToModify?.jobRole?.department}
                        className="select form-control"
                      >
                        <option value={''}>Select Department</option>
                        {departments.map((department) => (
                          <option value={department._id}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>
                        Designation <span className="text-danger">*</span>
                      </label>
                      <select
                        value={employeeToModify?.jobRole?._id}
                        className="select form-control"
                        onChange={(e) => {
                          setEmployeeToModify({
                            ...employeeToModify,
                            jobRole: {
                              _id: e.target.value,
                            },
                          });
                        }}
                      >
                        <option value={''}>Select Designation</option>
                        {roles.map((role) => (
                          <option value={role._id}>{role.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="table-responsive m-t-15">
                  <table className="table table-striped custom-table">
                    <thead>
                      <tr>
                        <th>Module Permission</th>
                        <th className="text-center">Read</th>
                        <th className="text-center">Write</th>
                        <th className="text-center">Create</th>
                        <th className="text-center">Delete</th>
                        <th className="text-center">Import</th>
                        <th className="text-center">Export</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Holidays</td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                      </tr>
                      <tr>
                        <td>Leaves</td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                      </tr>
                      <tr>
                        <td>Clients</td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                      </tr>
                      <tr>
                        <td>Projects</td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                      </tr>
                      {/* <tr>
                        <td>Tasks</td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                      </tr>
                      <tr>
                        <td>Chats</td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                      </tr>
                      <tr>
                        <td>Assets</td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                      </tr>
                      <tr>
                        <td>Timing Sheets</td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input defaultChecked type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="text-center">
                          <input type="checkbox" />
                        </td>
                      </tr> */}
                    </tbody>
                  </table>
                </div>
                <div className="submit-section">
                  <input
                    type={'submit'}
                    className="btn btn-primary submit-btn"
                    value={'Save Changes'}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit Employee Modal */}
      {/* Delete Employee Modal */}
      <div
        className="modal custom-modal fade"
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
                    <a href="" className="btn btn-primary continue-btn">
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

export default AllEmployees;
