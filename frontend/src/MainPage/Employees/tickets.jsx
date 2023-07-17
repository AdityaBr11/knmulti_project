import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Table } from 'antd';
import 'antd/dist/antd.css';
import { itemRender, onShowSizeChange } from '../paginationfunction';
import '../antdstyle.css';
import CircularProgress from '@mui/material/CircularProgress';
import {
  fetchTicket,
  addTicket,
  updateTicket,
  fetchdepartment,
  fetchClient,
  allemployee,
} from '../../lib/api';
import { toast } from 'react-toastify';
import httpService from '../../lib/httpService';

const Tickets = () => {
  const [data, setData] = useState([]);
  const [department, setDepartment] = useState([]);
  const [client, setClient] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [ticketStats, setTicketStats] = useState([0, 0, 0]);
  const [selectedTicketData, setSelectedTicketData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [depData, setDepData] = useState(null)

  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }
  });

  const deleteTicket = async (id) => {
    await toast.promise(
      httpService.delete(`/ticket/${id}`),
      {
        pending: 'Deleting the Ticket',
        success: 'Ticket deleted successfully',
        error: "Couldn't delete the Ticket",
      }
    );
    setRerender(!rerender);
  }

  const updateTracker = (data) => {
    let a = 0,
      b = 0,
      c = 0;
    data.forEach((ticket) => {
      if (ticket.status.toLowerCase() == 'active') c++;
      else b++;

      let date = new Date(ticket.updatedAt);
      let dateNow = Date.now();
      date = date.setDate(date.getDate() + 1);

      if (date >= dateNow) {
        a++;
      } else {
      }
    });
    setTicketStats([a, b, c]);
  };

  const [rerender, setRerender] = useState(false);


  const [ qtitle, setqtitle ] = useState("");
  const [ qdep, setqdep ] = useState("");
  const [ qstatus, setqstatus ] = useState("");
  const [ qpriority, setqpriority ] = useState("");


  function searchTable(data) {
    let newData = data
      .filter(row => row.title?.toLowerCase().indexOf(qtitle?.toLowerCase()) > -1)
      .filter(r => r.department?.name?.toLowerCase().indexOf(qdep.toLowerCase()) > -1);

    if(qstatus){
      newData = newData.filter(s => s.status?.toLowerCase()?.indexOf(qstatus?.toLowerCase()) > -1);
    }

    if(qpriority){
      newData = newData.filter(s => s.priority?.toLowerCase()?.indexOf(qpriority?.toLowerCase()) > -1);
    }
    return newData;
  }

  useEffect(() => {
    (async () => {
      const res = await fetchTicket();
      setData(res.data.reverse());
      updateTracker(res.data);
      const res_d = await fetchdepartment();
      setDepartment(res_d);
      const res_c = await fetchClient();
      setClient(res_c);
      const res_e = await allemployee();
      setEmployees(res_e);
      setIsLoading(false);
    })();
  }, [rerender]);
  const columns = [
    {
      title: 'Ticket',
      dataIndex: 'ticket',
      sorter: (a, b) => a.title < b.title,
      render: (text, record) => (
        <p
          className="text-primary cursor-pointer"
          href="#"
          data-toggle="modal"
          data-target="#edit_ticket"
          onClick={() => {
            setSelectedTicketData(record);
          }}
        >{text}</p>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      sorter: (a, b) => a.title < b.title,
      render: (text, record) => <p>{text}</p>,
    },
    {
      title: 'Assigned Staff',
      dataIndex: 'assignee',
      render: (text, record) => (
        <h2 className="table-avatar">
          <Link to="/app/profile/employee-profile">
            <p>{text?.name}</p>
          </Link>
        </h2>
      ),
      sorter: (a, b) => a.assignee.firstName < b.assignee.firstName,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      render: (text, record) => <p>{text?.name}</p>,
      sorter: (a, b) => a.department < b.department,
    },
    {
      title: 'Last Reply',
      dataIndex: 'updatedAt',
      render: (text, record) => <p>{text.split('T')[0]}</p>,
      sorter: (a, b) => {
        return a.updatedAt < b.updatedAt;
      },
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      render: (text, record) => <p>{text.toUpperCase()}</p>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text, record) => <p>{text}</p>,
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
              className="dropdown-item"
              href="#"
              data-toggle="modal"
              data-target="#edit_ticket"
              onClick={() => {
                setSelectedTicketData(record);
              }}
            >
              <i className="fa fa-pencil m-r-5" /> Edit
            </a>
            <a
              className="dropdown-item"
              onClick={async () => {
                setSelectedTicketData(record);
                await deleteTicket(record._id);
                setRerender(!rerender);
              }}
            >
              <i className="fa fa-trash-o m-r-5" /> Delete
            </a>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (employees && department) {
      let temp = {}
      department.forEach((dep) => {
        temp[dep._id] = [];
      })
      employees.map((employee) => {
        if (employee.department?._id) {
          temp[employee.department?._id].push(employee);
        }
      });
      setDepData(temp);
    }
  }, [employees, department]);

  const paginationControl = {
    total: data.length,
    showTotal: (total, range) =>
      `Showing ${range[0]} to ${range[1]} of ${total} entries`,
    showSizeChanger: true,
    onShowSizeChange: onShowSizeChange,
    itemRender: itemRender,
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Tickets </title>
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
          <TicketHeader />

          <TicketTracker ticketStats={ticketStats} />

          {/* <SearchTicket
            setRerender={setRerender}
            rerender={rerender}
            data={data}
            setData={setData}
          /> */}

          {/* Search Filter */}
          <div className="row filter-row justify-content-between">
            <div className="col-sm-6 col-md-3">
              <div className="form-group form-focus focused">
                <input
                  type="text"
                  style={{
                    padding: '10px',
                  }}
                  placeholder={'Title'}
                  className="form-control"
                  value={qtitle}
                  onChange={(e) => setqtitle(e.target.value)}
                />
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="form-group form-focus focused">
                <input
                  type="text"
                  style={{
                    padding: '10px',
                  }}
                  placeholder={'Department'}
                  className="form-control"
                  value={qdep}
                  onChange={(e) => setqdep(e.target.value)}
                />
              </div>
            </div>

            <div className="col-sm-3 col-md-3">
              <div className="form-group form-focus focused">
                <select
                  className="custom-select form-control floating"
                  name=""
                  value={qstatus}
                  onChange={(e) => setqstatus(e.target.value)}
                >
                  <option value={""} selected>Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Approved">Approved</option>
                  <option value="Returned">Returned</option>
                </select>
                <label className="focus-label">Status</label>
              </div>
            </div>
            <div className="col-sm-3 col-md-3">
              <div className="form-group form-focus focused">
                <select
                  className="custom-select form-control floating"
                  name=""
                  value={qpriority}
                  onChange={(e) => setqpriority(e.target.value)}
                >
                  <option value={""} selected>Select Priority</option>
                  <option value="High">High</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                </select>
                <label className="focus-label">Priority</label>
              </div>
            </div>

          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <Table
                  className="table-striped"
                  pagination={paginationControl}
                  style={{ overflowX: 'auto' }}
                  columns={columns}
                  dataSource={searchTable(data)}
                  rowKey={(record) => record.id}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* /Page Content */}

      <AddTicket
        setRerender={setRerender}
        rerender={rerender}
        department={department}
        client={client}
        employees={employees}
        depData={depData}
      />

      <EditTicket
        selectedTicketData={selectedTicketData}
        setRerender={setRerender}
        rerender={rerender}
        department={department}
        client={client}
        employees={employees}
      />

      <DeleteTicket id={selectedTicketData?._id} />
    </div>
  );
};

