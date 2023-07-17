import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useHistory } from 'react-router-dom';
import { Table } from 'antd';
import 'antd/dist/antd.css';
import { itemRender, onShowSizeChange } from '../../paginationfunction';
import '../../antdstyle.css';
import Avatar from '@mui/material/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import httpService from '../../../lib/httpService';
import { allemployee } from '../../../lib/api';
import { red } from '@mui/material/colors';
import { CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import emailjs from 'emailjs-com';
import { createNotify } from '../../../features/notify/notifySlice';
import { DeleteForever } from '@material-ui/icons';
import FileUploadService from '../../Pages/Profile/FileUploadService';
import DatePicker from 'react-date-picker';
import Swal from 'sweetalert2';
const Employeeslist = () => {
  const history = useHistory();

  const empObj = useSelector((state) => state?.authentication?.value?.user);

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

  const [currentFile, setcurrentFile] = useState("");
  const [employeeType, setEmployeeType] = useState([
    { type: 'Trainee(14)', days: '14' },
    { type: 'Internship(14)', days: '14' },
    { type: 'Fresher(10)', days: '10' },
    { type: 'Experience(24)', days: '24' },
    { type: 'Management(28)', days: '28' },
    { type: 'Owner(01)', days: '1' },
  ]);
  const [departments, setDepartments] = useState([]);
  const [idToDelete, setIdToDelete] = useState('');
  // for seach bar
  const [qName, setQName] = useState('');
  const [qEmail, setQEmail] = useState('');
  const [qRole, setQRole] = useState('');
  const [filedata, setfiledata] = useState('');
  const [employmenttype, setemploymenttype] = useState(null);
  console.log('employmenttype', employeeToAdd?.employmentType);
  const employeeTypeValue = (e) => {
    const obj = JSON.parse(e);
    console.log(e, 'e from ETV');
    console.log(obj, 'obj..');
    setEmployeeToAdd({
      ...employeeToAdd,
      employeeType: obj.employeeTypeName,
      totalLeaves: obj.noOfLeaves,
    });
  };

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

  const fetchemployeeslist = async () => {
    const res = await allemployee();
    setEmployees(
      res.map((data) => ({
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
    const employeeTypes001 = await httpService.get('/employee-type');
    setRoles(roles?.data);
    console.log(roles, 'roles');
    setDepartments(departments?.data);
    setEmployeeType(employeeTypes001?.data);
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
    return data
      .filter((row) => row.name.toLowerCase().indexOf(qName) > -1)
      .filter((r) => r.email?.toLowerCase().indexOf(qEmail) > -1)
      .filter((c) => c.role?.indexOf(qRole) > -1);
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await httpService.put(
      `/employee/${employeeToModify?._id}`,
      employeeToModify
    );
    console.log(response, 'response..');
    console.log(employees, 'employees');
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
  };
  const [UploadImageSet, setUploadImageSet] = useState();

  const UploadImage = async () => {
    console.log('Uploadingaa', currentFile.name);
    if (currentFile?.name) {
      const filedata = await FileUploadService.upload(currentFile);
      setUploadImageSet(filedata);
      toast.success('image uploaded successfully');
      console.log('Uploading', filedata);
    }
  }

  const handleNewSubmit = async (e) => {
    e.preventDefault();
    // const filedata = '';
    const data11 = {
      ...employeeToAdd
    };
    // return;
    if (
      employeeToAdd.department == undefined ||
      employeeToAdd.department == '' ||
      employeeToAdd.department == 'Select Department'
    ) {
      // alert("Please select a job role");
      toast.error('Please select a Department');
      return;
    }
    console.log(data11, 'assasas')

    if (data11.password !== data11.cnfPassword) {
      toast.error('Password and Confirm Password does not match');
      return;
    }
    if (
      data11?.jobRole == undefined ||
      data11?.jobRole == '' ||
      data11?.jobRole == 'Please Select role'
    ) {
      // alert("Please select a job role");
      toast.error('Please select a job role');
      return;
    }
    if (
      data11?.joinDate == undefined ||
      data11?.joinDate == '') {
      // alert("Please select a job role");
      toast.error('Please select a Join Date');
      return;
    }
    if (employeeToAdd?.mobileNo.length >= 11 || employeeToAdd?.mobileNo.length <= 9) {
      toast.error('Mobile Number Must be 10');
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to Create New  Employee',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
    }).then(async (result) => {
      if (result.isConfirmed) {

        // if (currentFile) {
        //   const filedata1 = await FileUploadService.upload(currentFile);
        //   setfiledata(filedata1);
        //   console.log(filedata?.data, 'filedata', employeeToAdd);

        // }

        const data = {
          ...employeeToAdd,
          fileInfoPic: UploadImageSet?.data,
        };

        toast
          .promise(
            httpService.post('/employee', data),
            // history.goBack();

            {
              error: 'Failed to New Employee Added',
              success: 'New Employee Added successfully',
              pending: 'New Employee Added Details ...',
            }
          )
          .then((res) => {
            dispatch(createNotify({
              notifyHead: `New Employee Added`,
              notifyBody: `Employee ${res?.data?.userName} is created`,
              createdBy: empObj?._id
            }));
            emailjs
              .sendForm(
                'service_xcxiogi',
                'template_8zwkov8',
                e.target,
                'hf0po8venBjKL4wIi',
              )
              .then((res) => {
                toast.success('Email Sent!');
                console.log(res, 'res frm emaijs');
              })
              .catch((err) => {
                toast.error('Email failed!');
                console.log(err, "err frm emaijs");
              });

            fetchemployeeslist();
            document.querySelectorAll('.close')?.forEach((e) => e.click());
          });

        document.querySelectorAll('.close')?.forEach((e) => e.click());
        fetchemployeeslist();
        // });


        // console.log(data, 'hndlesubmt add employee');
      }
    });
  };

  const getJobName = (jobId) => {
    const job = roles.filter((role) => role?._id == jobId);

    return job[0]?.name || '';
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      // align: 'center',
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
      // sorter: (a, b) => a?.name?.length - b?.name?.length,
    },
    {
      title: 'Employee ID',
      // dataIndex: '_id',
      align: 'center',
      render: (text, record) => (
        <span> KN-{record._id} </span>
      )
      // sorter: (a, b) => a?.employee_id?.length - b?.employee_id?.length,
    },

    {
      title: 'Email',
      dataIndex: 'email',
      align: 'center',
      // sorter: (a, b) => a.email.length - b.email.length,
    },

    {
      title: 'Mobile',
      dataIndex: 'mobileNo',
      align: 'center',
      // sorter: (a, b) => a.mobile.length - b.mobile.length,
    },

    {
      title: 'Join Date',
      dataIndex: 'joindate',
      align: 'center',
      // sorter: (a, b) => a.joindate.length - b.joindate.length,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      align: 'center',
    },
    {
      title: 'Action',
      align: 'center',
      render: (text, record) => (
        record?.role != "Admin" &&

        <a
          className=""
          href="#"
          data-toggle="modal"
          data-target="#delete_employee"
          onClick={() => {
            setIdToDelete(record._id);
          }}
        >
          <DeleteForever />
        </a>

        // <div className="dropdown dropdown-action text-right">
        //   <a
        //     href="#"
        //     className="action-icon dropdown-toggle"
        //     data-toggle="dropdown"
        //     aria-expanded="false"
        //   >
        //     <i className="material-icons">more_vert</i>
        //   </a>
        //   <div className="dropdown-menu dropdown-menu-right">
        //     {/* <a
        //       className="dropdown-item"
        //       href="#"
        //       data-toggle="modal"
        //       data-target="#edit_employee"
        //       onClick={() => {
        //         setEmployeeToModify(
        //           employees.find((item) => item?._id === record?._id)
        //         );
        //         console.log(employees, 'employees frm onclick');
        //         console.log(
        //           employees.find((item) => item?._id === record?._id),
        //           'empFind frm onclick'
        //         );
        //       }}
        //     >
        //       <i className="fa fa-pencil m-r-5" /> Edit
        //     </a> */}
        //     <a
        //       className="dropdown-item"
        //       href="#"
        //       data-toggle="modal"
        //       data-target="#delete_employee"
        //       onClick={() => {
        //         setIdToDelete(record._id);
        //       }}
        //     >
        //       <i className="fa fa-trash-o m-r-5" /> Delete
        //     </a>
        //   </div>
        // </div>
      ),
    },
  ];
  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Employees</title>
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
                <h3 className="page-title">Employees</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/app/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Employees</li>
                </ul>
              </div>
              <div className="col-auto float-right ml-auto">
                {/* <Link to="/app/employee/addemployee">Add Emp</Link> */}
                <a
                  href="#"
                  className="btn add-btn"
                  data-toggle="modal"
                  data-target="#add_employee"
                >
                  <i className="fa fa-plus" /> Add Employee
                </a>
                {/* <div className="view-icons">
                  <Link
                    to="/app/employee/allemployees"
                    className="grid-view btn btn-link"
                  >
                    <i className="fa fa-th" />
                  </Link>
                  <Link
                    to="/app/employee/employees-list"
                    className="list-view btn btn-link active"
                  >
                    <i className="fa fa-bars" />
                  </Link>
                </div> */}
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
                  placeholder={'Employee Email'}
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
                  <option value={''}>All Roles</option>
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
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* /Page Content */}

      {/* Add Employee Modal */}
      <div id="add_employee" className="modal custom-modal fade" role="dialog">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Employee11</h5>
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
              <form onSubmit={(e) => handleNewSubmit(e)}>
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
                        defaultValue={employeeToAdd?.firstName || ''}
                        onChange={(e) => {
                          setEmployeeToAdd({
                            ...employeeToAdd,
                            firstName: e.target.value,
                          });
                        }}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">Last Name <span className="text-danger">*</span></label>
                      <input
                        className="form-control"
                        type="text"
                        name="lastName"
                        defaultValue={employeeToAdd?.lastName || ''}
                        onChange={(e) => {
                          setEmployeeToAdd({
                            ...employeeToAdd,
                            lastName: e.target.value,
                          });
                        }}
                        required
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
                        name="userName"
                        defaultValue={employeeToAdd?.userName || ''}
                        onChange={(e) => {
                          setEmployeeToAdd({
                            ...employeeToAdd,
                            userName: e.target.value,
                          });
                        }}
                        required
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
                        name="email"
                        defaultValue={employeeToAdd?.email || ''}
                        onChange={(e) => {
                          setEmployeeToAdd({
                            ...employeeToAdd,
                            email: e.target.value,
                          });
                        }}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">Password <span className="text-danger">*</span></label>
                      <input
                        className="form-control"
                        type="password"
                        defaultValue={employeeToAdd?.password || ''}
                        onChange={(e) => {
                          setEmployeeToAdd({
                            ...employeeToAdd,
                            password: e.target.value,
                          });
                        }}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">Confirm Password <span className="text-danger">*</span></label>
                      <input
                        className="form-control"
                        type="password"
                        name="password"
                        defaultValue={employeeToAdd?.cnfPassword || ''}
                        onChange={(e) => {
                          setEmployeeToAdd({
                            ...employeeToAdd,
                            cnfPassword: e.target.value,
                          });
                        }}
                        // title='Please enter matching password'
                        // pattern={employeeToAdd?.password}
                        // onInput={(e) => employeeToAdd?.password = e.target.value}
                        required
                      />
                    </div>
                  </div>
                  {/* <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Employee ID <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        defaultValue={employeeToAdd?._id || ''}
                        onChange={(e) => {
                          setEmployeeToAdd({
                            ...employeeToAdd,
                            _id: e.target.value,
                          });
                        }}
                        
                      />
                    </div>
                  </div> */}
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Joining Date <span className="text-danger">*</span>
                      </label>
                      <div>
                        <DatePicker
                          id='dob'
                          poppername="startDate"
                          className="form-control"
                          // style={{ border: 'none', backgroundColor: 'red' }}
                          value={employeeToAdd?.joinDate}
                          onChange={(e) => {
                            setEmployeeToAdd({
                              ...employeeToAdd,
                              joinDate: e,
                            });
                          }}
                        />
                        {/* <input
                          className="form-control"
                          type="date"
                          name="joinDate"
                          defaultValue={employeeToAdd?.joinDate || ''}
                          onChange={(e) => {
                            setEmployeeToAdd({
                              ...employeeToAdd,
                              joinDate: e.target.value,
                            });
                          }}
                          required
                        /> */}
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">Phone <span className="text-danger">*</span></label>
                      <input
                        // maxLength={10}
                        // minLength={10}
                        className="form-control"
                        type="phone"
                        name="mobileNo"
                        defaultValue={employeeToAdd?.mobileNo || ''}
                        onChange={(e) => {
                          setEmployeeToAdd({
                            ...employeeToAdd,
                            mobileNo: e.target.value,
                          });
                        }}
                        pattern="[7-9]{1}[0-9]{9}"
                        title="Phone number with 7-9 and remaing 9 digit with 0-9"
                        required
                      />
                    </div>
                  </div>
                  {/* <div className="col-sm-6">
                  <div className="form-group">
                    <label>
                      Total Leaves <span className="text-danger">*</span>
                    </label>
                    <select
                      role="button"
                      className="custom-select"
                      name="totalLeaves"
                      value={employeeToAdd?.totalLeaves}
                      onChange={(e) => {
                        setEmployeeToAdd({
                          ...employeeToAdd,
                          totalLeaves: e.target.value,
                        });
                      }}
                      required
                    >
                      <option>Select Leave Days</option>
                      {totalLeaves?.map((r, index) => (
                        <option key={index} value={r?.days}>
                          {r?.type}
                        </option>
                      ))}
                    </select>
                  </div>
                  </div> */}
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>
                        Employee Type
                      </label>
                      <select
                        role="button"
                        className="custom-select"
                        name="employeeType"
                        // value={employeeToAdd?.employeeType}
                        onChange={(e) => {
                          employeeTypeValue(e.target.value);
                        }}
                        required
                      >
                        <option>Select Employee Type</option>
                        {employeeType?.map((r, index) => (
                          <option key={index} value={JSON.stringify(r)}>
                            {r.employeeTypeName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>
                        Department <span className="text-danger">*</span>
                      </label>
                      <select
                        className="custom-select"
                        role="button"
                        name="department"
                        value={employeeToAdd?.department}
                        onChange={(e) => {
                          setEmployeeToAdd({
                            ...employeeToAdd,
                            department: e.target.value,
                          });
                        }}

                      >
                        <option >Select Department</option>
                        {departments?.map((r, index) => (
                          <option key={index} value={r._id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div className="form-group" role="button">
                      <label>
                        Empolyment Type
                      </label>
                      <select
                        className="custom-select"
                        role="button"
                        name="employmentType"
                        value={employeeToAdd?.employmentType}
                        onChange={(e) => {
                          setEmployeeToAdd({
                            ...employeeToAdd,
                            employmentType: e.target.value,
                          });
                        }}
                      // required
                      >
                        <option>Please Select Empolyment Type</option>
                        <option >Full time</option>
                        <option >Permanent</option>
                        <option >Contractual</option>
                        <option >Part time</option>
                        <option >Work from home</option>
                        {/* {roles?.map((r, index) => (
                          <option key={index} value={r?._id}>
                            {r?.name}
                          </option>
                        ))} */}
                      </select>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    {/* <div className="form-group form-focus focused text-left">
                      <label className="col-form-label">Job Role</label>
                      <a
                        className="btn form-control btn-white dropdown-toggle"
                        href="#"
                        data-toggle="dropdown"
                        aria-expanded="false"
                        style={{ height: '42px', paddingTop: '9px' }}
                      >
                        {getJobName(employeeToAdd?.jobRole) ||
                          'Select Job Role'}
                      </a>
                      <div className="dropdown-menu dropdown-menu-right col-12 ">
                        {roles?.map((role, index) => (
                          <span
                            key={index}
                            className="dropdown-item text-center"
                            onClick={() => {
                              setEmployeeToAdd({
                                ...employeeToAdd,
                                jobRole: role._id,
                              });
                              getJobName(employeeToAdd?.jobRole);
                            }}
                            style={{ width: '100%' }}
                            required
                          >
                            <i className="fa" /> {role?.name}
                          </span>
                        ))}
                      </div>
                    </div> */}

                    <div className="form-group" role="button">
                      <label>
                        Job Role <span className="text-danger">*</span>
                      </label>
                      <select
                        className="custom-select"
                        role="button"
                        name="jobRole"
                        value={employeeToAdd?.jobRole}
                        onChange={(e) => {
                          setEmployeeToAdd({
                            ...employeeToAdd,
                            jobRole: e.target.value,
                          });
                        }}
                        required
                      >
                        <option>Please Select Job role</option>
                        {roles?.map((r, index) => (
                          <option key={index} value={r?._id}>
                            {r?.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Upload your Pic</label>
                      <div className="custom-file">

                        <input
                          name="resumeFile"
                          type="file"
                          // required
                          className="custom-file-input"
                          id="cv_upload"
                          value={currentFile?.fileName}
                          onChange={(e) => setcurrentFile(e.target.files[0])}

                        />
                        <label className="custom-file-label" htmlFor="cv_upload"
                          value={currentFile?.fileName}
                        >
                          {currentFile?.fileName || currentFile?.name || currentFile[0]?.fileName ?
                            <span className="">{currentFile?.name} {currentFile[0]?.fileName} {currentFile?.fileName} </span> : "Choose file"}

                          {/* {currentFile[0]?.fileName ? currentFile[0]?.fileName : "Choose file"} */}
                        </label>
                      </div>
                    </div>
                    <button type="button" className='btn btn-info'
                      //  onClick={UploadImage()}
                      onClick={() => UploadImage()}>Upload
                    </button>
                  </div>
                </div>
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Employee Modal */}
      {/* Edit Employee Modal */}
      {/* <div id="edit_employee" className="modal custom-modal fade" role="dialog">
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
              <form onSubmit={handleSubmit}>
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
                        defaultValue={employeeToModify?.userName || ''}
                        onChange={(e) => {
                          setEmployeeToModify({
                            ...employeeToModify,
                            userName: e.target.value,
                          });
                        }}
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
                        onChange={(e) => {
                          setEmployeeToModify({
                            ...employeeToModify,
                            email: e.target.value,
                          });
                        }}
                        type="email"
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">Password</label>
                      <input
                        className="form-control"
                        type="password"
                        defaultValue={employeeToModify?.password || ''}
                        onChange={(e) => {
                          setEmployeeToModify({
                            ...employeeToModify,
                            password: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">Confirm Password</label>
                      <input
                        className="form-control"
                        type="password"
                        defaultValue={employeeToModify?.cnfPassword || ''}
                        onChange={(e) => {
                          setEmployeeToModify({
                            ...employeeToModify,
                            cnfPassword: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Employee ID <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
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
                          type="date"
                          defaultValue={employeeToModify?.joindate || ''}
                          onChange={(e) => {
                            setEmployeeToModify({
                              ...employeeToModify,
                              joinDate: e.target.value,
                            });
                          }}
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
                      <select className="select" disabled>
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
                        className="custom-select"
                        role="button"
                        name="department"
                        value={employeeToModify?.department}
                        onChange={(e) => {
                          setEmployeeToModify({
                            ...employeeToModify,
                            department: e.target.value,
                          });
                        }}
                      >
                        <option>Select Departemnt</option>
                        {department?.map((r, index) => (
                          <option key={index} value={r.type}>
                            {r.type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>
                        Total Leaves <span className="text-danger">*</span>
                      </label>
                      <select
                        className="custom-select"
                        role="button"
                        name="department"
                        value={employeeToModify?.totalLeaves}
                        onChange={(e) => {
                          setEmployeeToModify({
                            ...employeeToModify,
                            totalLeaves: e.target.value,
                          });
                        }}
                      >
                        <option>Select Leave Days</option>
                        {totalLeaves?.map((r, index) => (
                          <option key={index} value={r?.days}>
                            {r?.type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>
                        Employee Type <span className="text-danger">*</span>
                      </label>
                      <select
                        className="custom-select"
                        role="button"
                        name="department"
                        value={employeeToModify?.employeeType}
                        onChange={(e) => {
                          setEmployeeToModify({
                            ...employeeToModify,
                            employeeType: e.target.value,
                          });
                        }}
                      >
                        <option>Select Employee Type</option>
                        {employeeType?.map((r, index) => (
                          <option key={index} value={r.type}>
                            {r.type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>
                        Job Role <span className="text-danger">*</span>
                      </label>
                      <select
                        className="custom-select"
                        role="button"
                        name="jobRole"
                        value={employeeToModify?.jobRole}
                        onChange={(e) => {
                          setEmployeeToModify({
                            ...employeeToModify,
                            jobRole: e.target.value,
                          });
                        }}
                      >
                        <option>Please Select role</option>
                        {roles?.map((r, index) => (
                          <option key={index} value={r?._id}>
                            {r?.name}
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
      </div> */}
      {/* /Edit Employee Modal */}
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
                    <a
                      href=""
                      className="btn btn-primary continue-btn"
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

export default Employeeslist;
