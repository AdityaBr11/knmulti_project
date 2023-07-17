import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import httpService from '../../../lib/httpService';

const EditVendorAddress = ({ fetchVendors, editVendorId, bAddress, sAddress }) => {

  const [billAddress, setbillAddress] = useState(bAddress || {
    attention: "", address: "", city: "", state: "", pincode: "", country: "india", phone: ""
  });

  const [shipAddress, setshipAddress] = useState(sAddress || {
    attention: "", address: "", city: "", state: "", pincode: "", country: "india", phone: ""
  });

  const handlebillAddress = (e) => {
    setbillAddress({ ...billAddress, [e.target.name]: e.target.value });
  }

  const handleshipAddress = (e) => {
    setshipAddress({ ...shipAddress, [e.target.name]: e.target.value });
  }

  const handleCopyBillToShipAddress = (e) => {
    setshipAddress({ ...billAddress });
  }

  const toCapitalize = e => {
    e.target.value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
  }

  const editVendor = async () => {
    let vendorData = {
      billAddress,
      // shipAddress
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



  let stateArr = [ "Andhra Pradesh",
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
                "Puducherry"]


  return (
      <div id="edit_vendoraddress" className="modal custom-modal fade" role="dialog">
        <div
          className="modal-dialog modal-dialog-centered modal-lg mw-100 w-75"
          role="document"
          >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Vendor Address</h5>
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
                  {/* <div className="row">
                      <div className="col-md-6">
                      <label className="col-form-label">
                        Billing Address
                      </label>
                      </div>
                      <div className="col-md-6">
                      <label className="col-form-label">
                        Shipping Address {"  "} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <div className='btn btn-primary'
                          style={{ cursor: "pointer" }}
                          onClick={handleCopyBillToShipAddress}
                        >Copy billing address</div>
                      </label>
                      </div>
                    </div> */}
                    <div className='row'>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="col-form-label">
                            Attention
                          </label>
                          <input type="text" id="" className="form-control"
                            name='attention'
                            value={billAddress.attention}
                            onChange={handlebillAddress}
                            onInput={toCapitalize}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label className="col-form-label">
                            address
                          </label>
                          <textarea className="form-control" cols="10" rows="2"
                            placeholder='House No, Street'
                            name='address'
                            value={billAddress.address}
                            onChange={handlebillAddress}
                          >
                          </textarea>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group col-md-6">
                        <label className="col-form-label">
                          City
                        </label>
                        <input type="text" id="" className="form-control"
                          name='city'
                          value={billAddress.city}
                          onChange={handlebillAddress}
                          onInput={toCapitalize}
                        />
                      </div>
                      <div className="form-group col-md-6">
                        <label className="col-form-label">
                          State
                        </label>
                        <select className="custom-select" 
                          name='state'
                          value={billAddress.state}
                          onChange={handlebillAddress}
                        >
                            <option value=""></option>
                        { stateArr.map((a) => (
                            <option value={a}>{a}</option>
                          )) 
                        }
                          </select>
                        
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="col-form-label">
                            Pincode
                          </label>
                          <input type="number" maxLength={6} className="form-control"
                            name='pincode'
                            value={billAddress.pincode}
                            onChange={handlebillAddress}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="col-form-label">
                            Phone
                          </label>
                          <input type="number" maxLength={10} className="form-control"
                            name="phone" 
                            value={billAddress.phone}
                            onChange={handlebillAddress}
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

export default EditVendorAddress