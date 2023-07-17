import React, { useEffect, useState } from 'react'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { toast } from 'react-toastify';
import httpService from '../../lib/httpService';
import { useDispatch, useSelector } from 'react-redux';
import { createNotify } from '../../features/notify/notifySlice';
import FileUploadService from '../Pages/Profile/FileUploadService';

const AddVendorModel = ({ fetchVendors, editForm = false, editVendorId = null }) => {

  const dispatch = useDispatch();

  const empObj = useSelector((state) => state?.authentication?.value?.user);

  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [company, setcompany] = useState("");
  const [name, setname] = useState("")
  const [email, setemail] = useState("");
  const [phone, setphone] = useState("");
  const [mobile, setmobile] = useState("");
  const [website, setwebsite] = useState("");
  const [vendorType, setvendorType] = useState("");
  const [currentFile, setcurrentFile] = useState("");
  const [otherDetails, setotherDetails] = useState({
    pan: "",
    gst: "", openingBalance: "", paymentTerms: "", tds: "", currency: "INR"
  });

  const [billAddress, setbillAddress] = useState({
    attention: "", address: "", city: "", state: "", pincode: "", country: "india", phone: ""
  });

  const [shipAddress, setshipAddress] = useState({
    attention: "", address: "", city: "", state: "", pincode: "", country: "india", phone: ""
  });

  const personContactTemplate = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    mobile: ""
  };
  const [personContact, setPersonContact] = useState([personContactTemplate]);

  const [dName, setdName] = useState([]);

  const handleotherDetails = (e) => {
    setotherDetails({ ...otherDetails, [e.target.name]: e.target.value });
  }

  const handlebillAddress = (e) => {
    setbillAddress({ ...billAddress, [e.target.name]: e.target.value });
  }

  const handleshipAddress = (e) => {
    setshipAddress({ ...shipAddress, [e.target.name]: e.target.value });
  }

  const handleCopyBillToShipAddress = (e) => {
    setshipAddress({ ...billAddress });
  }

  const addPersonContactField = () => {
    setPersonContact([...personContact, personContactTemplate]);
  }

  const removePersonContactField = (e, index) => {
    // if (index !== 0) {
    const updatedPersonContact = personContact.filter((pct, i) => index !== i);
    setPersonContact(updatedPersonContact);
    // }
  }

  const handlePersonContact = (e, index) => {
    const updatedPersonContact = personContact.map((pct, i) => index == i ? Object.assign(pct, { [e.target.name]: e.target.value }) : pct);
    setPersonContact(updatedPersonContact);
  }


  const addVendor = async () => {
    let vendorData = {
      name,
      firstName,
      lastName,
      company,
      email,
      phone,
      mobile,
      website,
      vendorType,
      otherDetails,
      billAddress,
      shipAddress,
      personContact
    }

    toast
      .promise(
        httpService.post('/vendor', {
          ...vendorData,
        }),
        {
          error: 'Failed to add vendor',
          success: 'Vendor added successfully',
          pending: 'Adding vendor',
        }
      )
      .then((res) => {
        dispatch(createNotify({
          notifyHead: `New Vendor Added`,
          notifyBody: `Vendor ${res?.data?.name} is created`,
          createdBy: empObj?._id
        }));
        fetchVendors()
      });
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  };

  const editVendor = async () => {
    const filedata = await FileUploadService.upload(currentFile);
    console.log(filedata?.data, 'filedata', filedata);
    let vendorData = {
      fileInfos: filedata?.data,
      name,
      firstName,
      lastName,
      company,
      email,
      phone,
      mobile,
      website,
      vendorType,
      otherDetails,
      billAddress,
      shipAddress,
      personContact
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

  async function fetchVendor(id) {
    const res = await httpService.get('/vendor/' + id);
    const vd = res.data;
    setfirstName(vd.firstName);
    setcurrentFile(vd.fileInfos)
    setlastName(vd.lastName);
    setname(vd.name);
    setcompany(vd.company);
    setemail(vd.email);
    setphone(vd.phone);
    setmobile(vd.mobile);
    setwebsite(vd.website);
    setvendorType(vd.vendorType);
    setotherDetails(vd.otherDetails);
    setbillAddress(vd.billAddress);
    setshipAddress(vd.shipAddress);
    setPersonContact(vd.personContact);
  }

  useEffect(() => {
    if (editForm && editVendorId) {
      fetchVendor(editVendorId);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editForm) {
      editVendor()
    } else {
      addVendor();
    }
  }

  const toInputUppercase = e => {

    e.target.value = ("" + e.target.value).toUpperCase();
  };

  const toCapitalize = e => {
    e.target.value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
  }

  let abc = []
  console.log("currentFile", currentFile);
  const handleDName = () => {
    if (company) {
      abc.push(company);
    }
    if (firstName) {
      abc.push(`${firstName} ${lastName}`);
      if (lastName) {
        abc.push(`${lastName} ${firstName}`);
      }
    }
    setdName([...abc]);
  }

  let stateArr = ["Andhra Pradesh",
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
    <div id="add_vendor" className="modal custom-modal fade" role="dialog">
      <div
        className="modal-dialog modal-dialog-centered modal-lg mw-100 w-75"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Vendor</h5>
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
                      First Name <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      name='firstName'
                      value={firstName}
                      onChange={(e) => {
                        setfirstName(e.target.value)
                      }}
                      onBlur={handleDName}
                      onInput={toCapitalize}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="col-form-label">
                      Last Name
                    </label>
                    <input
                      name='lastName'
                      value={lastName}
                      onChange={(e) => {
                        setlastName(e.target.value);

                      }}
                      onBlur={handleDName}
                      className="form-control"
                      type="text"
                      onInput={toCapitalize}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="col-form-label">
                      Company
                    </label>
                    <input
                      name='company'
                      value={company}
                      onChange={(e) => {
                        setcompany(e.target.value);

                      }}
                      onBlur={handleDName}
                      className="form-control floating"
                      type="text"

                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="col-form-label">
                      Vendor Display Name <span className="text-danger">*</span>
                    </label>
                    <select className="custom-select"
                      name="name"
                      value={name}
                      onChange={(e) => setname(e.target.value)}
                      onFocus={handleDName}
                      required
                    >
                      {editForm ?
                        <option value={name}>{name}</option>
                        :
                        <option value=""></option>
                      }
                      <div className='dropdown-divider'></div>
                      {dName.map((d) => (
                        <option value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className='row'>

                <div className="col-md-6">
                  <div className="form-group">
                    <label className="col-form-label">Email</label>
                    <input
                      name='email'
                      value={email}
                      onChange={(e) => setemail(e.target.value)}
                      className="form-control"
                      type="email"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="col-form-label">Website</label>
                    <input
                      name='website'
                      value={website}
                      onChange={(e) => setwebsite(e.target.value)}
                      className="form-control"
                      type="text"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="col-form-label">
                      Work Phone <span className="text-danger">*</span>
                    </label>
                    <input
                      name='phone'
                      value={phone}
                      onChange={(e) => setphone(e.target.value)}
                      className="form-control floating"
                      type="number"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="col-form-label">
                      Mobile
                    </label>
                    <input
                      name='phone'
                      value={mobile}
                      onChange={(e) => setmobile(e.target.value)}
                      className="form-control floating"
                      type="number"
                      maxLength={10}
                    />
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="col-form-label">Vendor Type</label>
                    <select className="custom-select" name="vendorType"
                      value={vendorType}
                      onChange={(e) => setvendorType(e.target.value)}
                    >
                      <option value=""></option>
                      <option value="supplier">supplier</option>
                      <option value="landowner">landowner</option>
                      <option value="agent">agent</option>
                    </select>
                  </div>

                </div>
                <div className="form-group">
                  <label>Upload your Pic</label>
                  <div className="custom-file">

                    <input
                      name="resumeFile"
                      type="file"
                      className="custom-file-input"
                      id="cv_upload"
                      value={currentFile?.fileName}
                      onChange={(e) => setcurrentFile(e.target.files[0])}

                    />
                    <label className="custom-file-label" htmlFor="cv_upload"
                      value={currentFile?.fileName}
                    >
                      {currentFile?.fileName || currentFile?.name || currentFile[0]?.fileName ?
                        <span className="">{currentFile?.name} {currentFile[0]?.fileName} {currentFile?.fileName} </span> : "Choose file"}

                      {/* {currentFile[0]?.fileName ? currentFile[0]?.fileName : "Choose file"} */}
                    </label>
                  </div>
                </div>

              </div>
              <div style={{ paddingLeft: '0px', }} className="col-md-8 p-r-0" >
                <div className="card tab-box">
                  <div className="row user-tabs">
                    <div className="col-lg-12 col-md-12 col-sm-12 line-tabs">
                      <ul className="nav nav-tabs nav-tabs-bottom">
                        <li className="nav-item">
                          <a
                            href="#vendor_other_details"
                            data-toggle="tab"
                            className="nav-link active"
                          // onClick={(e) => setShowTrx(!showTrx)}
                          >
                            Other Details
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            href="#vendor_address"
                            data-toggle="tab"
                            className="nav-link"
                          // className={showTrx ? "nav-link active" : "nav-link" }
                          >
                            Address
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            href="#vendor_con"
                            data-toggle="tab"
                            className="nav-link"
                          // className={showTrx ? "nav-link active" : "nav-link" }
                          >
                            Contact Person
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {/* Other Details  */}
              <div
                style={{ minHeight: '65vh', maxHeight: '65vh', overflowY: 'auto', }}
                className="card p-4 tab-content" >
                <div className="tab-pane fade show active" id="vendor_other_details">

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="col-form-label">
                          PAN
                        </label>
                        <input
                          placeholder="PAN No." maxLength="10" pattern="[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}" title="Please enter valid PAN number. E.g. AAAAA9999A"
                          className="form-control"
                          type="text"
                          name='pan'
                          value={otherDetails.pan}
                          onChange={handleotherDetails}
                          onInput={toInputUppercase}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="col-form-label">
                          GST
                        </label>
                        <input
                          placeholder='GST No.'
                          maxlength="15"
                          pattern='[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}'
                          title='Please enter valid PAN number. E.g. 99AAAFA9999A1Z5'
                          className="form-control"
                          type="text"
                          name='gst'
                          value={otherDetails.gst}
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
                          Opening Balance
                        </label>
                        <input
                          className="form-control"
                          type="number" step={0.01}
                          name='openingBalance'
                          value={otherDetails.openingBalance}
                          onChange={handleotherDetails}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="col-form-label"> Payment Terms</label>
                        <select className="custom-select" name="paymentTerms"
                          value={otherDetails.paymentTerms}
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
                          TDS
                        </label>
                        <select className="custom-select"
                          name="tds"
                          value={otherDetails.tds}
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
                          value={otherDetails.currency}
                          onChange={handleotherDetails}
                          disabled
                        >
                          <option value="INR">INR - Indian Rupee</option>
                        </select>
                      </div>
                    </div>
                  </div>

                </div>
                {/* Address  */}
                <div className="tab-pane fade show" id="vendor_address">
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
                  {/* <div className='row'>
                    <div className="col-md-6"> */}
                  <div className='row'>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="col-form-label">Present Address</label>
                        <textarea
                          className="form-control"
                          cols="10"
                          rows="2"
                          placeholder="House No, Street"
                          name="attention"
                          value={billAddress.attention}
                          onChange={handlebillAddress}
                          onInput={toCapitalize}
                        ></textarea>
                      </div>
                    </div>
                    <div className="col-md-6">
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
                    {/* <div className="col-md-6">
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
                      </div> */}
                  </div>
                  <div className='row'>

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
                        {stateArr.map((a) => (
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
                  {/* <div className="col-md-12">
                        <div className="form-group">
                          <label className="col-form-label">
                            Country
                          </label>
                          <select className="custom-select" 
                            name="country" 
                            value={billAddress.country}
                            onChange={handlebillAddress}
                          disabled>
                              <option value="India">India</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-12">
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
                      </div> */}
                  {/* </div> */}
                  {/* <div className="col-md-6">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label className="col-form-label">
                            Attention
                          </label>
                          <input type="text" id="" className="form-control"
                            name='attention'
                            value={shipAddress.attention}
                            onChange={handleshipAddress}
                            onInput={toCapitalize}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label className="col-form-label">
                            address
                          </label>
                          <textarea className="form-control" cols="10" rows="2"
                            placeholder='House No, Street'
                            name='address'
                            value={shipAddress.address}
                            onChange={handleshipAddress}
                          >
                          </textarea>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label className="col-form-label">
                            City
                          </label>
                          <input type="text" id="" className="form-control"
                            name='city'
                            value={shipAddress.city}
                            onChange={handleshipAddress}
                            onInput={toCapitalize}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label className="col-form-label">
                            State
                          </label>
                          <select className="custom-select" 
                            name='state'
                            value={shipAddress.state}
                            onChange={handleshipAddress}
                          >
                              <option value=""></option>
                          { stateArr.map((a) => (
                              <option value={a}>{a}</option>
                            )) 
                          }
                            </select>
                          
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label className="col-form-label">
                            Pincode
                          </label>
                          <input type="number" maxLength={6} className="form-control"
                            name='pincode'
                            value={shipAddress.pincode}
                            onChange={handleshipAddress}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label className="col-form-label">
                            Country
                          </label>
                          <select className="custom-select" 
                            name="country" 
                            value={shipAddress.country}
                            onChange={handleshipAddress}
                          disabled>
                              <option value="India">India</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label className="col-form-label">
                            Phone
                          </label>
                          <input type="number" maxLength={10} className="form-control"
                            name="phone" 
                            value={shipAddress.phone}
                            onChange={handleshipAddress}
                          />
                        </div>
                      </div>
                    </div> */}
                  {/* </div> */}
                  {/* <Invoices invoice={customer.invoices} /> */}
                </div>
                {/* Person Contact  */}
                <div className="tab-pane fade show" id="vendor_con">

                  <div className="row">
                    <div className="col-md-12 col-sm-12">
                      <div className="table-responsive">
                        <table className="table table-hover table-white">
                          <thead>
                            <tr className="text-center">
                              <th>First Name</th>
                              <th>Last Name</th>
                              <th>Email Address</th>
                              <th>Work phone</th>
                              <th>Mobile</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              personContact.map((p, index) => (
                                <tr className="text-center"
                                  key={index}
                                >
                                  <td>
                                    <input className="form-control" type="text"
                                      name='firstName'
                                      value={p.firstName}
                                      onChange={(e) => handlePersonContact(e, index)}
                                      onInput={toCapitalize}
                                    />
                                  </td>
                                  <td>
                                    <input className="form-control" type="text"
                                      name='lastName'
                                      value={p.lastName}
                                      onChange={(e) => handlePersonContact(e, index)}
                                      onInput={toCapitalize}
                                    />
                                  </td>
                                  <td>
                                    <input className="form-control" type="email"
                                      name='email'
                                      value={p.email}
                                      onChange={(e) => handlePersonContact(e, index)}
                                    />
                                  </td>
                                  <td>
                                    <input className="form-control" type="number" maxLength={10}
                                      name='phone'
                                      value={p.phone}
                                      onChange={(e) => handlePersonContact(e, index)}
                                    />
                                  </td>
                                  <td>
                                    <input className="form-control" type="number" maxLength={10}
                                      name='mobile'
                                      value={p.mobile}
                                      onChange={(e) => handlePersonContact(e, index)}
                                    />
                                  </td>
                                  <td>
                                    {/* {index === 0 ?
                                      <span></span>
                                      : */}

                                    <div className=""
                                      onClick={(e) => removePersonContactField(e, index)}
                                    ><DeleteForeverIcon /></div>
                                    {/* // } */}
                                  </td>
                                </tr>
                              ))
                            }
                          </tbody>
                        </table>
                        <div className="btn btn-primary"
                          onClick={addPersonContactField}
                        >+ Add Contacts</div>
                      </div>
                    </div>
                  </div>
                  {/* <Invoices invoice={customer.invoices} /> */}
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

export default AddVendorModel