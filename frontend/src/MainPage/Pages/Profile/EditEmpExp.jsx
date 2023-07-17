import { Add, Delete } from '@mui/icons-material';
import React, { useState } from 'react'
import { updateEmployee } from '../../../lib/api';
import { dateFormatter } from '../../../misc/helpers';
import DatePicker from 'react-date-picker';
import EditIcon from '@mui/icons-material/Edit';
const EditEmpExp = ({ empId, expData, setEmployee, userName }) => {

  const experienceTemplate = {
    startDate: "",
    endDate: "",
    company: "",
    designation: "",
    responsibilities: "",
  }

  const [experience, setExperience] = useState(expData || [experienceTemplate]);

  const handleExpDetails = (e, index) => {
    const updateExp = experience.map((exp, i) => {
      if (index == i) {
        const upexp = { ...exp, [e.target.name]: e.target.value }
        return upexp;
      } else {
        return exp;
      }
    });

    setExperience([...updateExp]);
  }
  const [expIndex, setExpIndex] = useState();
  const [expeditIndex, setExpeditIndex] = useState();

  const handleEDitEXper = (index) => {
    setExpIndex(474);
    setExpeditIndex(index);
  };
  const handleAnotherSet = () => {
    setExperience([...experience, experienceTemplate]);
  }

  const handleRemove = (e, index) => {
    if (index != 0) {
      const upepx = experience.filter((exp, i) => index != i);
      setExperience(upepx);
    }
  }

  const handleSaveEXP = (e) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to save these details?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
    }).then(async (result) => {
      if (result.isConfirmed) {

        const finalExp = experience.filter(exp => exp.company !== "");
        updateEmployee(empId, { userName, previousExperience: finalExp }).then((res) => {
          setEmployee();
          setExpIndex(475);

          toast.success('Education Data is Save1')
        });
        document.querySelectorAll('.close')?.forEach((e) => e.click());
      }
    });
  }
  function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  return (
    <div id="edit_emp_exp" className="modal custom-modal fade" role="dialog">
      <div
        className="modal-dialog modal-dialog-centered modal-lg mw-100 w-75"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Experience</h5>
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
            {
              experience?.map((exp, index) => (
                <div key={index}>
                  <div className="row">
                    <div className="col-md-4">
                      Company : {exp?.company}
                    </div>
                    <div className="col-md-4">
                      Designation: {exp?.designation}
                    </div>
                    <div className="col-md-3">
                      Responsibilities : {exp?.responsibilities}
                    </div>
                    <div
                      className="col-md-1"
                    // className='float-right'
                    >
                      <div className="btn btn-info float-right" onClick={() => handleEDitEXper(index)}>
                        <EditIcon />
                      </div>
                    </div>

                  </div>
                  <div className="row">
                    {/* <div className="col-md-4">
                          Specialization : {bank?.specialization}
                        </div> */}
                    {/* <div className="col-md-4">
                          Start Date : {bank?.startDate}
                        </div> */}
                    {/* <div className="col-md-4">
                          End Date :
                           {bank?.endDate}
                        </div> */}

                  </div>
                  <br></br>
                  <div className='row'>
                    <div className="col-md-4">
                      Start Date :- {convert(exp?.startDate)}
                      {/* {exp?.startDate} */}
                    </div>
                    <div className="col-md-4">
                      End Date :- {convert(exp?.endDate)}
                      {/* {exp?.endDate} */}
                    </div>
                    <div
                      className="col-md-3"
                    // className='float-right'
                    ></div>
                    <div
                      className="col-md-1"
                    // className='float-right'
                    >
                      {/* <div className="btn btn-primary float-right" onClick={() => handleEDitEducation(bank, index)}>
                              <EditIcon />
                            </div> */}
                      <div
                        className="btn btn-primary float-right"
                        onClick={(e) => handleRemove(e, index)}
                      >
                        <Delete />
                      </div>
                    </div>
                  </div>
                  <hr></hr>
                  <br />

                </div>
              ))}

            {expIndex == 474 &&
              experience?.map((exp, index) => (
                <div key={index}>
                  {expeditIndex === index ? <>
                    <div className="row">
                      <div className="col-md-3">
                        <div className="form-group">
                          <label className="col-form-label">
                            Company
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="company"
                            value={exp?.company}
                            onChange={(e) => handleExpDetails(e, index)}
                          // onInput={toInputUppercase}
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label className="col-form-label">
                            Designation
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="designation"
                            value={exp?.designation}
                            onChange={(e) => handleExpDetails(e, index)}
                          // onInput={toInputUppercase}
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label className="col-form-label">
                            Responsibilities{' '}
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="responsibilities"
                            value={exp?.responsibilities}
                            onChange={(e) => handleExpDetails(e, index)}
                          // onInput={toInputUppercase}
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label className="col-form-label">Start Date</label>
                          <DatePicker
                            // poppername="endDate"
                            className="form-control"
                            // style={{ border: 'none', backgroundColor: 'red' }}
                            value={exp?.startDate}
                            onChange={(e) =>
                              handleExpStartDate(e, index)
                            }
                          />

                          {/* <input
                              type="date"
                              name="startDate"
                              value={exp?.startDate?.split('T')[0]}
                              className="form-control"
                              onChange={(e) => handleExpDetails(e, index)}
                            /> */}
                        </div>
                      </div>

                      {/* {Expresume?.fileName} */}

                    </div>
                    <div className='row'>
                      <div className="col-md-2">
                        <div className="form-group">
                          <label className="col-form-label">End Date</label>
                          <DatePicker
                            // poppername="endDate"
                            className="form-control"
                            // style={{ border: 'none', backgroundColor: 'red' }}
                            value={exp?.endDate}
                            onChange={(e) =>
                              handleExpEndDate(e, index)
                            }
                          />

                        </div>
                      </div>
                      <div className='col-md-3'>
                        <br></br>

                        <div style={{ marginTop: '15px' }}
                          className="btn btn-primary float-center"
                          onClick={(e) => handleSaveEXP()}
                        >
                          Save
                        </div>
                        <div style={{ marginTop: '15px', marginLeft: '11px' }}
                          className="btn btn-primary float-center"
                          onClick={(e) => handleCancelEXP()}
                        >
                          Cancel
                        </div>
                      </div>
                      <hr />
                    </div>
                  </> : ''}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditEmpExp