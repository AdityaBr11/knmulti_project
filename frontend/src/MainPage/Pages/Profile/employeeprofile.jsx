import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountBoxIcon from '@mui/icons-material/AccountBox'
// import ContactEmergencySharpIcon from '@mui/icons-material/ContactEmergencySharp';
import SchoolIcon from '@mui/icons-material/School';
import { Avatar_02 } from '../../../Entryfile/imagepath';
import {
  editDocuments,
  getDocuments,
  getEmployee,
  getRoles,
  postDocuments,
  updateEmployee,
} from '../../../lib/api';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
  TimelineDot,
} from '@material-ui/lab';
import { Backdrop, makeStyles, Paper } from '@material-ui/core';
import LaptopMacIcon from '@material-ui/icons/LaptopMac';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { Avatar, Button, CircularProgress, Stack } from '@mui/material';
import PhoneIcon from '@mui/icons-material/PhoneOutlined';
import PersonIcon from '@mui/icons-material/Person';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import EmailIcon from '@mui/icons-material/EmailOutlined';
import AddressIcon from '@mui/icons-material/LocationOnOutlined';
import CalanderIcon from '@mui/icons-material/EventOutlined';
import EditIcon from '@mui/icons-material/Edit';
import { red } from '@mui/material/colors';
import { dateFormatter, fileToDataURI } from '../../../misc/helpers';
import { MARITAL_STATUS } from '../../../model/shared/maritalStates';
import { GENDERS } from '../../../model/shared/genders';
import DocumentsPane from './panes/DocumentsPane';
import { Delete, Person, UploadFileOutlined } from '@mui/icons-material';
import EditEmpEdu from './EditEmpEdu';
import EditEmpExp from './EditEmpExp';
import AddEmp from './AddEmp';
import EditEmpBank from './EditEmpBank';
import EditEmpOtherDetails from './EditEmpOtherDetails';
import EditEmpContact from './EditEmpContact';
import EditEmpPersonal from './EditEmpPersonal';
import UploadDocument from './UploadDocument';
import FileUploadService from './FileUploadService';
import httpService from '../../../lib/httpService';
import PayrollView from './PayrollView'
import EmpWeekSprint from './EmpWeekSprint'
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'antd';
import { itemRender, onShowSizeChange } from '../../paginationfunction';
import Payslip from '../../HR/Payroll/payslip';

const InactiveTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 250,
  },
});

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '6px 16px',
  },
  notesInput: {
    width: '60vw',
    backgroundColor: '#fff',
  },
  notesAddButton: {
    paddingBottom: 0,
    marginBottom: 6,
  },
}));