const AddTicket = (props) => {
  const form = useRef();
  const btn = useRef();
  const [department, setDepartment] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState();
  const [employees, setEmployees] = useState(props?.employees);

  const handleDepartmentChange = (id) => {
    if (id) {
      console.log('started exec');
      const dep = props?.department?.find(el => el._id === id);
      setDepartment(id);
      console.log('department set')
      const filteredData = props.employees.filter((v,i) => v.department === dep.name);
      console.log(filteredData)
      const sortedData = filteredData.sort((a,b) => a.ticketsAssigned?.length - b.ticketsAssigned?.length )
      console.log(sortedData)
      setEmployees(sortedData);
    } else {
      // setEmployees(props.employees);
    }
  }

  const resetForm = () => {
    form.current.reset();
    btn.current.innerHTML = 'Submit';
    props.setRerender(!props.rerender);
    $('#add_ticket').modal('hide');
  };
  console.log({department});
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTicket = {};
    btn.current.innerHTML = 'Submitting...';
    newTicket.title = e.target.title.value;
    newTicket.ticket = e.target.ticket.value;
    newTicket.status = 'Active';
    newTicket.priority = e.target.priority.value;
    newTicket.description = e.target.description.value;
    newTicket.department = e.target.department.value;
    newTicket.client = e.target.client.value;
    newTicket.followers = e.target.followers.value;
    newTicket.assignee = e.target.assignee.value;
    newTicket.resolutionDeadline = e.target.resolutionDeadline.value;
    if (
      newTicket.title == undefined ||
      newTicket.title == '' 
    ) {
      toast.error('Please Enter Tickets Title');
      return;
    }
    if (
      newTicket.client == undefined ||
      newTicket.client == '' 
    ) {
      toast.error('Please select  client');
      return;
    }
    if (
      newTicket.priority == undefined ||
      newTicket.priority == '' 
    ) {
      toast.error('Please select priority');
      return;
    }
    
    // if (
    //   selectedEmployee == undefined ||
    //   selectedEmployee == '' 
    // ) {
    //   toast.error('Please select assignee Staff');
    //   return;
    // }
    if (
      newTicket.ticket == undefined ||
      newTicket.ticket == '' 
    ) {
      toast.error('Please Enter Tickets Number');
      return;
    }
    if (
      newTicket.description == undefined ||
      newTicket.description == '' 
    ) {
      toast.error('Please Enter description');
      return;
    }
    
    if (
      newTicket.resolutionDeadline == undefined ||
      newTicket.resolutionDeadline == '' 
    ) {
      toast.error('Please Enter Resolution Deadline');
      return;
    }
    if (
      newTicket.department == undefined ||
      newTicket.department == '' 
    ) {
      toast.error('Please select department');
      return;
    }
    if (
      newTicket.followers == undefined ||
      newTicket.followers == 'Select' 
    ) {
      toast.error('Please Select followers');
      return;
    }
    
    //console.log(newTicket.department,newTicket.assignee,newTicket,department,"newTicket.priority");
    await toast.promise(
      httpService.post('/ticket', newTicket),
      {
        pending: 'Creating the Ticket',
        success: 'Ticket created successfully',
        error: "Couldn't create the Ticket, recheck the details entered",
      }
    );
    props.setRerender(!props.rerender);
    btn.current.innerHTML = 'Submitted!';
    resetForm();
  };

  return (
    <div id="add_ticket" className="modal custom-modal fade" role="dialog">
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Ticket</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          {/* ADD MODAL */}
          <div className="modal-body">
            <form ref={form} onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Ticket Title <span style={{color:"red"}}> *</span></label>
                    <input className="form-control" type="text" name="title" />
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Status</label>
                    <option>active</option>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Ticket <span style={{color:"red"}}> *</span></label>
                    <input
                      type='text'
                      placeholder='TKT-0000XX'
                      className="form-control"
                      name="ticket"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-12">
                  <div className="form-group">
                    <label>Description <span style={{color:"red"}}> *</span></label>
                    <textarea
                      className="form-control"
                      defaultValue={''}
                      name="description"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Client <span style={{color:"red"}}> *</span></label>
                    <select className="select" name="client">
                      <option value="">Select</option>
                      {props.client.map((client) => {
                        return (
                          <option
                            key={client._id}
                            value={client._id}
                          >{`${client.displayName}`}</option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Priority <span style={{color:"red"}}> *</span></label>
                    <select className="select" name="priority">
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Assign Staff <span style={{color:"red"}}> *</span></label>
                    <select
                    required
                      className="select" 
                      name="assignee"
                      value={selectedEmployee}
                    >
                      <option>Select</option>
                      {employees?.map((emp) => {
                        return (
                          <option
                            value={emp._id}
                          >{`${emp.name}`}</option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="form-group">
                    <label style={{color:"red"}}>Department <span > **</span></label>
                    <select 
                      value={department}
                      className="custom-select" 
                      name="department"
                      onChange={(e) => handleDepartmentChange(e.target.value)}
                    >
                      <option value="">Select</option>
                      {props?.department?.map((dep) => {
                        return <option value={dep._id}>{dep.name}</option>;
                      })}
                    </select>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Add Followers <span style={{color:"red"}}> *</span></label>
                    <select className="select" name="followers">
                      <option>Select</option>
                      {props.employees.map((emp) => {
                        return (
                          <option
                            value={emp._id}
                          >{`${emp.firstName} ${emp.lastName}`}</option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Resolution Deadline <span style={{color:"red"}}> *</span></label>
                    <input 
                    required
                      className="form-control" 
                      name="resolutionDeadline"
                      type="date"
                    >
                    </input>
                  </div>
                </div>
                {/* <div className="form-group">
                  <label>Upload Files</label>
                  <input className="form-control" type="file" name="file" />
                </div> */}
              </div>

              <div className="submit-section">
                <button
                  className="btn btn-primary"
                  ref={btn}
                  aria-label="Close"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
          {/* ADD MODAL */}
        </div>
      </div>
    </div>
  );
};

const DeleteTicket = (props) => {
  const handleDelete = async () => {
    const res = await deleteTicket(props.id);
  };
  return (
    <div className="modal custom-modal fade" id="delete_ticket" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body">
            <div className="form-header">
              <h3>Delete Ticket</h3>
              <p>Are you sure want to delete ticket with id {props.id}?</p>
            </div>
            <div className="modal-btn delete-action">
              <div className="row">
                <div className="col-6">
                  <a
                    className="btn btn-primary continue-btn"
                    onClick={handleDelete}
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
  );
};

const SearchTicket = ({ setData }) => {
  const handleSearch = async () => {
    const { data } = await fetchTicket();
    const title = document.getElementById('ticket-title-search').value;
    const employeeName = document.getElementById('ticket-search-empname').value;
    const statue = document.getElementById('search-filter-status').value;
    const priority = document.getElementById('search-filter-priority').value;

    let result = data;

    if (title != '') {
      result = data.filter((ticket) => {
        return ticket.title === title;
      });
    }

    if (employeeName !== '') {
      result = result.filter((ticket) => {
        if (
          ticket.assignee.firstName === employeeName ||
          ticket.assignee.lastName === employeeName ||
          `${ticket.assignee.firstName} ${ticket.assignee.lastName}` ==
            employeeName
        ) {
          return true;
        } else {
          return false;
        }
      });
    }

    if (statue != '') {
      result = result.filter((ticket) => {
        return ticket.status == statue;
      });
    }

    if (priority != '') {
      result = result.filter((ticket) => {
        return ticket.priority == priority;
      });
    }
    setData(result);
  };

  return (
    <div className="row filter-row">
      <div className="col-sm-5 col-12">
        <div className="form-group form-focus select-focus">
          <select
            className="custom-select"
            id="search-filter-status"
            style={{
              height: '100%',
            }}
          >
            <option value={''} hidden>
              Select Status
            </option>
            <option> Active </option>
            <option> Approved </option>
            <option> Returned </option>
          </select>
        </div>
      </div>
      <div className="col-sm-5 col-12">
        <div className="form-group form-focus select-focus">
          <select
            className="custom-select"
            id="search-filter-status"
            style={{
              height: '100%',
            }}
          >
            <option value={''} hidden>
              Select Priority
            </option>
            <option> High </option>
            <option> Low </option>
            <option> Medium </option>
          </select>
        </div>
      </div>
      <div
        className="col-sm-6 col-md-3 col-lg-3 col-xl-2 col-12"
        onClick={handleSearch}
      >
        <a href="#" className="btn btn-success btn-block">
          Search
        </a>
      </div>
    </div>
  );
};

const TicketHeader = () => {
  return (
    <div className="page-header">
      <div className="row align-items-center">
        <div className="col">
          <h3 className="page-title">Tickets</h3>
          <ul className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/app/main/dashboard">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active">Tickets</li>
          </ul>
        </div>
        <div className="col-auto float-right ml-auto">
          <a
            href="#"
            className="btn add-btn"
            data-toggle="modal"
            data-target="#add_ticket"
          >
            <i className="fa fa-plus" /> Add Ticket
          </a>
        </div>
      </div>
    </div>
  );
};

const TicketTracker = ({ ticketStats }) => {
  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card-group m-b-30">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-3">
                <div>
                  <span className="d-block">New Tickets</span>
                </div>
              </div>
              <h3 className="mb-3">{ticketStats[0]}</h3>
              <div className="progress mb-2" style={{ height: '5px' }}>
                <div
                  className="progress-bar bg-primary"
                  role="progressbar"
                  style={{ width: '70%' }}
                  aria-valuenow={40}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-3">
                <div>
                  <span className="d-block">Solved Tickets</span>
                </div>
              </div>
              <h3 className="mb-3">{ticketStats[1]}</h3>
              <div className="progress mb-2" style={{ height: '5px' }}>
                <div
                  className="progress-bar bg-primary"
                  role="progressbar"
                  style={{ width: '70%' }}
                  aria-valuenow={40}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-3">
                <div>
                  <span className="d-block">Pending Tickets</span>
                </div>
              </div>
              <h3 className="mb-3">{ticketStats[2]}</h3>
              <div className="progress mb-2" style={{ height: '5px' }}>
                <div
                  className="progress-bar bg-primary"
                  role="progressbar"
                  style={{ width: '70%' }}
                  aria-valuenow={40}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditTicket = ({
  selectedTicketData,
  rerender,
  setRerender,
  client,
  department,
  employees,
}) => {
  const form = useRef();
  const btn = useRef();
  console.log(selectedTicketData)

  const handleSubmit = async (e) => {
    e.preventDefault();
    selectedTicketData.title
    const newTicket = {};
    console.log(selectedTicketData,"selectedTicketData");
    if( !selectedTicketData.title ){
      toast.error("Select  Ticket Title");
      return;
    }
    if( !selectedTicketData.client ){
      toast.error("Select  Ticket Title");
      return;
    }
    if( !selectedTicketData.client ){
      toast.error("Select client");
      return;
    }
    btn.current.innerHTML = 'Submitting...';
    newTicket.title = e.target.title.value;
    newTicket.ticket = e.target.ticket.value;
    newTicket.status = e.target.status.value;
    newTicket.priority = e.target.priority.value;
    newTicket.description = e.target.description.value;
    newTicket.department = e.target.department.value;
    newTicket.client = e.target.client.value;
    newTicket.followers = e.target.followers.value;
    newTicket.assignee = Number(e.target.assignee.value);
    newTicket.resolutionDeadline = e.target.resolutionDeadline.value;
    newTicket._id = selectedTicketData?._id;
    await toast.promise(
      httpService.put(`/ticket/${selectedTicketData._id}`, newTicket),
      {
        pending: 'Updating the Ticket',
        success: 'Ticket updated successfully',
        error: "Couldn't update the Ticket, recheck the details entered",
      }
    )
    btn.current.innerHTML = 'Submit';
    setRerender(!rerender);
    $('#edit_ticket').modal('hide');
  };

  return (
    <div id="edit_ticket" className="modal custom-modal fade" role="dialog">
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Ticket</h5>
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
            <form ref={form} onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Ticket Title</label>
                    <input
                      className="form-control"
                      type="text"
                      name="title"
                      defaultValue={selectedTicketData.title}
                    />
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      className="select"
                      name="status"
                      value={selectedTicketData.status}
                    >
                      <option value="Active">Active</option>
                      <option value="Approved">Approved</option>
                      <option value="Returned">Returned</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Ticket#</label>
                    <input
                      type='text'
                      className="form-control"
                      defaultValue={selectedTicketData.ticket}
                      name="ticket"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-12">
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      defaultValue={selectedTicketData.description}
                      name="description"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Client</label>
                    <select
                      className="select"
                      name="client"
                      defaultValue={selectedTicketData.client?._id}
                    >
                      {client.map((client) => {
                        return (
                          <option
                            value={client._id}
                          >{`${client.firstName} ${client.lastName}`}</option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Priority</label>
                    <select
                      className="select"
                      name="priority"
                      value={selectedTicketData.priority}
                    >
                      <option value="High">High</option>
                      <option Value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Assign Staff</label>
                    <select
                      className="select"
                      name="assignee"
                      value={selectedTicketData.assignee?._id}
                    >
                      {employees.map((emp) => {
                        return (
                          <option
                            value={emp._id}
                          >{`${emp.name}`}</option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Department</label>
                    <select
                      className="select"
                      name="department"
                      value={selectedTicketData.department?._id}
                    >
                      {department.map((dep) => {
                        return <option value={dep._id}>{dep.name}</option>;
                      })}
                    </select>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Add Followers</label>
                    <select
                      className="select"
                      name="followers"
                      value={selectedTicketData.followers?._id}
                    >
                      {employees.map((emp) => {
                        return (
                          <option
                            value={emp._id}
                          >{`${emp.firstName} ${emp.lastName}`}</option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Resolution Deadline</label>
                    <input
                      className="form-control"
                      name="resolutionDeadline"
                      value={selectedTicketData?.resolutionDeadline?.split('T')[0]}
                      type="date"
                    />
                  </div>
                </div>
                {/* <div className="form-group">
                  <label>Upload Files</label>
                  <input className="form-control" type="file" name="file" />
                </div> */}
              </div>

              <div className="submit-section">
                <button
                  className="btn btn-primary"
                  ref={btn}
                  aria-label="Close"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tickets;
