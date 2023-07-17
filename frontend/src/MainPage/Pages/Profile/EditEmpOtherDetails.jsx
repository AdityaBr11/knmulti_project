import React, { useState } from 'react'
import { updateEmployee } from '../../../lib/api';
import { MARITAL_STATUS } from '../../../model/shared/maritalStates';

const EditEmpOtherDetails = ({ empId, oData, setEmployee, userName }) => {

  const otherDetailsObj = {
    pan: "",
    passportNo: "",
    passportExp: "",
    phoneNo: "",
    nationality: "",
    religion: "",
    maritalStatus: "",
    employmentOfSpouse: "",
    numberOfChildren: 0,
  }

  const [otherDetails, setOtherDetails] = useState(oData || otherDetailsObj);

  const handleotherDetails = (e) => {
    setOtherDetails({ ...otherDetails, [e.target.name]: e.target.value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    updateEmployee(empId, { userName, personalInformation: otherDetails }).then((res) => {
      setEmployee();
    });
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

  return (
    <div id="edit_emp_other_details" className="modal custom-modal fade" role="dialog">
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Statutary Details
            </h5>
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
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Passport No</label>
                    <input
                      type="text"
                      className="form-control"
                      name='passportNo'
                      maxLength={10}
                      pattern="[a-zA-Z]{1}[0-9]{7}"
                      // pattern="[a-zA-Z]{2}[0-9]{5}[a-zA-Z]{1}"
                      title="Please enter valid Passport number. E.g. A2190457"
                      value={otherDetails?.passportNo}
                      onChange={handleotherDetails}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Pan No</label>
                    <div>
                      <input
                        className="form-control"
                        type="text"
                        name='pan'
                        pattern="[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}"
                        title="Please enter valid Pan number. E.g. AAAAA1234A"
                        placeholder='PAN No.'
                        value={otherDetails?.pan}
                        onChange={handleotherDetails}
                      />
                    </div>
                  </div>
                </div>

              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>ESI Number</label>
                    <input
                      className="form-control"
                      type="text"
                      name='esino'
                      pattern="[0-9]{17}"
                      placeholder="ESI Number "
                      title="Please enter valid ESI Number. E.g. 99558565759955664"

                      value={otherDetails?.esino}
                      onChange={handleotherDetails}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>PF Number / UAN Number</label>
                    <input
                      className="form-control"
                      type="text"
                      name='pfno'
                      maxLength={10}
                      pattern="[0-9]{7}"
                      title="Please enter valid Pf number. E.g. 0543211"
                      placeholder="PF No."
                      value={otherDetails?.pfno}
                      onChange={handleotherDetails}
                    />
                  </div>
                </div>

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
  )
}

export default EditEmpOtherDetails