const EmployeeProfile = () => {
  const { id } = useParams();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { user } = JSON.parse(localStorage.getItem('auth'));
  const [employee, setEmployee] = useState({});
  console.log(employee, 'employee--||');
  const [loading, setLoading] = useState({});
  const [roleData, setRoleData] = useState([]);
  const [newEmployeeDetails, setNewEmployeeDetails] = useState({ ...employee });
  const [documents, setDocuments] = useState(null);
  const [cert, setCert] = useState(false);
  const [newUpload, setNewUpload] = useState({
    data: '',
    description: '',
    uploadedAt: new Date(),
  });
  const [empTask, setEmpTask] = useState();
  const [data, setData] = useState([]);
  const [evoke, setEvoke] = useState([false]);
  const [week_sprint, setWeek_sprint] = useState([false]);
  const isAdmin = user && user?.userType === 'admin';

  // activity
  const [activityItems, setactivityItems] = useState([]);
  const [payslipRender, setPayslipRender] = useState('default');

  //payroll
  const [payrollData, setPayrollData] = useState([]);
  const [profile, setProfile] = useState('');
  const fetchEmpSalary = async () => {
    const res = await httpService.get(`/payroll?employeeId=${id}`);
    // console.log(res?.data, 'payroll data');
    setPayrollData(res?.data);
  };

  //week sprint
  //employee task
  const fetchEmpTask = async () => {
    const res = await httpService.get(`/employeeTask`);
    setEmpTask(res?.data);
  };

  useEffect(() => {
    fetchEmpTask();
  }, []);
  //week sprint
  const [depts, setDepts] = useState([]);
  const fetchdepartmen = async () => {
    const depts1 = await httpService.get('/department');
    setDepts(depts1.data);

  };
  useEffect(() => {
    fetchdepartmen();
  }, []);
  console.log('depts1', depts);
  const fetchEmpActivity = async () => {
    const res = await httpService.get(`/notify?createdBy=${id}`);
    setactivityItems(res?.data);
  };

  useEffect(() => {
    fetchEmpActivity();
  }, []);

  useEffect(() => {
    fetchEmpSalary();
  }, [evoke]);
  //payroll

  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }
  });

  async function fetchApi() {
    setLoading(true);
    const res = await getEmployee(id);
    setEmployee(res);
    setLoading(false);
  }

  useEffect(async () => {
    setLoading(true);
    const res = await getEmployee(id);
    const res2 = await getRoles();
    const res3 = await getDocuments(id);
    setEmployee(res);
    setNewEmployeeDetails(res);
    setRoleData(res2);
    setDocuments(res3);
    setLoading(false);
  }, [id]);

  const handleEmployeeDetailsChange = (e) => {
    e.preventDefault();
    setNewEmployeeDetails({
      ...newEmployeeDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleNewEmployeeDetailsSubmit = (e) => {
    e.preventDefault();
    console.log(newEmployeeDetails);
    updateEmployee(id, newEmployeeDetails).then((res) => {
      setEmployee(res);
      setNewEmployeeDetails(res);
    });
  };

  const handleDocumentChange = (file) => {
    if (!file) {
      setNewUpload({ ...newUpload, data: '' });
      return;
    }

    fileToDataURI(file).then((res) =>
      setNewUpload({ ...newUpload, data: res })
    );
  };

  const removeFileFn = async (fileName) => {
    try {
      const res = await FileUploadService.removeFile(fileName);
      const resp = await httpService.put(`/employee/${id}`, { userName: employee?.userName, fileInfos: employee?.fileInfos.filter(f => f.fileName !== res?.data?.fileName) })
      await fetchApi();
    } catch (err) {
      console.log("file not able to be removed completly")
    }
  }

  const removeCertFn = async (fileName) => {
    try {
      const res = await FileUploadService.removeFile(fileName);
      const resp = await httpService.put(`/employee/${id}`, { userName: employee?.userName, certFile: employee?.certFile.filter(f => f.fileName !== res?.data?.fileName) })
      await fetchApi();
    } catch (err) {
      console.log("file not able to be removed completly")
    }
  }

  const handleDocumentsSubmit = async (e) => {
    e.preventDefault();
    console.log(newUpload);
    if (documents?.uploads?.length > 0) {
      editDocuments(id, newUpload).then((res) =>
        console.log('From edit documents : ', res)
      );
    } else {
      postDocuments(id, newUpload).then((res) =>
        console.log('From post documents : ', res)
      );
    }
  };
  console.log('employeeemployee', employee);
  const [middleName, setmiddleName] = useState('');

  useEffect(() => {
    if (employee?.middleName === undefined) {
      console.log('JJDJDJDJ');
      // setmiddleName(' ');
    } else {
      setmiddleName(employee.middleName);

    }
  }, [employee.middleName]);
  // setProfile('0');

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
            to={{ pathname: `/app/administrator/payroll-view`, state: { id: record?._id, payrollData: payrollData, setSelectRender: 'payrollView' } }}
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
      render: (text, record) => (<span>{' '}{text}{' '}</span>)
    },
    {
      title: 'Doc File',
      dataIndex: 'Payroll_status',
      sorter: (a, b) => a.reason.length - b.reason.length,
      render: (text, record) => (<><span
        className="breadcrumb-item text-primary"
        role="button"
        onClick={(e) => {
          setPayslipRender('payslip');
        }}
      >
        Pay Slip
      </span></>)
    },
  ];

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Employee Profile</title>
        <meta name="description" content="Reactify Blank Page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        {/* /Page Header */}
        {loading ? (
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
          <>
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <h3 className="page-title">Profile</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/app/main/dashboard">Settings</Link>
                    </li>
                    <li className="breadcrumb-item active">Profile</li>
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <div className="card mb-0">
                <div className="card-body">
                  <div className="row">
                    <div className="col-12">
                      <Stack justifyContent={'space-between'} direction={'row'}>
                        <Stack
                          direction={'row'}
                          alignItems={'center'}
                          spacing={1}
                        >
                          {/* {employee?.fileInfoPic[0]?.filePath} */}



                          {employee?.fileInfoPic?<div>{employee?.fileInfoPic[0]?.filePath?<img src={employee?.fileInfoPic[0]?.filePath}
                            width="120" height="120" alt='profile_pic' /> : <>
                            <Avatar sx={{ bgcolor: red[400], height: 52, width: 52 }}>
                              {employee.name?.substr(0, 1)}
                            </Avatar></>}

                          </div>
                            : <Avatar sx={{ bgcolor: red[400], height: 52, width: 52 }}>
                              {employee.name?.substr(0, 1)}

                            </Avatar>}
                          {/* <Avatar
                            sx={{ bgcolor: red[400], height: 52, width: 52 }}
                          >
                            {employee.firstName?.substr(0, 1)}
                          </Avatar> */}
                          <Stack>
                            <div
                              style={{
                                fontSize: '1.1rem',
                                fontWeight: 600,
                              }}
                            >
                              {employee?.firstName + ' ' + middleName + ' ' + employee?.lastName}
                            </div>
                            <div><span className={'badge bg-inverse-info'}>{employee?.jobRole?.name?.toUpperCase()}</span></div>
                          </Stack>
                        </Stack>
                        <Stack
                          direction={'row'}
                          alignItems={'center'}
                          spacing={1}
                        >
                          <Link
                            to={`/app/profile/addemployee/${id}`}
                          >
                            <Button
                              sx={{
                                color: 'black',
                                width: '18px',
                                height: '30px',
                                fontSize: '1rem',
                              }}
                              onClick={() => console.log(employee)}
                            >
                              <EditIcon />
                            </Button>
                          </Link>
                        </Stack>
                      </Stack>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div
                  style={{
                    paddingRight: '0px',
                  }}
                  className="col-md-4"
                >
                  <div className="card"
                    id="accordionExample">
                    <div

                      className="card-body accordion"
                      style={{
                        minHeight: '70vh',
                      }}
                    >
                      <h3
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >

                        <button type="button"
                          style={{ border: 'none', backgroundColor: '#FFFFFF', fontSize: '18px' }}
                          data-toggle="collapse"
                          data-target="#Basic"
                          aria-expanded="false"
                          aria-controls="Basic">
                          <span style={{ color: 'black' }}>
                            <PersonIcon /></span> &nbsp;&nbsp;&nbsp;&nbsp;  Basic Information
                        </button>

                        <a
                          href="#"
                          data-toggle="modal"
                          data-target="#edit_emp_pinfo"
                        >
                          <span style={{ color: 'black', marginLeft: '115px' }}>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <EditIcon />
                          </span>
                        </a>
                      </h3>
                      <hr />
                      <div
                        id='Basic'
                        aria-labelledby="Basic"
                        data-parent="#accordionExample"
                        className='collapse show'
                        style={{
                          marginBottom: '10px',
                          fontSize: '1rem',
                          color: '#998b90',
                          marginBottom: '50px',
                        }}
                      ><Stack
                        direction={'row'}
                        marginBottom={2}
                        alignItems={'flex-end'}
                      >
                          <PhoneIcon />
                          <span>
                            &nbsp;&nbsp;&nbsp;&nbsp;{employee?.mobileNo}
                          </span>
                        </Stack>
                        <Stack
                          direction={'row'}
                          marginBottom={2}
                          alignItems={'flex-end'}
                        >
                          <EmailIcon />
                          <span>&nbsp;&nbsp;&nbsp;&nbsp;{employee?.email}</span>
                        </Stack>
                        {employee?.dob ? <>
                          <Stack
                            direction={'row'}
                            marginBottom={2}
                            alignItems={'flex-end'}
                          >
                            <CalanderIcon />
                            <span>
                              &nbsp;&nbsp;&nbsp;&nbsp;
                              {dateFormatter(employee?.dob)}

                            </span>

                          </Stack>
                        </>
                          : ""}
                        <Stack
                          direction={'row'}
                          marginBottom={2}
                          alignItems={'flex-end'}
                        >
                          Department :-
                          <span>
                            &nbsp;&nbsp;&nbsp;&nbsp;

                            {depts.filter(dept => dept._id === employee?.department).map(Department => (
                              <>{Department.name}</>
                            ))}
                            {/* {employee?.department} */}
                          </span>
                        </Stack>
                        <Stack
                          direction={'row'}
                          marginBottom={2}
                          alignItems={'flex-end'}
                        >
                          Gender :-
                          <span>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            {employee?.gender === 'MALE' ? 'Male' : "Female"}

                            {/* {employee?.gender === 'FEMALE' ? 'Female' : "Others"} */}
                          </span>
                        </Stack>


                      </div>


                      <h4
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <button type="button"
                          style={{ border: 'none', backgroundColor: '#FFFFFF', fontSize: '18px' }}
                          data-toggle="collapse"
                          data-target="#Personal"
                          aria-expanded="false"
                          aria-controls="Personal">
                          <span style={{ color: 'black' }}>
                            <SupervisorAccountIcon /></span> &nbsp;&nbsp;&nbsp;&nbsp;  Personal Information</button>

                        <a
                          href="#"
                          data-toggle="modal"
                          data-target="#edit_emp_pinfo"
                        >
                          <span style={{ color: 'black', marginLeft: '91px' }}>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <EditIcon />
                          </span>
                        </a>
                      </h4>
                      <hr />
                      <div
                        id='Personal'
                        aria-labelledby="Personal"
                        data-parent="#accordionExample"
                        className='collapse'
                        style={{
                          marginBottom: '15px',
                          fontSize: '1rem',
                          color: '#998b90',
                          marginBottom: '50px',
                        }}
                      >


                        {/* <Stack
                          direction={'row'}
                          marginBottom={2}
                          alignItems={'flex-end'}
                        >
                          Salary :-
                          <span>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            {employee?.salary}
                          </span>
                        </Stack> */}
                        <Stack
                          direction={'row'}
                          marginBottom={2}
                          alignItems={'flex-end'}
                        >
                          Work Loacation :-
                          <span>

                            &nbsp;&nbsp;&nbsp;&nbsp;
                            {employee?.workLocation?.name}
                          </span>
                        </Stack>
                        <Stack
                          direction={'row'}
                          marginBottom={2}
                          alignItems={'flex-end'}
                        >
                          Phone No :-
                          <span>
                            &nbsp;&nbsp;&nbsp;&nbsp;{employee?.mobileNo}
                          </span>
                        </Stack>
                        <Stack
                          direction={'row'}
                          marginBottom={2}
                          alignItems={'flex-end'}
                        >
                          Blood Group :-
                          <span>
                            &nbsp;&nbsp;&nbsp;&nbsp;{employee?.blood}
                          </span>
                        </Stack>
                        <Stack
                          direction={'row'}
                          marginBottom={2}
                          alignItems={'flex-end'}
                        >
                          Total Leaves :-
                          <span>
                            &nbsp;&nbsp;&nbsp;&nbsp;{employee?.totalLeaves}
                          </span>
                        </Stack>
                        <Stack
                          direction={'row'}
                          marginBottom={2}
                          alignItems={'flex-end'}
                        >
                          Employee Type :-
                          <span>
                            &nbsp;&nbsp;&nbsp;&nbsp;{employee?.employeeType}
                          </span>
                        </Stack>
                        <Stack
                          direction={'row'}
                          marginBottom={2}
                          alignItems={'flex-end'}
                        >
                          Religion :-
                          <span>
                            &nbsp;&nbsp;&nbsp;&nbsp;{employee?.personalInformation?.religion}
                          </span>
                        </Stack>
                        <Stack
                          direction={'row'}
                          marginBottom={2}
                          alignItems={'flex-end'}
                        >
                          Marital Status :-
                          <span>&nbsp;&nbsp;&nbsp;&nbsp;{employee?.personalInformation?.maritalStatus}</span>
                        </Stack>
                        <Stack
                          direction={'row'}
                          marginBottom={2}
                          alignItems={'flex-end'}
                        >
                          Employment of Spouse :-
                          <span>
                            &nbsp;&nbsp;&nbsp;&nbsp;{employee?.personalInformation?.employmentOfSpouse}
                          </span>
                        </Stack>
                        <Stack
                          direction={'row'}
                          marginBottom={2}
                          alignItems={'flex-end'}
                        >
                          No of Children :-
                          <span>&nbsp;&nbsp;&nbsp;&nbsp;{employee?.personalInformation?.numberOfChildren}</span>
                        </Stack>

                        <Stack
                          direction={'row'}
                          marginBottom={1}
                        // alignItems={'flex-end'}
                        >
                          <p>Present Address:- </p>
                          <div>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            {employee?.address?.addressLine1 && employee?.address?.addressLine1
                              .concat(', ')
                              .concat(', ')
                              .concat(employee?.address?.city || '')
                              .concat(', ')
                              .concat(employee?.address?.state || '')
                              .concat(' - ')
                              .concat(employee?.address?.postalCode || '')
                            }
                          </div>


                        </Stack>
                        <Stack
                          direction={'row'}
                          marginBottom={1}
                        // alignItems={'flex-end'}
                        >
                          <p>Permanent:- </p>
                          {/* <span>Permanent Address:- </span> */}
                          <div>
                            {/* &nbsp;&nbsp;&nbsp;&nbsp; */}
                            {employee?.address?.addressLine2
                              .concat(', ')
                              .concat(', ')
                              .concat(employee?.address?.Permanentcity || '')
                              .concat(', ')
                              .concat(employee?.address?.Permanentstate || '')
                              .concat(' - ')
                              .concat(employee?.address?.PermanentpostalCode || '')
                            }
                          </div>
                        </Stack>
                      </div>

                      {/* Bank Details  */}

                      <h4
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <button type="button"
                          style={{ border: 'none', backgroundColor: '#FFFFFF', fontSize: '18px' }}
                          data-toggle="collapse"
                          data-target="#bank"
                          aria-expanded="false"
                          aria-controls="Statutary">
                          <AccountBalanceIcon /> &nbsp;&nbsp;&nbsp;&nbsp;  Bank Details</button>
                        <a
                          href="#"
                          data-toggle="modal"
                          data-target="#edit_emp_bank"
                        >
                          <span style={{ color: 'black', marginLeft: '159px' }}>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <EditIcon />
                          </span>
                        </a>
                      </h4>
                      <hr />
                      <div
                        id='bank'
                        className='collapse'
                        aria-labelledby="bank"
                        data-parent="#accordionExample"
                        style={{
                          marginBottom: '15px',
                          fontSize: '1rem',
                          color: '#998b90',
                          marginBottom: '50px',
                        }}
                      >
                        <div className="experience-box">
                          <ul className="experience-list">
                            {employee?.bankDetails?.map((e) => {
                              return (
                                <li>
                                  <div className="experience-user">
                                    <div className="before-circle" />
                                  </div>
                                  <div className="experience-content">
                                    <div className="timeline-content">
                                      <a href="/" className="name">
                                        {e?.bankdetails1}
                                      </a>

                                      <div>A/c No :-{e?.accountNumber}</div>
                                      <div>Bank Name :{e?.bankname}</div>
                                      <div>Branch: {e?.branch}</div>
                                      <div>IFSC :{e?.IFSC}</div>
                                      <div> UPI Id :-{e?.upi}</div>
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                      {/* Other Details  */}


                      <h3

                        style={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <button type="button"
                          style={{ border: 'none', backgroundColor: '#FFFFFF', fontSize: '18px' }}
                          data-toggle="collapse"
                          data-target="#Statutary"
                          aria-expanded="false"
                          aria-controls="Statutary">
                          <AccountBoxIcon /> &nbsp;&nbsp;&nbsp;&nbsp; Statutary Details</button>
                        <a
                          href="#"
                          data-toggle="modal"
                          data-target="#edit_emp_other_details"
                        >
                          <span style={{ color: 'black', marginLeft: '122px' }}>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <EditIcon />
                          </span>
                        </a>
                      </h3>
                      <hr />
                      <div
                        id="Statutary"
                        className='collapse'
                        aria-labelledby="Statutary"
                        data-parent="#accordionExample"
                        style={{
                          marginBottom: '15px',
                          fontSize: '1rem',
                          color: '#998b90',
                          marginBottom: '50px',
                        }}
                      >
                        <Stack
                          direction={'row'}
                          marginBottom={2}
                          alignItems={'flex-end'}
                        >
                          Passport No :-
                          <span>
                            &nbsp;&nbsp;&nbsp;&nbsp;{employee?.personalInformation?.passportNo}
                          </span>
                        </Stack>
                        {/* <Stack
                          direction={'row'}
                          marginBottom={2}
                          alignItems={'flex-end'}
                        >
                          Exp. Date :-
                          <span>&nbsp;&nbsp;&nbsp;&nbsp;{employee?.personalInformation?.passportExp}</span>
                        </Stack> */}
                        <Stack
                          direction={'row'}
                          marginBottom={2}
                          alignItems={'flex-end'}
                        >
                          Pan No :-
                          <span>
                            &nbsp;&nbsp;&nbsp;&nbsp;{employee?.personalInformation?.pan}
                          </span>
                        </Stack>
                        <Stack
                          direction={'row'}
                          marginBottom={2}
                          alignItems={'flex-end'}
                        >
                          ESI Number :-
                          <span>
                            &nbsp;&nbsp;&nbsp;&nbsp;{employee?.personalInformation?.esino}
                          </span>
                        </Stack>
                        <Stack
                          direction={'row'}
                          marginBottom={2}
                          alignItems={'flex-end'}
                        >
                          PF Number :-
                          <span>
                            &nbsp;&nbsp;&nbsp;&nbsp;{employee?.personalInformation?.pfno}
                          </span>
                        </Stack>

                        {/* <Stack
                          direction={'row'}
                          marginBottom={2}
                          alignItems={'flex-end'}
                        >
                          Nationality :-
                          <span>&nbsp;&nbsp;&nbsp;&nbsp;{employee?.personalInformation?.nationality}</span>
                        </Stack> */}




                      </div>

                      {/* Education  */}
                      <h3
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <SchoolIcon />&nbsp;&nbsp;&nbsp;&nbsp;
                        <button type="button"
                          style={{ border: 'none', backgroundColor: '#FFFFFF', fontSize: '18px' }}
                          data-toggle="collapse"
                          data-target="#Education"
                          aria-expanded="false"
                          aria-controls="Education">
                          Education information</button>
                        <a
                          href="#"
                          data-toggle="modal"
                          data-target="#edit_emp_edu"
                        >
                          <span style={{ color: 'black', marginLeft: '78px' }}>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <EditIcon />
                          </span>
                        </a>
                      </h3>
                      <hr />
                      <div
                        id="Education"
                        className='collapse'
                        aria-labelledby="Education"
                        data-parent="#accordionExample"
                        style={{
                          marginBottom: '15px',
                          fontSize: '1rem',
                          color: '#998b90',
                          marginBottom: '50px',
                        }}
                      >
                        <div className="experience-box">
                          <ul className="experience-list">
                            {employee?.education.map((e) => {
                              return (
                                <li>
                                  <div className="experience-user">
                                    <div className="before-circle" />
                                  </div>
                                  <div className="experience-content">
                                    <div className="timeline-content">
                                      <a href="/" className="name">
                                        {e?.university}
                                      </a>

                                      <div>{e?.specialization}</div>
                                      <div>GPA: {e?.score}</div>

                                      <span className="time">
                                        {e?.startDate} To{' '}
                                        {e?.endDate}
                                      </span>
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                      <h3
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <BusinessCenterOutlinedIcon />&nbsp;&nbsp;&nbsp;&nbsp;
                        <button type="button"
                          style={{ border: 'none', backgroundColor: '#FFFFFF', fontSize: '18px' }}
                          data-toggle="collapse"
                          data-target="#Experience"
                          aria-expanded="false"
                          aria-controls="Experience">
                          Experience information</button>
                        <a
                          href="#"
                          data-toggle="modal"
                          data-target="#edit_emp_exp"
                        >
                          <span style={{ color: 'black', marginLeft: '70px' }}>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <EditIcon />
                          </span>
                        </a>
                      </h3>
                      <hr />
                      <div
                        id="Experience"
                        className='collapse'
                        aria-labelledby="Experience"
                        data-parent="#accordionExample"
                        style={{
                          marginBottom: '15px',
                          fontSize: '1rem',
                          color: '#998b90',
                          marginBottom: '50px',
                        }}
                      >
                        <div className="experience-box">
                          <ul className="experience-list">
                            {employee?.previousExperience.map((exp) => {
                              return (
                                <li>
                                  <div className="experience-user">
                                    <div className="before-circle" />
                                  </div>
                                  <div className="experience-content">
                                    <div className="timeline-content">
                                      {exp?.designation} at{' '}
                                      <a href="/" className="name">
                                        {exp?.company}
                                      </a>
                                      <span className="time">
                                        Start Date:{' '}
                                        {exp?.startDate?.split('T')[0]}
                                      </span>
                                      <span className="time">
                                        End Date1:
                                        {exp?.endDate?.split('T')[0]}
                                      </span>
                                      <span className="time">
                                        Experience letter :

                                        {employee?.resumeExp && employee?.resumeExp?.length > 0 && (

                                          employee?.resumeExp.map((file, index) => (
                                            // <li className="list-group-item d-flex justify-content-between" key={index}>
                                            <a href={file?.filePath} target="_blank">{file?.fileName.split("_")[2]}</a>

                                          ))
                                          // <a href={file?.filePath} target="_blank">{file?.fileName.split("_")[2]}</a>

                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>

                      <h3
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div className='float-left'>
                          <PhoneIcon />&nbsp;&nbsp;&nbsp;&nbsp;
                          <button type="button"
                            style={{ border: 'none', backgroundColor: '#FFFFFF', fontSize: '18px' }}
                            data-toggle="collapse"
                            data-target="#emergency"
                            aria-expanded="false"
                            aria-controls="emergency">
                            Emergency Contacts</button>
                          <span style={{ fontSize: '18px' }}>
                            ({employee?.emergencyContact[0]?.name ? employee?.emergencyContact?.length : 0})
                          </span>

                          <div className='float-right'>
                            <a
                              href="#"
                              // className="btn add-btn"
                              data-toggle="modal"
                              data-target="#edit_emp_contact"
                            >
                              {/* <EditIcon /> */}
                              <span style={{ color: 'black', marginLeft: '69px' }}>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <EditIcon />
                              </span>
                            </a>
                          </div>
                        </div>

                      </h3>
                      <hr />
                      <div

                        id="emergency"
                        className='collapse'
                        aria-labelledby="emergency"
                        data-parent="#accordionExample"
                        style={{
                          marginBottom: '15px',
                          fontSize: '1rem',
                          color: '#998b90',
                          marginBottom: '50px',
                        }}
                      >

                        {employee?.emergencyContact?.length && employee?.emergencyContact[0]?.name ?
                          employee?.emergencyContact?.map((pc) => (
                            <>
                              <Stack direction={'row'} alignItems={'center'} spacing={1}>
                                <Avatar sx={{ bgcolor: red[400], height: 52, width: 52 }}>
                                  {pc.name?.substr(0, 1)}
                                </Avatar>
                                <Stack>
                                  <div
                                    style={{
                                      fontSize: '1.1rem',
                                      fontWeight: 500,
                                    }}
                                  >
                                    <Person />
                                    <span>&nbsp;&nbsp;&nbsp;&nbsp;{pc?.name}</span>
                                    <br />
                                    <Person />
                                    <span>&nbsp;&nbsp;&nbsp;&nbsp;{pc?.relationship}</span>
                                    <br />
                                    <PhoneIcon />
                                    <span>&nbsp;&nbsp;&nbsp;&nbsp;{pc?.phone}</span>
                                    <br />
                                  </div>
                                </Stack>
                              </Stack>
                              <hr />
                            </>
                          ))
                          :
                          <Stack
                            direction={'row'}
                            marginBottom={2}
                            alignItems={'flex-end'}
                          >
                            No Contacts Available
                          </Stack>
                        }
                      </div>


                    </div>
                  </div>
                </div>
                <div
                  style={{
                    paddingLeft: '0px',
                  }}
                  className="col-md-8 p-r-0"
                >
                  <div className="card tab-box">
                    <div className="row user-tabs">
                      <div className="col-lg-12 col-md-12 col-sm-12 line-tabs">
                        <ul className="nav nav-tabs nav-tabs-bottom">
                          <li className="nav-item">
                            <a
                              href="#activities"
                              data-toggle="tab"
                              className="nav-link active"
                            >
                              Activities
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              href="#payroll"
                              data-toggle="tab"
                              className="nav-link"
                              onClick={(e) => { setEvoke(true) }}
                            >
                              Payroll
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              href="#week-sprint"
                              data-toggle="tab"
                              className="nav-link"
                              onClick={(e) => { setWeek_sprint(true) }}
                            >
                              Week Sprint
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              href="#documents"
                              data-toggle="tab"
                              className="nav-link"
                              onClick={() => setCert(false)}
                            >
                              Documents
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              href="#certificate"
                              data-toggle="tab"
                              className="nav-link"
                              onClick={() => setCert(true)}
                            >
                              Certificate
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              href="#Experience11"
                              data-toggle="tab"
                              className="nav-link"
                              onClick={() => setCert(true)}
                            >
                              Experience
                            </a>
                          </li>
                          {/* <li className="nav-item">
                            <a
                              href="#emails"
                              data-toggle="tab"
                              className="nav-link"
                            >
                              Email
                            </a>
                          </li> */}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      minHeight: '65vh',
                      maxHeight: '65vh',
                      overflowY: 'auto',
                    }}
                    className="card p-4 tab-content"
                  >
                    <div
                      id="activities"
                      className="pro-overview tab-pane fade show active"
                    >
                      <h3>Activities</h3>
                      <hr />
                      <Timeline>
                        {activityItems?.map((n) => (
                          <TimelineItem>
                            <TimelineOppositeContent>
                              <h6
                                style={{
                                  marginTop: '16px',
                                }}
                                className="mb-0"
                              >
                                <span
                                  style={{
                                    fontWeight: 'bold',
                                  }}
                                >
                                  {new Date(n?.notifyDate).toLocaleDateString()}
                                </span>{' '}
                                at {new Date(n?.notifyDate).toLocaleTimeString()}
                              </h6>
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                              <TimelineDot>
                                <LaptopMacIcon />
                              </TimelineDot>
                              <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>
                              <Paper
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                }}
                                elevation={1}
                                className={classes.paper}
                              >
                                <h5>{n?.notifyHead}</h5>
                                <hr
                                  style={{
                                    margin: '0px',
                                    marginBottom: '8px',
                                  }}
                                />
                                <p>{n?.notifyBody}</p>
                              </Paper>
                            </TimelineContent>
                          </TimelineItem>
                        ))}
                      </Timeline>
                    </div>
                    <div
                      id="payroll"
                      className="pro-overview tab-pane fade show"
                    >
                      <h3>Payroll</h3>
                      <hr />
                      {/* {evoke === true ? (<PayrollView id={id} payrollData={data}/>):("no data")} */}
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
                              dataSource={payrollData}
                              rowKey={(record) => record.id}
                              onChange={console.log('chnage')}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      id="week-sprint"
                      className="pro-overview tab-pane fade show"
                    >
                      <h3>Week Sprint</h3>
                      <hr />
                      {week_sprint === true ? (<EmpWeekSprint id={employee?._id} empTask={empTask} />) : ("no data")}
                    </div>
                    <div
                      id="documents"
                      className="pro-overview tab-pane fade show"
                    >
                      <h3>
                        Documents{' '}
                        <a
                          href="#"
                          data-toggle="modal"
                          data-target="#upload_document_modal"
                          style={{ float: 'right' }}
                        >
                          {/* {isAdmin && ( */}
                          <span style={{ color: 'black' }}>
                            <UploadFileOutlined />
                            &nbsp;&nbsp;&nbsp;
                          </span>
                          {/* )} */}
                        </a>
                      </h3>

                      <hr />
                      {/* <DocumentsPane documents={documents} /> */}
                      {employee?.fileInfos && employee?.fileInfos?.length > 0 && (
                        <div className="card">
                          <div className="card-header">List of Files</div>
                          <ul className="list-group list-group-flush">
                            {employee?.fileInfos.map((file, index) => (
                              <li className="list-group-item d-flex justify-content-between" key={index}>
                                <a href={file?.filePath} target="_blank">{file?.fileName.split("_")[2]}</a>
                                <Delete onClick={() => removeFileFn(file?.fileName)} />
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div
                      id="certificate"
                      className="pro-overview tab-pane fade show"
                    >
                      <h3>
                        Certificate{' '}
                        <a
                          href="#"
                          data-toggle="modal"
                          data-target="#upload_document_modal"
                          style={{ float: 'right' }}

                        >
                          {isAdmin && (
                            <span style={{ color: 'black' }}>
                              <UploadFileOutlined />
                              &nbsp;&nbsp;&nbsp;
                            </span>
                          )}
                        </a>

                      </h3>

                      <hr />
                      {/* <DocumentsPane documents={documents} /> */}
                      {employee?.certFile && employee?.certFile?.length > 0 && (
                        <div className="card">
                          <div className="card-header">List of Files</div>
                          <ul className="list-group list-group-flush">
                            {employee?.certFile.map((file, index) => (
                              <li className="list-group-item d-flex justify-content-between" key={index}>
                                <a href={file?.filePath} target="_blank">{file?.fileName.split("_")[2]}</a>
                                <Delete onClick={() => removeCertFn(file?.fileName)} />
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    </div>


                    <div
                      id="Experience11"
                      className="pro-overview tab-pane fade show"
                    >
                      <h3>
                        Experience{' '}
                        {/* <a
                          href="#"
                          data-toggle="modal"
                          data-target="#upload_document_modal"
                          style={{ float: 'right' }}

                        >
                          {isAdmin && (
                            <span style={{ color: 'black' }}>
                              <UploadFileOutlined />
                              &nbsp;&nbsp;&nbsp;
                            </span>
                          )}
                        </a> */}

                      </h3>
                      <hr />
                      {/* <DocumentsPane documents={documents} /> */}

                      {employee?.resumeExp && employee?.resumeExp?.length > 0 && (
                        <div className="card">
                          <div className="card-header">List of Files</div>
                          <ul className="list-group list-group-flush">
                            {employee?.resumeExp.map((file, index) => (
                              <li className="list-group-item d-flex justify-content-between" key={index}>
                                <a href={file?.filePath} target="_blank">{file?.fileName.split("_")[2]}</a>
                                {/* <Delete onClick={() => removeCertFn(file?.fileName)} /> */}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>



                    <div
                      id="emails"
                      className="pro-overview tab-pane fade show"
                    >
                      <h3>Email</h3>
                      <hr />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {/* /Page Content */}
      {/* Profile Modal */}

      <div id="profile_old_info" className="modal custom-modal fade" role="dialog">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Profile Information</h5>
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
                <div className="row">
                  <div className="col-md-12">
                    <div className="profile-img-wrap edit-img">
                      <img
                        className="inline-block"
                        src={Avatar_02}
                        alt="user"
                      />
                      <div className="fileupload btn">
                        <span className="btn-text">edit</span>
                        <input className="upload" type="file" />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>First Name</label>
                          <input
                            name="firstName"
                            type="text"
                            className="form-control"
                            defaultValue={employee?.firstName}
                            onChange={handleEmployeeDetailsChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Last Name</label>
                          <input
                            name="lastName"
                            type="text"
                            className="form-control"
                            defaultValue={employee?.lastName}
                            onChange={handleEmployeeDetailsChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Email</label>
                          <input
                            name="email"
                            type="text"
                            className="form-control"
                            defaultValue={employee?.email}
                            onChange={handleEmployeeDetailsChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Birth Date</label>
                          <div>
                            <input
                              name="dob"
                              className="form-control"
                              type="date"
                              defaultValue={dateFormatter(employee?.dob)}
                              onChange={handleEmployeeDetailsChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Gender</label>
                          <div className="form-group form-focus focused text-left">
                            <a
                              className="btn form-control btn-white dropdown-toggle"
                              href="#"
                              data-toggle="dropdown"
                              aria-expanded="false"
                            >
                              {newEmployeeDetails?.gender || 'Gender'}
                            </a>
                            <div className="dropdown-menu dropdown-menu-right">
                              {GENDERS.map((gender) => (
                                <span
                                  className="dropdown-item"
                                  onClick={() =>
                                    setNewEmployeeDetails({
                                      ...newEmployeeDetails,
                                      gender: gender,
                                    })
                                  }
                                >
                                  {gender}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Employee ID</label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue={employee?._id}
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Address</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={employee?.address?.addressLine1 && employee?.address?.addressLine1
                          .concat(', ')
                          .concat(employee?.address?.addressLine2)
                          .concat(', ')
                          .concat(employee?.address?.city)}
                        onChange={(e) =>
                          setNewEmployeeDetails({
                            ...newEmployeeDetails,
                            address: {
                              ...newEmployeeDetails.address,
                              addressLine1: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={employee?.address?.state}
                        onChange={(e) =>
                          setNewEmployeeDetails({
                            ...newEmployeeDetails,
                            address: {
                              ...newEmployeeDetails.address,
                              state: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Country</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={employee?.address?.country}
                        onChange={(e) =>
                          setNewEmployeeDetails({
                            ...newEmployeeDetails,
                            address: {
                              ...newEmployeeDetails.address,
                              country: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Pin Code</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={employee?.address?.postalCode}
                        onChange={(e) =>
                          setNewEmployeeDetails({
                            ...newEmployeeDetails,
                            address: {
                              ...newEmployeeDetails.address,
                              postalCode: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        name="mobileNo"
                        type="text"
                        className="form-control"
                        defaultValue={employee?.mobileNo}
                        onChange={handleEmployeeDetailsChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Salary</label>
                      <input
                        name="salary"
                        type="text"
                        className="form-control"
                        defaultValue={employee?.salary}
                        onChange={handleEmployeeDetailsChange}
                        disabled={!isAdmin}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>
                        Job Role <span className="text-danger">*</span>
                      </label>
                      <div className="form-focus focused text-left">
                        <a
                          className="btn form-control btn-white dropdown-toggle"
                          href="#"
                          data-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {newEmployeeDetails?.jobRole?.name || 'Job Role'}
                        </a>
                        <div className="dropdown-menu dropdown-menu-right">
                          {roleData.map((role) => (
                            <span
                              className="dropdown-item"
                              onClick={() =>
                                isAdmin
                                  ? setNewEmployeeDetails({
                                    ...newEmployeeDetails,
                                    jobRole: { ...role },
                                  })
                                  : console.log('Only admin can change roles!')
                              }
                            >
                              {role?.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bank Details Form */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>IFSC</label>
                      <input
                        type="text"
                        name="IFSC"
                        className="form-control"
                        defaultValue={employee?.bankDetails?.IFSC}
                        onChange={(e) =>
                          setNewEmployeeDetails({
                            ...newEmployeeDetails,
                            bankDetails: {
                              ...newEmployeeDetails.bankDetails,
                              [e.target.name]: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Aadhar</label>
                      <input
                        type="text"
                        name="aadhar"
                        className="form-control"
                        defaultValue={employee?.bankDetails?.aadhar}
                        onChange={(e) =>
                          setNewEmployeeDetails({
                            ...newEmployeeDetails,
                            bankDetails: {
                              ...newEmployeeDetails.bankDetails,
                              [e.target.name]: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Account No.</label>
                      <input
                        type="text"
                        name="accountNumber"
                        className="form-control"
                        defaultValue={employee?.bankDetails?.accountNumber}
                        onChange={(e) =>
                          setNewEmployeeDetails({
                            ...newEmployeeDetails,
                            bankDetails: {
                              ...newEmployeeDetails.bankDetails,
                              [e.target.name]: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Account Holder</label>
                      <input
                        type="text"
                        name="accountHoldersName"
                        className="form-control"
                        defaultValue={employee?.bankDetails?.accountHoldersName}
                        onChange={(e) =>
                          setNewEmployeeDetails({
                            ...newEmployeeDetails,
                            bankDetails: {
                              ...newEmployeeDetails.bankDetails,
                              [e.target.name]: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>PAN</label>
                      <input
                        type="text"
                        name="pan"
                        className="form-control"
                        defaultValue={employee?.bankDetails?.pan}
                        onChange={(e) =>
                          setNewEmployeeDetails({
                            ...newEmployeeDetails,
                            bankDetails: {
                              ...newEmployeeDetails.bankDetails,
                              [e.target.name]: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>UPI</label>
                      <input
                        type="text"
                        name="upi"
                        className="form-control"
                        defaultValue={employee?.bankDetails?.upi}
                        onChange={(e) =>
                          setNewEmployeeDetails({
                            ...newEmployeeDetails,
                            bankDetails: {
                              ...newEmployeeDetails.bankDetails,
                              [e.target.name]: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    onClick={handleNewEmployeeDetailsSubmit}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Profile Modal */}

      {/* Personal Info Modal */}
      <div
        id="personal_info_modal"
        className="modal custom-modal fade"
        role="dialog"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Personal Information</h5>
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
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Passport No</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={employee?.personalInformation?.passportNo}
                        onChange={(e) =>
                          setNewEmployeeDetails({
                            ...newEmployeeDetails,
                            personalInformation: {
                              ...newEmployeeDetails.personalInformation,
                              passportNo: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  {/* <div className="col-md-6">
                    <div className="form-group">
                      <label>Passport Expiry Date</label>
                      <div>
                        <input
                          className="form-control"
                          type="date"
                          onChange={(e) =>
                            setNewEmployeeDetails({
                              ...newEmployeeDetails,
                              personalInformation: {
                                ...newEmployeeDetails.personalInformation,
                                passportExp: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div> */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        className="form-control"
                        type="text"
                        defaultValue={employee?.personalInformation?.phoneNo}
                        onChange={(e) =>
                          setNewEmployeeDetails({
                            ...newEmployeeDetails,
                            personalInformation: {
                              ...newEmployeeDetails.personalInformation,
                              phoneNo: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>
                        Nationality <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        defaultValue={
                          employee?.personalInformation?.nationality
                        }
                        onChange={(e) =>
                          setNewEmployeeDetails({
                            ...newEmployeeDetails,
                            personalInformation: {
                              ...newEmployeeDetails.personalInformation,
                              nationality: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Religion</label>
                      <div>
                        <input
                          className="form-control"
                          type="date"
                          defaultValue={employee?.personalInformation?.religion}
                          onChange={(e) =>
                            setNewEmployeeDetails({
                              ...newEmployeeDetails,
                              personalInformation: {
                                ...newEmployeeDetails.personalInformation,
                                religion: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>
                        Marital status <span className="text-danger">*</span>
                      </label>
                      <div className="form-group form-focus focused text-left">
                        <a
                          className="btn form-control btn-white dropdown-toggle"
                          href="#"
                          data-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {newEmployeeDetails?.personalInformation
                            ?.maritalStatus || 'Marital Status'}
                        </a>
                        <div className="dropdown-menu dropdown-menu-right">
                          {MARITAL_STATUS.map((s) => (
                            <span
                              className="dropdown-item"
                              onClick={() =>
                                setNewEmployeeDetails({
                                  ...newEmployeeDetails,
                                  personalInformation: {
                                    ...newEmployeeDetails.personalInformation,
                                    maritalStatus: s,
                                  },
                                })
                              }
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Employment of spouse</label>
                      <input
                        className="form-control"
                        type="text"
                        defaultValue={
                          employee?.personalInformation?.employmentOfSpouse
                        }
                        onChange={(e) =>
                          setNewEmployeeDetails({
                            ...newEmployeeDetails,
                            personalInformation: {
                              ...newEmployeeDetails.personalInformation,
                              employmentOfSpouse: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>No. of children </label>
                      <input
                        className="form-control"
                        type="text"
                        defaultValue={
                          employee?.personalInformation?.numberOfChildren
                        }
                        onChange={(e) =>
                          setNewEmployeeDetails({
                            ...newEmployeeDetails,
                            personalInformation: {
                              ...newEmployeeDetails.personalInformation,
                              numberOfChildren: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    onClick={handleNewEmployeeDetailsSubmit}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Personal Info Modal */}
      {/* Family Info Modal */}
      <div
        id="family_info_modal"
        className="modal custom-modal fade"
        role="dialog"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title"> Family Informations</h5>
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
                <div className="form-scroll">
                  <div className="card">
                    <div className="card-body">
                      <h3 className="card-title">
                        Family Member{' '}
                        <a href="" className="delete-icon">
                          <i className="fa fa-trash-o" />
                        </a>
                      </h3>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              Name <span className="text-danger">*</span>
                            </label>
                            <input className="form-control" type="text" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              Relationship{' '}
                              <span className="text-danger">*</span>
                            </label>
                            <input className="form-control" type="text" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              Date of birth{' '}
                              <span className="text-danger">*</span>
                            </label>
                            <input className="form-control" type="text" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              Phone <span className="text-danger">*</span>
                            </label>
                            <input className="form-control" type="text" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-body">
                      <h3 className="card-title">
                        Education Informations{' '}
                        <a href="" className="delete-icon">
                          <i className="fa fa-trash-o" />
                        </a>
                      </h3>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              Name <span className="text-danger">*</span>
                            </label>
                            <input className="form-control" type="text" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              Relationship{' '}
                              <span className="text-danger">*</span>
                            </label>
                            <input className="form-control" type="text" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              Date of birth{' '}
                              <span className="text-danger">*</span>
                            </label>
                            <input className="form-control" type="text" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              Phone <span className="text-danger">*</span>
                            </label>
                            <input className="form-control" type="text" />
                          </div>
                        </div>
                      </div>
                      <div className="add-more">
                        <a href="">
                          <i className="fa fa-plus-circle" /> Add More
                        </a>
                      </div>
                    </div>
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
      {/* /Family Info Modal */}
      {/* Emergency Contact Modal */}
      <div
        id="emergency_contact_modal"
        className="modal custom-modal fade"
        role="dialog"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Personal Information</h5>
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
                <div className="card">
                  <div className="card-body">
                    <h3 className="card-title">Primary Contact</h3>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>
                            Name <span className="text-danger">*</span>
                          </label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>
                            Relationship <span className="text-danger">*</span>
                          </label>
                          <input className="form-control" type="text" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>
                            Phone <span className="text-danger">*</span>
                          </label>
                          <input className="form-control" type="text" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Phone 2</label>
                          <input className="form-control" type="text" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <h3 className="card-title">Primary Contact</h3>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>
                            Name <span className="text-danger">*</span>
                          </label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>
                            Relationship <span className="text-danger">*</span>
                          </label>
                          <input className="form-control" type="text" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>
                            Phone <span className="text-danger">*</span>
                          </label>
                          <input className="form-control" type="text" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Phone 2</label>
                          <input className="form-control" type="text" />
                        </div>
                      </div>
                    </div>
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
      {/* Upload Documents Modal */}
      <div
        id="oldupload_document_modal"
        className="modal custom-modal fade"
        role="dialog"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Upload Documents</h5>
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
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Document</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) =>
                          handleDocumentChange(e.target.files[0] || null)
                        }
                        style={{ border: 'none' }}
                        disabled={!isAdmin}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Description</label>
                      <input
                        className="form-control"
                        type="text"
                        onChange={(e) =>
                          setNewUpload({
                            ...newUpload,
                            description: e.target.value,
                          })
                        }
                        disabled={!isAdmin}
                      />
                    </div>
                  </div>
                </div>
                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    onClick={handleDocumentsSubmit}
                    disabled={!isAdmin}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Upload Documents Modal */}

      {/* Edit emp eduction modal  */}
      {payslipRender === 'payslip' ? (
        <Payslip
          payrollData={payrollData}
          setPayslipRender={setPayslipRender}
        />
      ) : (
        <></>
      )}
      {employee?._id &&

        <>
          <EditEmpPersonal empId={id} pData={{ middleName: employee.middleName, blood: employee?.blood, firstName: employee?.firstName, lastName: employee?.lastName, email: employee?.email, dob: new Date(employee?.dob || '2022-04-30T18:30:00.000Z'), gender: employee?.gender, mobileNo: employee?.mobileNo, salary: employee?.salary, jobRole: employee?.jobRole?._id, workLocation: employee?.workLocation?._id, department: employee?.department }} addressData={employee?.address} setEmployee={fetchApi} userName={employee?.userName} />
          <EditEmpEdu empId={id} eduData={employee?.education} setEmployee={fetchApi} userName={employee?.userName} />
          <EditEmpExp empId={id} expData={employee?.previousExperience} setEmployee={fetchApi} userName={employee?.userName} />
          <EditEmpBank setEmployee={fetchApi} empId={id} bankData={employee?.bankDetails} userName={employee?.userName} />
          <EditEmpOtherDetails empId={id} oData={employee?.personalInformation} setEmployee={fetchApi} userName={employee?.userName} />
          <EditEmpContact empId={id} conData={employee?.emergencyContact} setEmployee={fetchApi} userName={employee?.userName} />
          <UploadDocument putLink={`/employee/${id}`} fileInfoArr={employee?.fileInfos} certArr={employee?.certFile} fetchApi={fetchApi} userName={employee?.userName} cert={cert} />
        </>
      }


    </div>
  );
};
export default EmployeeProfile; 