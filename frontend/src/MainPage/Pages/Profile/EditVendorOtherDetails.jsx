import React, { useState } from 'react'
import { toast } from 'react-toastify';
import httpService from '../../../lib/httpService';

const EditVendorOtherDetails = ({ fetchVendors, editVendorId, oDetails }) => {

  const [otherDetails, setotherDetails] = useState(oDetails || {
    pan: "",
    gst: "", openingBalance: "", paymentTerms: "", tds: "", currency: "INR"
  });

  const handleotherDetails = (e) => {
    setotherDetails({ ...otherDetails, [e.target.name]: e.target.value });
  }

  const toInputUppercase = e => {
    e.target.value = ("" + e.target.value).toUpperCase();
  };

  const toCapitalize = e => {
    e.target.value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
  };

  const editVendor = async () => {
    let vendorData = {
      otherDetails
    }

    toast
      .promise(
        httpService.put(`/vendor/${editVendorId}`, {
          ...vendorData,
        }),
        {
          error: 'Failed to edit vendor',
          success: 'Vendor edited successfully',
          pending: 'Editing vendor',
        }
      )
      .then(() => fetchVendors());
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    editVendor();
  }

  return (
      <div id="edit_vendor_other_details" className="modal custom-modal fade" role="dialog">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Other Details</h5>
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
                          <label className="col-form-label">
                            PAN <span className="text-danger">*</span>
                          </label>
                          <input
                            placeholder="PAN No." maxLength="10" pattern="[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}" title="Please enter valid PAN number. E.g. AAAAA9999A"
                            className="form-control"
                            type="text"
                            name='pan'
                            value={otherDetails?.pan}
                            onChange={handleotherDetails}
                            onInput={toInputUppercase}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="col-form-label">
                            GST <span className="text-danger">*</span>
                          </label>
                          <input
                            placeholder='GST No.'
                            maxlength="15"
                            pattern='[0-9]{2}[A-Z]{3}[ABCFGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}'
                            title='Please enter valid PAN number. E.g. 99AAAFA9999A1Z5'
                            className="form-control"
                            type="text"
                            name='gst'
                            value={otherDetails?.gst}
                            onChange={handleotherDetails}
                            onInput={toInputUppercase}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="col-form-label">
                            Opening Balance <span className="text-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="number" step={0.01}
                            name='openingBalance'
                            value={otherDetails?.openingBalance}
                            onChange={handleotherDetails}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="col-form-label"> Payment Terms</label>
                          <select className="custom-select" name="paymentTerms"
                            value={otherDetails?.paymentTerms}
                            onChange={handleotherDetails}
                          >
                            <option value=""></option>
                            <option value="Net 15">Net 15</option>
                            <option value="Net 30">Net 30</option>
                            <option value="Net 45">Net 45</option>
                            <option value="Net 60">Net 60</option>
                            <option value="Due end of the Month">Due end of the Month</option>
                            <option value="Due end of next Month">Due end of next Month</option>
                            <option value="Due on Receipt">Due on Receipt</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="col-form-label">
                              TDS <span className="text-danger">*</span>
                            </label>
                            <select className="custom-select" 
                              name="tds"
                              value={otherDetails?.tds}
                              onChange={handleotherDetails}
                            >
                              <option value=""></option>
                              <option value="Commission or Brokerage - [5 %]">Commission or Brokerage - [5 %]</option>
                              <option value="Commission or Brokerage (Reduced) - [3.75 %]">Commission or Brokerage (Reduced) - [3.75 %]</option>
                              <option value="Dividend - [10 %]">Dividend - [10 %]</option>
                              <option value="Dividend (Reduced) - [7.5 %]">Dividend (Reduced) - [7.5 %]</option>
                              <option value="ther Interest than securities - [10 %]">Other Interest than securities - [10 %]</option>
                              <option value="Other Interest than securities (Reduced) - [7.5 %]">Other Interest than securities (Reduced) - [7.5 %]</option>
                              <option value="Payment of contractors for Others - [2 %]">Payment of contractors for Others - [2 %]</option>
                              <option value="Payment of contractors for Others (Reduced) - [1.5 %]">Payment of contractors for Others (Reduced) - [1.5 %]</option>
                              <option value="Professional Fees - [10 %]">Professional Fees - [10 %]</option>
                              <option value="Professional Fees (Reduced) - [7.5 %]">Professional Fees (Reduced) - [7.5 %]</option>
                              <option value="Rent on land or furniture - [10 %]">Rent on land or furniture - [10 %]</option>
                              <option value="Rent on land or furniture (Reduced) - [7.5 %]">Rent on land or furniture (Reduced) - [7.5 %]</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group d-none">
                            <label className="col-form-label">Currency</label>
                            <select className="custom-select"
                              name="currency"
                              value={otherDetails?.currency}
                              onChange={handleotherDetails}
                              disabled
                              >
                              <option value="INR">INR - Indian Rupee</option>
                            </select>
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

export default EditVendorOtherDetails