/**
 * TermsCondition Page
 */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { editDocuments, getACustomer, getDocuments, postDocuments } from './../../../lib/api/index';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { Table } from 'antd';
import 'antd/dist/antd.css';
import { itemRender, onShowSizeChange } from '../../paginationfunction';
import '../../antdstyle.css';
import httpService from '../../../lib/httpService';
import Swal from 'sweetalert2';
import { Backdrop, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { makeStyles } from '@material-ui/core';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import { red } from '@mui/material/colors';
import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';
import PhoneIcon from '@mui/icons-material/PhoneOutlined';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import AddressIcon from '@mui/icons-material/LocationOnOutlined';
import UserTransect from '../../Accounts/UserTransect';
import VendorTrxTable from './VendorTrxTable';
import { getTransactionByUserId } from '../../../features/account/accountSlice';
import { DeleteOutline, Delete, Person, Upload, UploadFileOutlined } from '@mui/icons-material';
import DocumentsPane from './panes/DocumentsPane';
import { fileToDataURI } from '../../../misc/helpers';
import AddProjectModal from './AddProjectModal';
import VendorProjectTable from './VendorProjectTable';
import AddVendorModel from '../../Purchase/AddVendorModel';
import EditVendorAddress from './EditVendorAddress';
import EditVendorOtherDetails from './EditVendorOtherDetails';
import EditVendorPersonContact from './EditVendorPersonContact';
import AddVendorComment from './AddVendorComment';
import { Table as Tb } from '@mui/material';
import FileUploadModel from '../../Purchase/FileUploadModel';
import AddLandSale from './AddLandSale';
import FileUploadService from './FileUploadService';
import UploadDocument from './UploadDocument';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'


import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
  TimelineDot,
} from '@material-ui/lab';
import LaptopMacIcon from '@material-ui/icons/LaptopMac';
import { AccountBalanceWallet } from '@material-ui/icons';

// import EmailIcon from '@mui/icons-material/Email';
// import CallIcon from '@mui/icons-material/Call';

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


function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.getElementById(elmnt.id + 'header')) {
    document.getElementById(elmnt.id + 'header').onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
    elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

const Invoices = (props) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }
    fetchInvoice();
  }, []);

  useEffect(() => {
    fetchInvoice();
  }, [props.invoice]);

  const handleDelete = async (id) => {
    console.log(id);
    Swal.fire({
      title: 'Delete Invoice',
      text: 'Are you sure you want to delete this invoice?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Proceed',
      preConfirm: () => {
        return httpService.delete(`/sale-invoice/${id}`);
      },
    }).then((result) => {
      if (result.isConfirmed) {
        fetchInvoice();
        Swal.fire(
          'Invoice Deleted',
          'Invoice has been deleted successfully',
          'success'
        );
      }
    });
  };

  const handleMarkAsPaid = async (invoice) => {
    Swal.fire({
      title: 'Mark as Paid',
      text: 'Are you sure you want to mark this invoice as paid?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Proceed',
      preConfirm: () => {
        return httpService.post(`/sale-payment`, {
          invoice: invoice._id,
          customer: invoice.customer._id,
          amount: invoice.total,
          paymentMode: 'Manual Record',
          paymentDate: new Date(),
        });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        fetchInvoice();
        Swal.fire(
          'Invoice Marked as Paid',
          'Invoice has been marked as paid successfully',
          'success'
        );
      }
    });
  };

  const fetchInvoice = async () => {
    console.log('========Inv Prop========');
    const invoices = props.invoice;
    console.log(invoices);

    setData(
      invoices?.map((invoice, index) => ({
        ...invoice,
        id: index + 1,
        invoicenumber: 'INV-' + invoice._id.toString().padStart(4, '0'),
        createddate: new Date(invoice.createdAt).toGMTString().substring(4, 16),
        duedate: new Date(invoice.invoiceDate).toGMTString().substring(4, 16),
        client: invoice.customer.name,
        amount: invoice.total,
        status:
          invoice.type === 'RECURRING'
            ? 'Monthly ' + invoice.status
            : invoice.status,
      }))
    );
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      sorter: (a, b) => a.id.length - b.id.length,
    },
    {
      title: 'Invoice Number',
      dataIndex: 'invoicenumber',
      render: (text, record) => (
        <Link to={`/app/sales/invoices-view/${record._id}`}>#{text}</Link>
      ),
      sorter: (a, b) => a.invoicenumber.length - b.invoicenumber.length,
    },
    {
      title: 'Due Date',
      dataIndex: 'duedate',
      sorter: (a, b) => a.duedate.length - b.duedate.length,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      render: (text, record) => <span>₹ {text}</span>,
      sorter: (a, b) => a.amount.length - b.amount.length,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text, record) => (
        <span
          className={
            text.includes('Paid')
              ? 'badge bg-inverse-success'
              : 'badge bg-inverse-info'
          }
        >
          {text}
        </span>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
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
            <a
              onClick={(e) => {
                e.preventDefault();
                console.log(record.status);
                if (record.status === 'Paid') {
                  Swal.fire('Invoice Paid already', '', 'success');
                  return;
                }
                handleMarkAsPaid(record);
              }}
              className="dropdown-item"
              href="#"
            >
              <i className="fa fa-file-pdf-o m-r-5" /> Mark Paid
            </a>
            <Link
              className="dropdown-item"
              to={`/app/sales/invoices-edit/${record._id}`}
            >
              <i className="fa fa-pencil m-r-5" /> Edit
            </Link>
            <Link className="dropdown-item" to="/app/sales/invoices-view">
              <i className="fa fa-eye m-r-5" /> View
            </Link>
            <a className="dropdown-item" href="#">
              <i className="fa fa-file-pdf-o m-r-5" /> Download
            </a>
            <a
              onClick={(e) => {
                e.preventDefault();
                // console.log(record);
                handleDelete(record._id);
              }}
              className="dropdown-item"
              href="#"
            >
              <i className="fa fa-trash-o m-r-5" /> Delete
            </a>
          </div>
        </div>
      ),
    },
  ];
  return (
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
            dataSource={data}
            rowKey={(record) => record.id}
          />
        </div>
      </div>
    </div>
  );
};

