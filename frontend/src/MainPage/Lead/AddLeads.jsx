import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useHistory, useLocation } from 'react-router-dom';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { toast } from 'react-toastify';
import httpService from '../../lib/httpService';
import { useDispatch, useSelector } from 'react-redux';
import { createNotify } from '../../features/notify/notifySlice';
import DatePicker from 'react-date-picker';

const AddLeads = () => {

  const dispatch = useDispatch();

  const empObj = useSelector((state) => state?.authentication?.value?.user);

  const [employees, setEmployees] = useState([]);
  const [leadData, setLeadData] = useState({
    status: '62b0495696188848e678c34b'
  });
  const [leadNo, setleadNo] = useState(`LD-${Math.ceil(Math.random() * 100000)}`);
  const [assignType, setAssignType] = useState('');
  const [projects, setProjects] = useState();
  const [status, setStatus] = useState();
  const user = useSelector(state => state.authentication.value.user);
  const { state } = useLocation()
  console.log(user.jobRole.name, 'useruser')
  const history = useHistory();
  useEffect(async () => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }
    await fetchEmployees();
    await fetchProjects();
    await fetchLeadStatus();

    if (state?.edit) {
      const {
        address,
        assignType,
        currentAssigned,
        email,
        endDate,
        firstName,
        lastName,
        lead,
        nextAppointment,
        phone,
        pointDiscussed,
        project,
        startDate,
        status,
        totalCalls,
      } = state;
      setLeadData({
        address,
        assignType,
        currentAssigned,
        email,
        endDate,
        firstName,
        lastName,
        lead,
        nextAppointment,
        phone,
        pointDiscussed,
        project,
        startDate,
        status,
        totalCalls
      });
      setleadNo(lead);
      setAssignType(assignType);
    }
  }, []);

  const fetchEmployees = async () => {
    const employees = await httpService.get('/employee');

    const salesEmployees = employees.data.filter((v, i) => v?.jobRole?.name === 'Sales')
    setEmployees(salesEmployees);
  };

  const fetchProjects = async () => {
    const projects = await httpService.get('/project');
    setProjects(projects.data);
  };

  const fetchLeadStatus = async () => {
    const status = await httpService.get('/lead-status');
    setStatus(status.data);
  };

  const handleSubmit = async (e) => {
    let leadUploadData = {
      ...leadData,
      lead: leadNo,
      createdBy: user._id
    };
    if (!leadData?.firstName) {
      toast.error("Select Lead name");
      return;
    }
    if (!leadData?.lastName) {
      toast.error("Select Last name");
      return;
    }
    if (!leadData?.email) {
      toast.error("Select  Email");
      return;
    }
    // if(!leadData?.phone ){
    //   toast.error("Select  phone");
    //   return;
    // }
    // if(!leadData?.phone ){
    //   toast.error("Select Lead Email");
    //   return;
    // }



    if (state?.edit) {
      let newAssignedTo = [];
      state.assignedTo.forEach(emp => {
        newAssignedTo.push(emp._id);
      });
      if (!newAssignedTo.includes(leadData.currentAssigned)) {
        newAssignedTo.push(leadData.currentAssigned);
      };

      leadUploadData = {
        ...leadUploadData,
        assignedTo: newAssignedTo,
      }

      await toast.promise(
        httpService.put(`/lead/${state?._id}`, leadUploadData),
        {
          pending: 'Uploading Lead',
          success: 'Lead Created successfully',
          error: "couldn't create the Lead, please recheck the details entered"
        }
      );
      history.push("/app/employees/leads");
      return;
    }
    await toast.promise(
      httpService.post('/lead', leadUploadData),
      {
        pending: 'Uploading Lead',
        success: 'Lead Created successfully',
        error: "couldn't create the Lead, please recheck the details entered"
      }
    );

    dispatch(createNotify({
      notifyHead: `New Lead Added`,
      notifyBody: `Lead ${leadUploadData?.firstName} ${leadUploadData?.lastName} is created`,
      createdBy: empObj?._id
    }));

    history.push("/app/employees/leads")
  }

  const selectProject = (id) => {
    const project = projects.filter((v, i) => (v._id === id));
    let temp = { ...leadData };
    if (state?.edit) {
      if (temp.project) {
        temp.project.push(project[0]._id);
        temp.assignedTo.push(project[0].createdBy._id);
        temp.currentAssigned = project[0].createdBy._id;
      } else {
        temp.project = [project[0]._id];
        temp.assignedTo.push(project[0].createdBy._id);
        temp.currentAssigned = project[0].createdBy._id;
      }
    } else {
      temp.project = [project[0]._id];
      temp.assignedTo = [project[0].createdBy._id];
      temp.currentAssigned = project[0].createdBy._id;
    }
    setLeadData(temp)
  }

  const selectEmployee = (e) => {
    if (state?.edit) {
      setLeadData({
        ...leadData,
        currentAssigned: e.target.value
      })
    } else {
      setLeadData({
        ...leadData,
        currentAssigned: e.target.value,
        assignedTo: [e.target.value]
      })
    }
  }
  console.log(new Date(leadData?.startDate || '01/27/2023'), 'sss')


  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Add Leads</title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col-sm-12">
              <h3 className="page-title">Add Leads</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Leads</Link>
                </li>
                <li className="breadcrumb-item active">Add Leads</li>
              </ul>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        <div className="row">
          <div className="col-sm-12">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
            >
              {/* !! add redirect option to create more customer */}
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label >Lead First Name <span className='text-danger'>*</span></label>
                    <input
                      required
                      value={leadData?.firstName}
                      onChange={(e) => setLeadData({
                        ...leadData,
                        firstName: e.target.value
                      })}
                      type='text'
                      className='form-control'
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label >Lead Last Name <span className='text-danger'>*</span></label>
                    <input
                      value={leadData?.lastName}
                      onChange={(e) => setLeadData({
                        ...leadData,
                        lastName: e.target.value
                      })}
                      type='text'
                      required
                      className='form-control'
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label className="">Lead Email <span className='text-danger'>*</span></label>
                    <input
                      value={leadData?.email}
                      onChange={(e) => setLeadData({
                        ...leadData,
                        email: e.target.value
                      })}
                      type='email'
                      className='form-control'
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label >Lead Phone <span className='text-danger'>*</span></label>
                    <input
                      value={leadData?.phone}
                      onChange={(e) => setLeadData({
                        ...leadData,
                        phone: e.target.value
                      })}
                      maxLength={10}
                      type='tel'
                      required
                      className='form-control'
                    />
                  </div>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label >Address Line 1 <span className='text-danger'>*</span></label>
                    <textarea
                      value={leadData?.address?.addressLine1}
                      onChange={(e) => setLeadData({
                        ...leadData,
                        address: {
                          ...leadData.address,
                          addressLine1: e.target.value
                        }
                      })}
                      required
                      type='text'
                      className='form-control'
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label >Address Line 2</label>
                    <textarea
                      value={leadData?.address?.addressLine2}
                      onChange={(e) => setLeadData({
                        ...leadData,
                        address: {
                          ...leadData.address,
                          addressLine2: e.target.value
                        }
                      })}

                      type='text'
                      className='form-control'
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label >City <span className='text-danger'>*</span></label>
                    <input
                      value={leadData?.address?.city}
                      onChange={(e) => setLeadData({
                        ...leadData,
                        address: {
                          ...leadData.address,
                          city: e.target.value
                        }
                      })}
                      required
                      type='text'
                      className='form-control'
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>State <span className='text-danger'>*</span></label>
                    <select
                      required
                      value={leadData?.address?.state}
                      onChange={(e) => setLeadData({
                        ...leadData,
                        address: {
                          ...leadData.address,
                          state: e.target.value
                        }
                      })}
                      className="custom-select"
                    >
                      <option value={""}>Please Select</option>
                      {["Andhra Pradesh",
                        "Arunachal Pradesh",
                        "Assam",
                        "Bihar",
                        "Chhattisgarh",
                        "Goa",
                        "Gujarat",
                        "Haryana",
                        "Himachal Pradesh",
                        "Jammu and Kashmir",
                        "Jharkhand",
                        "Karnataka",
                        "Kerala",
                        "Madhya Pradesh",
                        "Maharashtra",
                        "Manipur",
                        "Meghalaya",
                        "Mizoram",
                        "Nagaland",
                        "Odisha",
                        "Punjab",
                        "Rajasthan",
                        "Sikkim",
                        "Tamil Nadu",
                        "Telangana",
                        "Tripura",
                        "Uttarakhand",
                        "Uttar Pradesh",
                        "West Bengal",
                        "Andaman and Nicobar Islands",
                        "Chandigarh",
                        "Dadra and Nagar Haveli",
                        "Daman and Diu",
                        "Delhi",
                        "Lakshadweep",
                        "Puducherry"].map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label >Pin Code</label>
                    <input
                      value={leadData?.address?.zipCode}
                      onChange={(e) => setLeadData({
                        ...leadData,
                        address: {
                          ...leadData.address,
                          zipCode: e.target.value
                        }
                      })}
                      type='text'
                      className='form-control'
                    />
                  </div>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-6 form-group">
                  <label >Lead <span className='text-danger'>#</span></label>
                  <input
                    disabled
                    // value={leadData?.lead}
                    value={leadNo}
                    placeholder="LD-0000XX"
                    // onChange={(e) => setLeadData({
                    //   ...leadData,
                    //   lead: e.target.value
                    // })}
                    onChange={(e) => setleadNo(e.target.value)}
                    className="form-control"
                    required
                    type="text"
                  />
                </div>
                <div className="col-sm-6 form-group">
                  <label >Lead Status</label>
                  <select
                    value={leadData?.status?._id}
                    onChange={(e) => setLeadData({
                      ...leadData,
                      status: e.target.value
                    })}
                    className="form-control"
                    disabled={false}
                    type="text"
                  >
                    <option>Select</option>
                    {status?.map(stat => (
                      <option key={stat._id} value={stat._id}>{stat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label >
                      Start Date
                    </label>
                    <div>
                      <DatePicker
                        // poppername="endDate"
                        className="form-control"
                        // style={{ border: 'none', backgroundColor: 'red' }}
                        value={new Date(leadData?.startDate || '01/27/2023')}
                        // value={}
                        onChange={(e) => setLeadData({
                          ...leadData,
                          startDate: e
                        })}
                      />
                      {/* <input
                        value={leadData?.startDate?.split('T')[0]}
                        className="form-control"
                        onChange={(e) => setLeadData({
                          ...leadData,
                          startDate: e.target.value
                        })}
                        type="date"
                      /> */}
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label >
                      End Date
                    </label>
                    <div>
                      <DatePicker
                        // poppername="endDate"
                        className="form-control"
                        // style={{ border: 'none', backgroundColor: 'red' }}
                        value={new Date(leadData?.endDate || '01/27/2023')}
                        // value={}
                        onChange={(e) => setLeadData({
                          ...leadData,
                          endDate: e
                        })}
                      />
                      {/* <input
                        value={leadData?.endDate?.split('T')[0]}
                        className="form-control"
                        onChange={(e) => setLeadData({
                          ...leadData,
                          endDate: e.target.value
                        })}
                        type="date"
                      /> */}
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label >4Relevent Point Discussed</label>
                    <textarea
                      value={leadData?.pointDiscussed}
                      onChange={(e) => setLeadData({
                        ...leadData,
                        pointDiscussed: e.target.value
                      })}
                      type='text'
                      className='form-control'
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label >Next Appointment</label>
                    <DatePicker
                      // poppername="endDate"
                      className="form-control"
                      // style={{ border: 'none', backgroundColor: 'red' }}
                      value={new Date(leadData?.nextAppointment || '01/27/2023')}
                      // value={}
                      onChange={(e) => setLeadData({
                        ...leadData,
                        nextAppointment: e
                      })}
                    />
                    {/* <input
                      value={leadData?.nextAppointment?.split('T')[0]}
                      onChange={(e) => setLeadData({
                        ...leadData,
                        nextAppointment: e.target.value
                      })}
                      className="form-control"
                      type="date"
                    /> */}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label >Total Calls</label>
                    <input
                      value={leadData?.totalCalls}
                      onChange={(e) => setLeadData({
                        ...leadData,
                        totalCalls: e.target.value
                      })}
                      type='number'
                      className='form-control'
                    />
                  </div>
                </div>
              </div>
              <hr />
              {/* {user?.userType}
              {user?.jobRole?.name} */}

              {user?.jobRole?.name === 'Admin' && (
                <>
                  <div className="row mb-4">
                    <label className="col-sm-2 col-form-label">Assign To</label>
                    <div className="col-sm-8" >
                      {/* <div className="row"> */}
                      <input
                        onClick={(e) => {
                          setAssignType("Project");
                          setLeadData({
                            ...leadData,
                            assignType: 'Project'
                          })
                        }}
                        className="form-check-input"
                        type="radio"
                        name="AssignType"
                        id="radio1"
                        value="option1"
                        checked={assignType === 'Project'}
                      />
                      <label class="form-check-label mr-2" for="radio1">Project</label>
                      <input
                        onClick={(e) => {
                          setAssignType('Employee');
                          setLeadData({
                            ...leadData,
                            assignType: 'Employee'
                          })
                        }}
                        className="form-check-input ml-2"
                        type="radio"
                        name="AssignType"
                        id="radio1"
                        value="option2"
                        checked={assignType === 'Employee'}
                      />
                      <label class="form-check-label ml-4" for="radio2">Employee</label>
                      {/* </div> */}
                    </div>
                  </div>
                  <hr />
                  {/* {assignType === 'Project' && (
                    <>
                      <div className="row">
                        <div className="col-sm-6 form-group">
                          <label>
                            Project
                          </label>
                          <select
                            value={leadData?.project[leadData?.project?.length-1]?._id}
                            onChange={(e) => selectProject(e.target.value)}
                            className="custom-select"
                          >
                            <option>Please Select</option>
                            {projects.map((project) => (
                              <option key={project._id} value={project._id}>
                                {project.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <hr />
                    </>
                  )} */}
                  {assignType === 'Project' && (
                    <>
                      <div className="row">
                        <div className="col-sm-6 form-group">
                          <label>
                            Project
                          </label>
                          <select
                            // value={leadData?.project[leadData?.project?.length-1]?._id}
                            value={leadData?.project?._id}
                            onChange={(e) => selectProject(e.target.value)}
                            className="custom-select"
                          >
                            <option>Please Select</option>
                            {projects.map((project) => (
                              <option key={project._id} value={project._id}>
                                {project.name}

                              </option>
                            ))}
                          </select>

                        </div>
                      </div>
                      <hr />
                    </>
                  )}
                  {assignType === 'Employee' && (
                    <>
                      <div className="row">
                        <div className="col-sm-6 form-group">
                          <label>
                            Employees
                          </label>
                          <select
                            value={leadData?.currentAssigned?._id}
                            onChange={(e) => selectEmployee(e)}
                            className="custom-select"
                          >
                            <option value={99999}>Please Select</option>
                            {employees.map((employee) => (
                              <option key={employee._id} value={employee._id}>
                                {`${employee.firstName} ${employee.lastName}`}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <hr />
                    </>
                  )}
                </>
              )}
              <div className="submit-section">
                {/* <button type="submit" value="send" className="btn btn-primary submit-btn m-r-10">
                  Save &amp; Send
                </button> */}
                <button type="submit" value="save" className="btn btn-primary submit-btn">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Page Content */}
    </div>
  );
};

export default AddLeads;
