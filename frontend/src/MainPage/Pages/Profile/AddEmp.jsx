import React from 'react'
import { Avatar_02 } from '../../../Entryfile/imagepath'
import { dateFormatter } from '../../../misc/helpers'
import { GENDERS } from '../../../model/shared/genders'

const AddEmp = ({ employee, handleEmployeeDetailsChange, newEmployeeDetails, setNewEmployeeDetails, isAdmin, roleData, handleNewEmployeeDetailsSubmit }) => {

  return (
    <div id="profile_info" className="modal custom-modal fade" role="dialog">
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
                        defaultValue={employee?.address?.addressLine1
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
  )
}

export default AddEmp