const VendorProfile = () => {

  const dispatch = useDispatch();
  const classes = useStyles();
  // const { user } = JSON.parse(localStorage.getItem('auth'));
  const [customer, setCustomer] = useState(null);
  const user = useSelector((state) => state.authentication.value.user);
  let { id } = useParams();
  const [addInvoiceModal, setAddInvoiceModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState({});
  const [selectedPlot, setSelectedPlot] = useState({});
  const [projects, setProjects] = useState([]);
  const [documents, setDocuments] = useState(null);
  const [delCom, setDelCom] = useState("");
  const [newUpload, setNewUpload] = useState({
    data: '',
    description: '',
    uploadedAt: new Date(),
  });

  // credit 
  const [vendorAllCreditAmount, setvendorAllCreditAmount] = useState(0);

  const fetchProjects = async () => {
    const res = await httpService.get('/project');
    setProjects(res.data);
  };
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = user && user?.userType === 'admin';

  async function fetchApi() {
    const res = await httpService.get('/vendor/' + id);
    setCustomer(res.data);
    setIsLoading(false);
  }

  const { userTrx } = useSelector((state) => state.account);

  const data = userTrx.map((t) => t.transaction).flat();

  let totalAmount = data.reduce((previousValue, currentValue) => {
    let amount = currentValue.credits ? previousValue + currentValue.credits : previousValue - currentValue.debits;
    return amount;
  }, 0);

  const editVendorProjectList = async (projectId) => {
    toast
      .promise(
        httpService.put(`/vendor/${id}`, {
          ...customer,
          projectList: [...customer.projectList, projectId]
        }),
        {
          error: 'Failed to edit vendor',
          success: 'Vendor edited successfully',
          pending: 'Editing vendor',
        }
      )
      .then((res) => console.log(res.data));
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  };

  // Document 
  const removeFileFn = async (fileName) => {
    try {
      const res = await FileUploadService.removeFile(fileName);
      const resp = await httpService.put(`/vendor/${id}`, { userName: customer?.userName, fileInfos: customer?.fileInfos.filter(f => f.fileName !== res?.data?.fileName) })
      await fetchApi();
    } catch (err) {
      console.log("file not able to be removed completly")
    }
  }

  // stock 

  const [allStock, setAllStock] = useState([]);

  const fetchStocks = async () => {
    const res = await httpService.get(`/stock?vendorId=${id}`);
    setAllStock([...res.data]);
  }

  // Land sale 
  const [landSales, setlandSales] = useState([]);

  const fetchLandSale = async () => {
    const res = await httpService.get(`/landsale?vendorId=${id}`);
    setlandSales([...res.data]);
  }

  const fetchAllCredit = async () => {

    httpService.get(`/vendortrx/getvendorbillpayment?vendorId=${id}`)
      .then((res) => {

        const payData = res.data.filter(pay => pay?.amountExcess > 0);
        const advPayAmt = payData.reduce((acc, curr) => {
          return acc + +curr?.amountExcess
        }, 0);
        setvendorAllCreditAmount(advPayAmt);
      });
  }

  useEffect(() => {
    console.log(isLoading);
  }, [isLoading]);

  useEffect(() => {
    fetchApi();
    fetchAllCredit();
    fetchProjects();
    fetchStocks();
    fetchLandSale();
  }, []);

  useEffect(() => {
    dispatch(getTransactionByUserId(id));
  }, []);

  // useEffect(async() => {
  //   const res3 = await getDocuments(id);
  //   setDocuments(res3);
  // }, []);

  // console.log(documents);
  // const [showTrx, setShowTrx] = useState(false);

  const handleDocumentChange = (file) => {
    if (!file) {
      setNewUpload({ ...newUpload, data: '' });
      return;
    }

    fileToDataURI(file).then((res) =>
      setNewUpload({ ...newUpload, data: res })
    );
  };

  const handleDocumentsSubmit = async (e) => {
    e.preventDefault();
    console.log(newUpload);
    // if (documents?.uploads?.length > 0) {
    //   editDocuments(id, newUpload).then((res) =>
    //     console.log('From edit documents : ', res)
    //   );
    // } else {
    //   postDocuments(id, newUpload).then((res) =>
    //     console.log('From post documents : ', res)
    //   );
    // }
  };

  const deleteComment = (e) => {
    const Vendorcomments = customer.comments.filter((c) => c._id !== delCom);
    toast
      .promise(httpService.put(`/vendor/${id}`, {
        ...customer,
        comments: [...Vendorcomments]
      }), {
        success: 'Vendor comment deleted successfully',
        pending: 'Deleting vendor comment',
      })
      .then(() => fetchApi());
    document.querySelectorAll('.cancel-btn')?.forEach((e) => e.click());
  }

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Client Profile </title>
        <meta name="description" content="Reactify Blank Page" />
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
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <h3 className="page-title">Profile / {customer?.name}</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/app/main/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Profile</li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="card mb-0">
            <div className="card-body">
              <div className="row">
                <div className="col-12">
                  <Stack justifyContent={'space-between'} direction={'row'}>
                    <Stack direction={'row'} alignItems={'center'} spacing={1}>
                      {customer?.fileInfos[0]?.filePath ? <img src={customer.fileInfos[0].filePath}
                        width="120" height="120" alt='aaa' />
                        : <Avatar sx={{ bgcolor: red[400], height: 52, width: 52 }}>
                          {customer.name?.substr(0, 1)}

                        </Avatar>}

                      <Stack>

                        <div
                          style={{
                            fontSize: '1.1rem',
                            fontWeight: 500,
                          }}
                        >
                          <Person />
                          <span>&nbsp;&nbsp;&nbsp;&nbsp;{customer?.firstName}{" "}{customer?.lastName}</span> <span className={'badge bg-inverse-info'}>VENDOR</span>
                          <br />
                          {customer?.email &&
                            <>
                              <EmailIcon />
                              <span>&nbsp;&nbsp;&nbsp;&nbsp;{customer?.email}</span>
                              <br />
                            </>
                          }
                          <PhoneIcon />
                          <span>&nbsp;&nbsp;&nbsp;&nbsp;{customer?.phone}</span> {customer?.mobile && <span>, {customer?.mobile}</span>}
                          <br />
                          {/* { customer?.mobile && 
                            <>
                              <PhoneIcon />
                              <span>&nbsp;&nbsp;&nbsp;&nbsp;{customer?.mobile}</span>
                            </>
                          } */}
                          <AccountBalanceWallet />
                          <span className={'badge bg-inverse-info ml-3'}>₹{vendorAllCreditAmount}</span>
                        </div>
                      </Stack>
                    </Stack>
                    <Stack direction={'row'} alignItems={'center'} spacing={1}>
                      <Button
                        sx={{
                          color: 'black',
                          width: '18px',
                          height: '30px',
                          fontSize: '1rem',
                        }}
                      >
                        <div className="col-auto float-right ml-auto">
                          <a
                            href="#"
                            className="btn add-btn"
                            data-toggle="modal"
                            data-target="#add_vendor"
                          >
                            <EditIcon /> Edit

                          </a>
                        </div>

                      </Button>
                      {/* <div className='rounded-circle bg-primary p-2 float-right mr-2'>
                      {isAdmin && (
                        <Link
                          to={"#"}
                          className="text-light"
                          data-toggle="modal"
                          data-target="#upload_file"
                        >
                          <Upload />
                        </Link>
                        )}
                      </div> */}
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
              <div className="card" id="accordionExample">
                <div
                  className="card-body"
                  style={{
                    minHeight: '70vh',
                  }}
                >
                  {/* <div
                    style={{
                      marginBottom: '15px',
                      marginBottom: '50px',
                    }}
                  >
                  </div> */}
                  <h4
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div className='float-left'>
                      <button type="button"
                        style={{ border: 'none', backgroundColor: '#FFFFFF', fontSize: '18px' }}
                        data-toggle="collapse"
                        data-target="#Basic"
                        aria-expanded="false"
                        aria-controls="Basic">
                        <span style={{ color: 'black' }}>

                          <AddressIcon />
                        </span> &nbsp;&nbsp;&nbsp;&nbsp;  Address</button>
                    </div>
                    <div className='float-right'>
                      <a
                        href="#"
                        // className="btn add-btn"
                        data-toggle="modal"
                        data-target="#edit_vendoraddress"
                      >
                        <EditIcon />
                      </a>
                    </div>
                  </h4>
                  <hr />
                  <div
                    id='Basic'
                    aria-labelledby="Basic"
                    data-parent="#accordionExample"
                    className='collapse show'

                    style={{
                      marginBottom: '15px',
                      fontSize: '1rem',
                      color: '#8c8c8c',
                    }}
                  >
                    <span className='text-dark'>Billing Address</span>
                    {customer?.billAddress?.state ?
                      <>
                        {customer?.billAddress?.attension} <br />
                        {customer?.billAddress?.address} {" "}
                        {customer?.billAddress?.city} <br />
                        {customer?.billAddress?.state} {" "}
                        {customer?.billAddress?.country} <br />
                        {customer?.billAddress?.pincode} <br />
                        Phone: {customer?.billAddress?.phone}
                      </>
                      :
                      <div>
                        Not Available
                      </div>
                    }
                  </div>
                  {/* <div
                    style={{
                      marginBottom: '15px',
                      fontSize: '1rem',
                      color: '#8c8c8c',
                    }}
                  >
                    <span className='text-dark'>Shipping Address</span>
                    { customer?.shipAddress?.state ? 
                      <>
                      {customer?.shipAddress?.attension} <br />
                      {customer?.shipAddress?.address} {" "}
                      {customer?.shipAddress?.city} <br />
                      {customer?.shipAddress?.state} {" "}
                      {customer?.shipAddress?.country} <br />
                      {customer?.shipAddress?.pincode} <br />
                      Phone: {customer?.shipAddress?.phone}
                      </>
                    :
                      <div>
                        Not Available
                      </div>
                    }
                  </div> */}
                  <h4
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div className='float-left'>
                      <button type="button"
                        style={{ border: 'none', backgroundColor: '#FFFFFF', fontSize: '18px' }}
                        data-toggle="collapse"
                        data-target="#Other"
                        aria-expanded="false"
                        aria-controls="Other">
                        <span style={{ color: 'black' }}>
                          <SupervisorAccountIcon />
                        </span> &nbsp;&nbsp;&nbsp;&nbsp;  Other Details
                      </button>
                    </div>
                    <div className='float-right'>
                      <a
                        href="#"
                        // className="btn add-btn"
                        data-toggle="modal"
                        data-target="#edit_vendor_other_details"
                      >
                        <EditIcon />
                      </a>
                    </div>
                  </h4>
                  <hr />
                  <div
                    id='Other'
                    aria-labelledby="Other"
                    data-parent="#accordionExample"
                    className='collapse'
                    style={{
                      marginBottom: '15px',
                      fontSize: '1rem',
                      color: '#8c8c8c',
                      marginBottom: '50px',
                    }}
                  >
                    <Stack
                      direction={'row'}
                      marginBottom={2}
                      alignItems={'flex-end'}
                    >
                      PAN No :
                      <span>&nbsp;&nbsp;&nbsp;&nbsp;{customer?.otherDetails?.pan}</span>
                    </Stack>
                    <Stack
                      direction={'row'}
                      marginBottom={2}
                      alignItems={'flex-end'}
                    >
                      GST No :
                      <span>&nbsp;&nbsp;&nbsp;&nbsp;{customer?.otherDetails?.gst}</span>
                    </Stack>
                    <Stack
                      direction={'row'}
                      marginBottom={2}
                      alignItems={'flex-end'}
                    >
                      Payment Terms :
                      <span>&nbsp;&nbsp;&nbsp;&nbsp;{customer?.otherDetails?.paymentTerms}</span>
                    </Stack>
                    <Stack
                      direction={'row'}
                      marginBottom={2}
                      alignItems={'flex-end'}
                    >
                      Website :
                      <a href={`https://${customer?.website}`} target="_blank">&nbsp;&nbsp;&nbsp;&nbsp;{customer?.website}</a>
                      {/* <span>&nbsp;&nbsp;&nbsp;&nbsp;{customer?.website}</span> */}
                    </Stack>

                  </div>
                  <h4
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div className='float-left'>
                      <button type="button"
                        style={{ border: 'none', backgroundColor: '#FFFFFF', fontSize: '18px' }}
                        data-toggle="collapse"
                        data-target="#Contact"
                        aria-expanded="false"
                        aria-controls="Contact">
                        <span style={{ color: 'black' }}>
                          <PhoneIcon /></span> &nbsp;&nbsp;&nbsp;&nbsp;Contact Details({customer?.personContact[0]?.firstName ? customer?.personContact?.length : 0})
                      </button>

                    </div>
                    <div className='float-right'>
                      <a
                        href="#"
                        // className="btn add-btn"
                        data-toggle="modal"
                        data-target="#edit_vendor_person_contact"
                      >
                        <EditIcon />
                      </a>
                    </div>
                  </h4>
                  <hr />
                  <div
                    id='Contact'
                    aria-labelledby="Contact"
                    data-parent="#accordionExample"
                    className='collapse'
                    style={{
                      marginBottom: '15px',
                      fontSize: '1rem',
                      color: '#8c8c8c',
                      marginBottom: '50px',
                    }}
                  >

                    {customer?.personContact?.length && customer?.personContact[0]?.firstName ?
                      customer?.personContact?.map((pc) => (
                        <>
                          <Stack direction={'row'} alignItems={'center'} spacing={1}>
                            <Avatar sx={{ bgcolor: red[400], height: 52, width: 52 }}>
                              {pc.firstName?.substr(0, 1)}
                            </Avatar>
                            <Stack>
                              <div
                                style={{
                                  fontSize: '1.1rem',
                                  fontWeight: 500,
                                }}
                              >
                                <Person />
                                <span>&nbsp;&nbsp;&nbsp;&nbsp;{pc?.firstName} {" "}{pc?.lastName}</span>
                                <br />
                                <EmailIcon />
                                <span>&nbsp;&nbsp;&nbsp;&nbsp;{pc?.email}</span>
                                <br />
                                <PhoneIcon />
                                <span>&nbsp;&nbsp;&nbsp;&nbsp;{pc?.phone}</span>
                                <br />
                                {pc?.mobile &&
                                  <>
                                    <PhoneIcon />
                                    <span>&nbsp;&nbsp;&nbsp;&nbsp;{pc?.mobile}</span>
                                  </>
                                }
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
                          Timeline
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          href="#vendor_comment"
                          data-toggle="tab"
                          className="nav-link"
                        >
                          Comments
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          href="#emp_notes"
                          data-toggle="tab"
                          className="nav-link"
                        >
                          Transactions
                        </a>
                      </li>
                      {/* <li className="nav-item">
                        <a
                          href="#emp_trx"
                          data-toggle="tab"
                          className="nav-link"
                        >
                          Transaction
                        </a>
                      </li> */}
                      {/* <li className="nav-item">
                        <a
                          href="#emp_doc"
                          data-toggle="tab"
                          className="nav-link"
                          
                        >
                          Document
                        </a>
                      </li> */}
                      {/* <li className="nav-item">
                        <a
                          href="#emp_project"
                          data-toggle="tab"
                          className="nav-link"
                        >
                          Project
                        </a>
                      </li> */}
                      <li className="nav-item">
                        <a
                          href="#emp_doc"
                          data-toggle="tab"
                          className="nav-link"

                        >
                          Document
                        </a>
                      </li>
                      {customer?.vendorType == "supplier" &&

                        <li className="nav-item">
                          <a
                            href="#vdr_stock"
                            data-toggle="tab"
                            className="nav-link"
                          >
                            Stocks
                          </a>
                        </li>
                      }
                      {customer?.vendorType == "landowner" &&

                        <li className="nav-item">
                          <a
                            href="#vdr_land"
                            data-toggle="tab"
                            className="nav-link"
                          >
                            Land purchase
                          </a>
                        </li>
                      }
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
                  <h3>Timeline</h3>
                  <hr />
                  <Timeline>
                    {customer?.timeline?.reverse().map((n) => (
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
                              {new Date(n.createdAt).toLocaleDateString()}
                            </span>{' '}
                            at {new Date(n.createdAt).toLocaleTimeString()}
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
                            <h5>{n.timelineType}</h5>
                            <hr
                              style={{
                                margin: '0px',
                                marginBottom: '8px',
                              }}
                            />
                            <p>{n.description}</p>
                          </Paper>
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                </div>

                <div className="tab-pane fade show" id="vendor_comment">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <h3>Comments</h3>
                    <Link
                      to="#"
                      className="btn add-btn"
                      data-toggle="modal"
                      data-target="#add_vendor_comment"
                    >
                      <i className="fa fa-plus" /> Add Comment
                    </Link>
                  </div>
                  <hr />
                  <div className="list-group">
                    {customer?.comments.length ?
                      customer?.comments.map(c => (
                        <div key={c._id} className='list-group-item list-group-item-action flex-column align-items-start'>
                          <p className="mb-1">{c?.comment}</p>
                          <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">By {c?.createdBy?.firstName} {c?.createdBy?.lastName} | {" "}
                              <small>{c?.date.split("T")[0]}
                                {/* | {c?.date.split("T")[1].split(".")[0]} */}
                              </small>
                            </h5>
                            <small><a
                              className="dropdown-item"
                              href="#"
                              data-toggle="modal"
                              data-target="#delete_client"
                              onClick={() => {
                                setDelCom(c._id);
                              }}
                            >
                              <DeleteOutline />
                            </a>
                            </small>
                          </div>
                        </div>
                      ))

                      :
                      <div className='list-group-item list-group-item-action flex-column align-items-start'>
                        <p className="mb-1">No Comments Added yet!</p>
                      </div>
                    }
                  </div>
                  {/* <Invoices invoice={customer.invoices} /> */}
                </div>

                <div className="tab-pane fade show" id="emp_notes">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <h3>Bill</h3>
                    <div>
                      {/* <Link to={`/app/profile/vendor-profile/${customer._id}/viewbill`}>
                      <button className="btn add-btn mr-3">View Bill</button>
                    </Link> */}
                      <Link to={{ pathname: `/app/purchase/createbill`, state: { vendorId: customer._id } }}>
                        <button className="btn add-btn mr-3"><i className="fa fa-plus" />Create</button>
                      </Link>
                      <Link to={`/app/purchase/bills?vendorId=${customer._id}`}>
                        <button className="btn add-btn mr-3"><i className="fa fa-eye" />View</button>
                      </Link>
                      {/* <Link to={`/app/profile/vendor-profile/${customer._id}/createbill`}>
                      <button className="btn add-btn mr-3">Add Bill</button>
                    </Link> */}
                    </div>
                  </div>

                  <hr />

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <h3>Expense</h3>
                    <div>
                      <Link to={{ pathname: `/app/purchase/addexpense`, state: { vendorId: customer._id } }}>
                        <button className="btn add-btn mr-3"><i className="fa fa-plus" />Create</button>
                      </Link>
                      <Link to={`/app/purchase/expenses?vendorId=${customer._id}`}>
                        <button className="btn add-btn mr-3"><i className="fa fa-eye" />View</button>
                      </Link>
                    </div>
                  </div>

                  <hr />

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <h3>Credit</h3>
                    <div>
                      <Link to={{ pathname: `/app/purchase/addvendorcredit`, state: { vendorId: customer._id } }}>
                        <button className="btn add-btn mr-3"><i className="fa fa-plus" />Create</button>
                      </Link>
                      <Link to={`/app/purchase/vendorcredit?vendorId=${customer._id}`}>
                        <button className="btn add-btn mr-3"><i className="fa fa-eye" />View</button>
                      </Link>
                    </div>
                  </div>

                  <hr />

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <h3>Purchase Order</h3>
                    <div>
                      <Link to={{ pathname: `/app/purchase/addpurchaseorder`, state: { vendorId: customer._id } }}>
                        <button className="btn add-btn mr-3"><i className="fa fa-plus" />Create</button>
                      </Link>
                      <Link to={`/app/purchase/purchaseorder?vendorId=${customer._id}`}>
                        <button className="btn add-btn mr-3"><i className="fa fa-eye" />View</button>
                      </Link>
                    </div>
                  </div>
                  <hr />

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <h3>Payments Made</h3>
                    <div>
                      <Link to={{ pathname: `/app/purchase/billpayment`, state: { vendorId: customer._id } }}>
                        <button className="btn add-btn mr-3"><i className="fa fa-plus" />Create</button>
                      </Link>
                      <Link to={`/app/purchase/paymentsmade?vendorId=${customer._id}`}>
                        <button className="btn add-btn mr-3"><i className="fa fa-eye" />View</button>
                      </Link>
                    </div>
                  </div>

                  {/* <Invoices invoice={customer.invoices} /> */}
                </div>


                <div
                  className="tab-pane fade show"
                  // className="tab-pane fade show active" 
                  id="emp_trx">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <h3>Transaction</h3>
                  </div>
                  <hr />
                  <VendorTrxTable />
                  {/* <Invoices invoice={customer.invoices} /> */}
                </div>
                {/* <div
                  id="emp_doc"
                  className="pro-overview tab-pane fade show"
                >
                  <h3>
                    Documents{' '}
                    <Link
                      href="#"
                      data-toggle="modal"
                      data-target="#upload_file"
                      style={{ float: 'right' }}
                    >
                      {isAdmin && (
                        <span style={{ color: 'black' }}>
                          <UploadFileOutlined />
                          &nbsp;&nbsp;&nbsp;
                        </span>
                      )}
                    </Link>
                  </h3>

                  <hr />
                  
                  <DocumentsPane documents={documents} />


                </div> */}
                <div
                  id="emp_doc"
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
                  {customer?.fileInfos && customer?.fileInfos?.length > 0 && (
                    <div className="card">
                      <div className="card-header">List of Files</div>
                      <ul className="list-group list-group-flush">
                        {customer?.fileInfos.map((file, index) => (
                          <li className="list-group-item d-flex justify-content-between" key={index}>
                            <a href={file?.filePath} target="_blank">{file?.fileName.split("_")[2]}</a>
                            <Delete onClick={() => removeFileFn(file?.fileName)} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="tab-pane fade show" id="emp_project">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <h3>Project</h3>
                    <Link
                      to="#"
                      className="btn add-btn"
                      data-toggle="modal"
                      data-target="#add_projectmodal"
                    >
                      <i className="fa fa-plus" /> Add Project
                    </Link>
                  </div>
                  <hr />
                  {/* <Invoices invoice={customer.invoices} /> */}
                  <VendorProjectTable vendor={customer} />
                </div>
                <div className="tab-pane fade show" id="vdr_stock">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <h3>Stock</h3>
                    {/* <Link
                      to="#"
                      className="btn add-btn"
                      data-toggle="modal"
                      data-target="#add_projectmodal"
                    >
                      <i className="fa fa-plus" /> Add Project
                    </Link> */}
                  </div>
                  <hr />
                  {/* <Invoices invoice={customer.invoices} /> */}
                  <TableContainer component={Paper}>
                    <Tb aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Sr No.</TableCell>
                          <TableCell>Stock No</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Item</TableCell>
                          <TableCell>Left Item</TableCell>
                          <TableCell>Total Item</TableCell>
                          <TableCell>Project</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {allStock.map((l, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{l?.stockNo}</TableCell>
                            {/* <TableCell><Link to={`/app/stock/stockinfo/${l?._id}`}>{l?.stockNo}</Link></TableCell> */}
                            <TableCell>{l?.date?.split("T")[0]}</TableCell>
                            <TableCell>{l?.itemDetails}</TableCell>
                            <TableCell>{l?.leftQuantity}</TableCell>
                            <TableCell>{l?.quantity}</TableCell>
                            <TableCell><Link to={`/app/projects/projects-view/${l?.projectId?._id}`}>{l?.projectId?.name}</Link></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Tb>
                    {allStock.length === 0 && (
                      <div
                        style={{
                          height: '35vh',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <h4>No Stocks</h4>
                      </div>
                    )}
                  </TableContainer>
                </div>

                <div className="tab-pane fade show" id="vdr_land">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <h3>Land purchase</h3>
                    <Link
                      to="#"
                      className="btn add-btn"
                      data-toggle="modal"
                      data-target="#add_landsale"
                    >
                      <i className="fa fa-plus" /> Add Land purchase
                    </Link>
                  </div>
                  <hr />
                  <TableContainer component={Paper}>
                    <Tb aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Sr No.</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Plot No</TableCell>
                          <TableCell>Area</TableCell>
                          <TableCell>Project</TableCell>
                          <TableCell>Total Amount</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {landSales.map((l, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{l?.payDate?.split("T")[0]}</TableCell>
                            <TableCell>
                              <Link to={`/app/profile/landsale/${l?._id}`} >{l?.plotNo}</Link>
                            </TableCell>
                            <TableCell>{l?.area}</TableCell>
                            <TableCell>
                              <Link to={`/app/projects/projects-view/${l?.projectId?._id}`}>{l?.projectId?.name}</Link>
                            </TableCell>
                            <TableCell>{l?.totalAmount}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Tb>
                    {landSales.length === 0 && (
                      <div
                        style={{
                          height: '35vh',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <h4>No Land purchase</h4>
                      </div>
                    )}
                  </TableContainer>
                </div>
              </div>
            </div>
          </div>
          {/* Upload Documents Modal */}
          <AddProjectModal handleProject={editVendorProjectList} />
          {/* <div
        id="upload_document_modal"
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
      </div> */}
          {/* /Upload Documents Modal */}
        </div>
      )}
      <Backdrop
        open={addInvoiceModal}
        style={{ zIndex: '9999' }}
        onClick={() => {
          setAddInvoiceModal(false);
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            style={{
              width: '50%',
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '30px',
              position: 'relative',
            }}
          >
            <div className="row">
              <div className="col-sm-6 m-b-20">
                <img className="inv-logo" alt="" />
                <ul className="list-unstyled">
                  <li>KN Multiprojects</li>
                  <li>Plot No-31 Basundhara Complex, Hanspal,</li>
                  <li> Bhubaneswar, Odisha 752101</li>
                  <li>GST No:</li>
                </ul>
              </div>
              <div className="col-sm-6 m-b-20">
                <div className="invoice-details">
                  <h3 className="text-uppercase">New Invoice</h3>
                  <ul className="list-unstyled">
                    <li>
                      Date:{' '}
                      <span> {new Date().toISOString().split('T')[0]}</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-sm-6 col-lg-7 col-xl-8 m-b-20">
                <ul className="list-unstyled">
                  <li>
                    <strong>{customer?.name}</strong>
                  </li>
                  <li>
                    <span>{customer?.company}</span>
                  </li>
                  {/* <li>{customer?.address}</li> */}
                  <li>{customer?.phone}</li>
                  <li>
                    <a href="#">{customer?.email}</a>
                  </li>
                </ul>
              </div>
            </div>
            <h4>Select Project</h4>
            <select
              onChange={(e) => {
                setSelectedPlot(null);
                setSelectedProject(
                  projects.filter((p) => p._id === e.target.value)[0]
                );
              }}
              className="custom-select"
            >
              <option hidden value=""></option>
              {projects?.map((project) => (
                <option value={project._id}>{project.name}</option>
              ))}
            </select>
            <h4
              style={{
                marginTop: '12px',
              }}
            >
              Select Plot
            </h4>
            <select
              value={selectedPlot?._id || ''}
              onChange={(e) => {
                setSelectedPlot(
                  selectedProject?.subPlots?.filter(
                    (p) => p._id === e.target.value
                  )[0]
                );
              }}
              className="custom-select"
            >
              <option hidden value=""></option>
              {selectedProject?.subPlots?.map((plot) => (
                <option value={plot._id}>{plot.name}</option>
              ))}
            </select>

            <button
              style={{
                marginTop: '3%',
              }}
              onClick={async () => {
                if (!selectedPlot.name || !selectedProject.name)
                  return toast.error('Please select a project and plot');
                if (selectedPlot.sold) {
                  return toast.error('This plot is already sold');
                }
                selectedPlot.sold = true;
                selectedPlot.soldAt = new Date();
                selectedPlot.soldBy = user._id;
                selectedPlot.soldTo = customer._id;
                await toast.promise(
                  Promise.all([
                    httpService.post('/sale-invoice', {
                      customer: customer._id,
                      project: selectedProject._id,
                      invoiceDate: new Date(),
                      items: [
                        {
                          item: selectedProject.name + ' ' + selectedPlot.name,
                          description: selectedPlot.description,
                          unitCost: selectedProject.costPerSqFeet,
                          quantity: 1,
                          amount:
                            selectedPlot.area * selectedProject.costPerSqFeet,
                        },
                      ],
                      total: selectedPlot.area * selectedProject.costPerSqFeet,
                    }),
                    httpService.put(`/project/${selectedProject._id}`, {
                      ...selectedProject,
                      subPlots: selectedProject.subPlots.map((p) => {
                        if (p._id === selectedPlot._id) {
                          return selectedPlot;
                        }
                        return p;
                      }),
                    }),
                  ]),
                  {
                    error: 'Error creating an invoice',
                    success: 'Invoice created successfully',
                    pending: 'Creating invoice...',
                  }
                );
                setAddInvoiceModal(false);
                setSelectedPlot(null);
                setSelectedProject(null);
                fetchProjects();
                fetchApi();
              }}
              className="btn add-btn"
            >
              Confirm
            </button>
          </div>
        </div>
      </Backdrop>
      {/* /Page Content */}
      <AddVendorModel fetchVendors={fetchApi} editForm={true} editVendorId={id} />
      {customer?.billAddress && customer?.shipAddress &&
        <EditVendorAddress fetchVendors={fetchApi} editVendorId={id} bAddress={customer?.billAddress} sAddress={customer?.shipAddress} />
      }
      {customer?.otherDetails &&
        <EditVendorOtherDetails fetchVendors={fetchApi} editVendorId={id} oDetails={customer?.otherDetails} />
      }
      {customer?.personContact &&
        <EditVendorPersonContact fetchVendors={fetchApi} editVendorId={id} pContact={customer?.personContact} />
      }
      {customer &&
        <AddVendorComment fetchVendors={fetchApi} editVendorId={id} vendorDetails={customer} />
      }
      {customer &&
        <AddLandSale fetchVendors={fetchLandSale} editVendorId={id} vendorDetails={customer} />
      }
      {customer &&
        <FileUploadModel modLink={`vendor/${customer?._id}`} filesInfo={customer?.fileInfos} />
      }
      {customer &&
        <UploadDocument putLink={`/vendor/${id}`} fileInfoArr={customer?.fileInfos} fetchApi={fetchApi} userName={customer?.name} isVendor={true} />
      }

      {/* Delete Comment  */}
      <div className="modal custom-modal fade" id="delete_client" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete Vendor</h3>
                <p>Are you sure want to delete?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <a
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        deleteComment();
                      }}
                      className="btn btn-primary continue-btn"
                    >
                      Delete
                    </a>
                  </div>
                  <div className="col-6">
                    <a
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
    </div>
  );
};
export default VendorProfile;
