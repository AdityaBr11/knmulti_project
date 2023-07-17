import React, { useEffect, useState } from 'react'
import { updateEmployee } from '../../../lib/api';
import { Add, Delete } from '@mui/icons-material';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
const EditEmpBank = ({ empId, bankData, setEmployee, userName }) => {

  const bankDetailsObj = {
    accountHoldersName: "",
    accountNumber: "",
    IFSC: "",
    upi: "",
    bankname: "",
    branch: "",
    bankdetails1: "",
  }

  const [bankDetails, setBankDetails] = useState(bankData || bankDetailsObj);
  const [BankIndex, setBankIndex] = useState();
  const [bankeditIndex, setbankeditIndex] = useState();

  const handlebankDetails = (e) => {
    setBankDetails({ ...bankDetails, [e.target.name]: e.target.value });
  }
  console.log(bankDetails, 'bankDetailsbankDetails')
  const handleEDitSetBank = (bank, index) => {
    setBankIndex(474);
    setbankeditIndex(index);
    // setbankDetailedit([bank]);
  };
  const handleCancelBank = () => {
    setBankIndex(475);
  };
  const handleRemoveBank = (e, index) => {

    const upedu = bankDetails.filter((edu, i) => index != i);
    setBankDetails(upedu);
  };
  const handleBankEdit = (e, index) => {
    console.log(e, index, 'ssssaaa');
    const updateBankD = bankDetails.map((bank1, i) => {
      if (index == i) {
        console.log(index, e.target.name, 'a', e.target.value, 'ritik')
        const uped = { ...bank1, [e.target.name]: e.target.value };
        console.log(uped, ' e.target.name');
        return uped;
      } else {
        return bank1;
      }
    });
    console.log(updateBankD, ' e.target.name');
    // setbankDetailedit([...updateBankD]);
    setBankDetails([...updateBankD]);
    // console.log(bankDetailedit, 'bankDetailedit');

  };


  const handleSaveBank = (e) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to save these details?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
    }).then(async (result) => {
      if (result.isConfirmed) {

        updateEmployee(empId, { userName, bankDetails }).then((res) => {
          setEmployee();
          setBankIndex(475);
        });

        document.querySelectorAll('.close')?.forEach((e) => e.click());
      }
    });
  }

  return (
    <div id="edit_emp_bank" className="modal custom-modal fade" role="dialog">
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Bank Details</h5>
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
            {bankDetails?.map((bank, index) => (
              <div key={index}>
                <div className="row">
                  <div className="col-md-4">
                    Bank  Detaills : {bank?.bankdetails1}
                  </div>
                  <div className="col-md-4">
                    Bank Name : {bank?.bankname}
                  </div>
                  <div className="col-md-3">
                    Account Number : {bank?.accountNumber}
                  </div>
                  <div
                    className="col-md-1"
                  // className='float-right'
                  >
                    <div className="btn btn-info float-right"
                      onClick={() => handleEDitSetBank(bank, index)}>
                      <EditIcon />
                    </div>
                  </div>
                </div>
                <hr></hr>
                <br></br>

                <div className='row'>
                  <div className="col-md-4">
                    Account Holder : {bank?.accountHoldersName}
                  </div>
                  <div className="col-md-4">
                    Branch : {bank?.branch}
                  </div>
                  <div className="col-md-3">
                    IFSC : {bank?.IFSC}
                  </div>
                  <div
                    className="col-md-1"
                  // className='float-right'
                  >
                    {/* <div
                      className="btn btn-primary float-right"
                      onClick={(e) => handleRemoveBank(e, index)}
                    >
                      <Delete />
                    </div> */}
                  </div>
                </div>
                <hr></hr>
                <br />
              </div>
            ))}

            {
              BankIndex == 474 &&
              bankDetails?.map((edu, index) => (
                // index < bankeditIndex &&
                <div key={index}>
                  {bankeditIndex === index ? <>
                    <div className="row">
                      <div className="col-md-3">
                        <div className="form-group">
                          <label className="col-form-label">
                            Bank  Detaills{' '}
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="bankdetails1"
                            value={edu?.bankdetails1}
                            onChange={(e) =>
                              handleBankEdit(e, bankeditIndex)
                            }
                          // onInput={toInputUppercase}
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label className="col-form-label">
                            Bank Name
                            {/* 11<span className="text-danger">*</span> */}
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="bankname"
                            value={edu?.bankname}
                            onChange={(e) =>
                              handleBankEdit(e, bankeditIndex)
                            }
                          // onInput={toInputUppercase}
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label className="col-form-label">
                            Account Holder{' '}
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="accountHoldersName"
                            value={edu?.accountHoldersName}
                            onChange={(e) =>
                              handleBankEdit(e, bankeditIndex)
                            }
                          // onInput={toInputUppercase}
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label className="col-form-label">
                            Account Number{' '}
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <input
                            type="text"
                            pattern="[0-9]{11}"
                            maxLength={11}
                            title="Please enter valid Account Code. E.g. 52520065104"

                            name="accountNumber"
                            className="form-control"
                            value={edu?.accountNumber}
                            onChange={(e) =>
                              handleBankEdit(e, bankeditIndex)
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
                            IFSC
                          </label>
                          <input
                            type="text"
                            maxLength={11}
                            pattern="[a-zA-Z]{4}[0-9]{7}"
                            // pattern="[a-zA-Z]{2}[0-9]{5}[a-zA-Z]{1}"
                            title="Please enter valid IFSC Code. E.g. ABHY0065104"
                            name="IFSC"
                            value={edu?.IFSC}
                            className="form-control"
                            onChange={(e) =>
                              handleBankEdit(e, bankeditIndex)
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label className="col-form-label">Branch</label>

                          <input
                            type="text"
                            name="branch"
                            value={edu?.branch}
                            className="form-control"
                            onChange={(e) =>
                              handleBankEdit(e, bankeditIndex)
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label className="col-form-label">UPI ID</label>
                          <input
                            type="text"
                            name="upi"
                            value={edu?.upi}
                            className="form-control"
                            onChange={(e) =>
                              handleBankEdit(e, bankeditIndex)
                            }
                          />
                        </div>
                      </div>
                      <div className='col-md-3'>
                        <br></br>

                        <div style={{ marginTop: '15px' }}
                          className="btn btn-primary float-center"
                          onClick={(e) => handleSaveBank()}
                        >
                          Save
                        </div>
                        <div style={{ marginTop: '15px', marginLeft: '11px' }}
                          className="btn btn-primary float-center"
                          onClick={(e) => handleCancelBank()}
                        >
                          Cancel
                        </div>
                      </div>
                    </div>

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

export default EditEmpBank