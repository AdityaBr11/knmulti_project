import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import httpService from '../../../lib/httpService';
import { useDispatch, useSelector } from 'react-redux';
import { createNotify } from '../../../features/notify/notifySlice';

const AddEmpAuth = ({ candData, setRerender }) => {

  const dispatch = useDispatch();

  const empObj = useSelector((state) => state?.authentication?.value?.user);

  const [ roles, setRoles ] = useState([]);

  const [ empData, setEmpData ] = useState({
    firstName: candData?.firstName || "",
    lastName: candData?.lastName || "",
    userName: "",
    email: candData?.email || "",
    password: "",
    cnfPassword: "",
    joinDate: "",
    mobileNo: candData?.mobile || "",
    jobRole: "",
  });

  const handleChange = (e) => {
    setEmpData({ ...empData, [e.target.name] : e.target.value });
  }

  const fetchRoles = async () => {
    const roles = await httpService.get('/role');
    setRoles(roles?.data);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleNewSubmit = async (e) => {
    e.preventDefault();
    console.log(empData);
    if(empData.password !== empData.cnfPassword) { 
       toast.error("Password and Confirm Password does not match"); 
       return;
    }
    if(empData.jobRole == "" || empData.jobRole == "Please Select role"){
      // alert("Please select a job role");
      toast.error("Please select a job role");
      return;
    }
    const empRes = await httpService.post('/employee', empData);

    dispatch(createNotify({
      notifyHead: `New Employee Added`,
      notifyBody: `Employee ${empRes?.data?.userName} is created`,
      createdBy: empObj?._id
    }));

    await httpService.put(`/candidate/${candData._id}`, { isEmployee: true, employeeId : empRes.data._id });
    await setRerender(true);
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

  return (
    <div id="add_emp_login" className="modal custom-modal fade" role="dialog">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
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
                        name='firstName'
                        value={empData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">Last Name</label>
                      <input
                        className="form-control"
                        type="text"
                        name='lastName'
                        value={empData.lastName}
                        onChange={handleChange}
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
                        name='userName'
                        value={empData.userName}
                        onChange={handleChange}
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
                        name='email'
                        value={empData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">Password</label>
                      <input
                        className="form-control"
                        type="password"
                        name='password'
                        value={empData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">Confirm Password</label>
                      <input
                        className="form-control"
                        type="password"
                        name='cnfPassword'
                        value={empData.cnfPassword}
                        onChange={handleChange}
                        // title='Please enter matching password'
                        // pattern={empData?.password}
                        required
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
                          className="form-control"
                          type="date"
                          name='joinDate'
                          value={empData.joinDate}
                          onChange={handleChange}
                          required
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
                        name='mobileNo'
                        value={empData.mobileNo}
                        onChange={handleChange}
                        pattern="[7-9]{1}[0-9]{9}" 
                        title="Phone number with 7-9 and remaing 9 digit with 0-9"
                        required
                      />
                    </div>
                  </div>

                  {/* <div className="col-md-3">
                    <div className="form-group">
                      <label>Employee ID</label>
                      <input
                        type="number"
                        className="form-control"
                        name='_id'
                        value={empData._id}
                        onChange={handleChange}
                        // disabled
                      />
                    </div>
                  </div> */}

                  <div className="col-md-6">
                    <div className="form-group">
                      <label>
                        Job Role <span className="text-danger">*</span>
                      </label>
                      <select className="custom-select" name="jobRole"
                        value={empData?.jobRole}
                        onChange={handleChange}
                        required
                      >
                        <option>Please Select role</option>
                        { roles?.map((r, index) => (
                          <option key={index} value={r?._id}>{r?.name}</option>
                        )) }
                      </select>
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
  )
}

export default AddEmpAuth