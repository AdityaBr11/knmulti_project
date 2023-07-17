
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { updateEmployee } from '../../../lib/api';
import httpService from '../../../lib/httpService';
import { Add, Delete } from '@mui/icons-material';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import DatePicker from 'react-date-picker';

const EditEmpEdu = ({ empId, eduData, setEmployee, userName }) => {
  const [educationIndex, setEducationIndex] = useState();
  const [edueditIndex, setEdueditIndex] = useState();
  const eductionTemplate = {
    qualification: "",
    instution: "",
    startDate: "",
    endDate: "",
    university: "",
    specialization: "",
    score: 0,
    gradingSystem: "",
  }
  const updateEduca = eduData.map((data, i) => {
    const upedu = {
      ...data,
      startDate: new Date(data?.startDate),
      endDate: new Date(data?.endDate),
      qualification: data?.qualification,
      instution: data?.instution,
      // university: data?.university,
      // specialization: data?.specialization,
      // score: data?.score,
      // gradingSystem: data?.gradingSystem,
    };
    return upedu;

  })
  console.log('iiiiiiiiiiiii', updateEduca);
  // setEducation(updateEduca);

  const [education, setEducation] = useState(updateEduca || [eductionTemplate]);

  const handleEducationDetails = (e, index) => {
    const updateEdu = education.map((edu, i) => {
      if (index == i) {
        const uped = { ...edu, [e.target.name]: e.target.value }
        return uped;
      } else {
        return edu;
      }
    });

    setEducation([...updateEdu]);
  }
  const handleEdu_startDate = (e, index) => {
    const updateEdu = education.map((edu, i) => {
      if (index == i) {
        const uped = { ...edu, startDate: e }
        return uped;
      } else {
        return edu;
      }
    });

    setEducation([...updateEdu]);
  }

  const handleEdu_endDate = (e, index) => {
    const updateEdu = education.map((edu, i) => {
      if (index == i) {
        const uped = { ...edu, endDate: e }
        return uped;
      } else {
        return edu;
      }
    });

    setEducation([...updateEdu]);
  }
  console.log({ education });

  const handleAnotherSet = () => {
    setEducation([...education, eductionTemplate]);
  }

  const handleRemoveQualification = (e, index) => {
    if (index != 0) {
      const upedu = education.filter((edu, i) => index != i);
      setEducation(upedu);
    }
  }
  const handleEDitEducation = (bank, index) => {
    const updateedit = education.filter((edu, i) => {
      if (index == i) {
        const uped = { ...edu, ...bank };
        console.log('handle', edu);
        return uped;
      }
    });
    setEducationIndex(474);
    setEdueditIndex(index);
  };

  const handleSaveEducation = (e) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to ',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const finalEdu = education.filter(edu => edu.qualification !== "");
        updateEmployee(empId, { userName, education: finalEdu }).then((res) => {
          setEmployee();
        });
        document.querySelectorAll('.close')?.forEach((e) => e.click());
      }
    });
  }


  return (
    <div id="edit_emp_edu" className="modal custom-modal fade" role="dialog">
      <div
        className="modal-dialog modal-dialog-centered modal-lg mw-100 w-75"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Eduction</h5>
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
              education?.map((bank, index) => (
                <div key={index}>
                  <div className="row">
                    <div className="col-md-4">
                      Qualification : {bank?.qualification}
                    </div>
                    <div className="col-md-4">
                      Instution: {bank?.instution}
                    </div>
                    <div className="col-md-3">
                      University : {bank?.university}
                    </div>
                    <div
                      className="col-md-1"
                    // className='float-right'
                    >
                      <div className="btn btn-info float-right" onClick={() => handleEDitEducation(bank, index)}>
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
                      Specialization : {bank?.specialization}
                    </div>
                    <div className="col-md-4">
                      Score : {bank?.score}
                    </div>
                    <div className="col-md-3">
                      Grading System : {bank?.gradingSystem}
                    </div>

                    <div
                      className="col-md-1"
                    // className='float-right'
                    >
                      {/* <div className="btn btn-primary float-right" onClick={() => handleEDitEducation(bank, index)}>
                              <EditIcon />
                            </div> */}
                      <div
                        className="btn btn-primary float-right"
                        onClick={(e) => handleRemoveQualification(e, index)}
                      >
                        <Delete />
                      </div>
                    </div>
                  </div>
                  <hr></hr>
                  <br />

                </div>
              ))}

            {
              educationIndex == 474 &&
              education?.map((edu, index) => (
                <div key={index}>
                  {edueditIndex === index ? <>
                    <div className="row">
                      <div className="col-md-3">
                        <div className="form-group">
                          <label className="col-form-label">
                            Qualification{' '}
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <input

                            className="form-control"
                            type="text"
                            name="qualification"
                            value={edu?.qualification}
                            onChange={(e) =>
                              handleEducationDetails(e, index)
                            }
                          // onInput={toInputUppercase}
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label className="col-form-label">
                            Instution
                            {/* 11<span className="text-danger">*</span> */}
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="instution"
                            value={edu?.instution}
                            onChange={(e) =>
                              handleEducationDetails(e, index)
                            }
                          // onInput={toInputUppercase}
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label className="col-form-label">
                            University{' '}
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="university"
                            value={edu?.university}
                            onChange={(e) =>
                              handleEducationDetails(e, index)
                            }
                          // onInput={toInputUppercase}
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label className="col-form-label">
                            Specialization{' '}
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="specialization"
                            value={edu?.specialization}
                            onChange={(e) =>
                              handleEducationDetails(e, index)
                            }
                          // onInput={toInputUppercase}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-3">
                        <div className="form-group">
                          <label className="col-form-label">
                            Start Date
                          </label>
                          <DatePicker
                            id='dob'
                            poppername="startDate"
                            className="form-control"
                            // style={{ border: 'none', backgroundColor: 'red' }}
                            value={edu?.startDate}
                            onChange={(e) =>
                              handleEducationDetails1(e, index)
                            }
                          />
                          {/* <input
                                type="date"
                                name="startDate"
                                value={edu?.startDate?.split('T')[0]}
                                className="form-control"
                                onChange={(e) =>
                                  handleEducationDetails(e, index)
                                }
                              /> */}
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label className="col-form-label">End Date</label>
                          <DatePicker
                            // poppername="endDate"
                            className="form-control"
                            // style={{ border: 'none', backgroundColor: 'red' }}
                            value={edu?.endDate}
                            onChange={(e) =>
                              handleEducationDetailsendDate(e, index)
                            }
                          />
                          {/* <input
                                type="date"
                                name="endDate"
                                value={edu?.endDate?.split('T')[0]}
                                className="form-control"
                                onChange={(e) =>
                                  handleEducationDetails(e, index)
                                }
                              /> */}
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label className="col-form-label">Score</label>
                          <input
                            type="number"
                            name="score"
                            value={edu?.score}
                            className="form-control"
                            onChange={(e) =>
                              handleEducationDetails(e, index)
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label className="col-form-label">
                            Grading System
                          </label>
                          <input
                            type="text"
                            name="gradingSystem"
                            value={edu?.gradingSystem}
                            className="form-control"
                            onChange={(e) =>
                              handleEducationDetails(e, index)
                            }
                          />
                        </div>

                      </div>

                    </div>

                    <div className='col-md-3'>
                      <br></br>

                      <div style={{ marginTop: '15px' }}
                        className="btn btn-primary float-center"
                        onClick={(e) => handleSaveEducation()}
                      >
                        Save
                      </div>
                      <div style={{ marginTop: '15px', marginLeft: '11px' }}
                        className="btn btn-primary float-center"
                        onClick={(e) => handleCancelEducation()}
                      >
                        Cancel
                      </div>
                    </div>
                    <hr />
                    <br></br>
                    <br></br>
                  </>
                    : ''}
                </div>

              ))}


          </div>
        </div>
      </div>
    </div>
  )
}

export default EditEmpEdu