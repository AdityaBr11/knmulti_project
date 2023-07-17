import React, { useEffect, useState } from 'react'
import Dropzone from 'react-dropzone';
import { Helmet } from 'react-helmet'
import { useHistory, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { allemployee } from '../../lib/api';
import httpService from '../../lib/httpService';
import UploadFileService from './UploadFileService';

import '../../MainPage/index.css';
import moment from 'moment';

const RecordMileage = () => {
  const history = useHistory();
  const { state } = useLocation();

  const [ expenseDate, setExpenseDate ] = useState(moment().format("YYYY-MM-DD"));
  const [ employees, setEmployees ] = useState([]);
  const [ employee, setEmployee ] = useState("");
  const [ mileageCal, setMileageCal ] = useState("Distance travelled");
  const [ odoMeterReading, setOdoMeterReading ] = useState({
    from : 0,
    to: 0
  });
  const [ ratePerKM, setRatePerKM ] = useState(20);
  const [ distance, setDistance ] = useState(0);
  const [ expenseAmount, setExpenseAmount ] = useState("");
  const [ paymentThrough, setPaymentThrough ] = useState("");

  const [ vendors, setVendors ] = useState([]); 
  const [ vendor, setVendor ] = useState(undefined);

  const [ invoiceId, setInvoiceId ] = useState("");
  const [ notes, setNotes ] = useState("");

  const [ selectedFiles, setSelectedFiles ] = useState(undefined);

  const [ fileInfos, setFileInfos ] = useState([]);

  const [ customers, setCustomers ] = useState([]); 
  const [ customer, setCustomer ] = useState(undefined);

  const [ isBillable, setIsBillable ] = useState(false);

  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(undefined);

  const [ markUpBy, setMarkupBy ] = useState(0);

  function onDrop(files) {
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  }

  const calDistancebyOdometer = () => {
    const distanceValue = odoMeterReading.to - odoMeterReading.from;
    setDistance(distanceValue);
  }

  const calexpenseAmount = () => {
    const calAmount = distance * ratePerKM;
    setExpenseAmount(calAmount);
  }

  const fetchemployeeslist = async () => {
    const res = await allemployee();
    setEmployees(res);
  };

  const fetchVendors = async () => {
    const res = await httpService.get('/vendor');
    setVendors(res.data);
  };

  const fetchCustomers = async () => {
    const res = await httpService.get('/customer');
    setCustomers(res.data);
  }

  const fetchProjects = async () => {
    const res = await httpService.get('/project');
    setProjects(res.data);
  };

  useEffect(() => {
    calexpenseAmount();
  });

  useEffect(() => {
    fetchemployeeslist();
    fetchVendors();
    fetchCustomers();
  }, []);

  useEffect(() => {
    if(state?.edit){
      const { expenseDate, employeeId, ratePerKM, distance,
        expenseAmount, paymentThrough, vendorId, invoiceId,
        notes, fileInfos, customerId, isBillable, projectId, markUpBy, } = state?.expenseData;

      setExpenseDate(expenseDate?.split("T")[0]);
      setEmployee(employeeId?._id);
      setRatePerKM(ratePerKM);
      setDistance(distance);
      setExpenseAmount(expenseAmount);
      setPaymentThrough(paymentThrough);
      setVendor(vendorId?._id);
      setInvoiceId(invoiceId);
      setNotes(notes);
      setFileInfos(fileInfos);
      setCustomer(customerId?._id);
      setIsBillable(isBillable);
      setProject(projectId?._id);
      setMarkupBy(markUpBy);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const expenseData = {
      expenseDate,
      employeeId: employee,
      expenseAccount: "Fuel/Mileage Expenses",
      ratePerKM,
      distance,
      expenseAmount,
      paymentThrough,
      vendorId: vendor,
      invoiceId,
      notes,
      fileInfos,
      customerId: customer,
      isBillable,
      projectId: project,
      markUpBy,
      status: isBillable ? "UNBILLED" : "NON-BILLABLE"
    }

    if(state?.edit){
      toast
      .promise(
        httpService.put(`/vendortrx/updatevendorexpense/${state?.expenseData?._id}`, expenseData),
        {
          error: 'Failed to fetch vendor bills',
          success: 'Bills fetch successfully',
          pending: 'fetching vendor bill...',
        }
      )
      .then((res) => history.goBack());
    document.querySelectorAll('.close')?.forEach((e) => e.click());
    } else {

      if(selectedFiles){

        let currentFile = selectedFiles[0];
        UploadFileService.upload(currentFile)
          .then((res) => {
            // setFileInfos([ ...fileInfos, res?.data ]);
            return httpService.post(`/vendortrx/createvendorexpense`, { ...expenseData, fileInfos: [ ...fileInfos, res?.data ] })
          })
          .then((res) => history.goBack())
          .catch((err) => {
            console.log(err);
          });

      } else {
        console.log({expenseData});
        httpService.post(`/vendortrx/createvendorexpense`, { ...expenseData })
          .then((res) => history.goBack())
          .catch((err) => {
            console.log(err);
          });
      }
    }


  }

  return (
    <div className="page-wrapper"> 
      <Helmet>
        <title>Record Mileage</title>
        <meta name="description" content="Record Mileage" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col">
              <h3 className="page-title">Record Mileage</h3>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <form onSubmit={handleSubmit}> 
              <div className="row">
                <div className="col-sm-6 col-md-3">
                    <div className="form-group">
                      <label>
                        Date <span className="text-danger">*</span>
                      </label>
                      <input type="date" 
                      name="expenseDate" 
                      value={expenseDate}
                      onChange={(e) => setExpenseDate(e.target.value)}
                      className='form-control' required/>
                    </div>
                </div>
                <div className="col-sm-6 col-md-4">
                  <div className="form-group">
                    <label>
                      Employee <span className="text-danger">*</span>
                    </label>
                    <select
                      className="custom-select"
                      value={employee}
                      onChange={(e) => setEmployee(e.target.value)} 
                      >
                      <option selected>Please Select</option>
                      {employees.map((employee) => (
                        <option key={employee._id} value={employee._id}>
                          {employee?.firstName + ' ' + employee?.lastName}
                        </option>
                      ))}
                  </select>
                  </div>
                </div>
                
              </div>
              <div className="row">
                <div className="col-sm-6 col-md-3">
                  <div className="form-group">
                    <label>
                      Calculate mileage using <span className="text-danger">*</span>
                    </label>
                    <div>
                      <input type="radio" 
                      value="Distance travelled"
                      checked={mileageCal === "Distance travelled"}
                      onChange={e => setMileageCal(e.target.value)}
                      
                      /> Distance travelled <br />
                      <input type="radio" 
                      value="Odometer reading"
                      onChange={e => {setMileageCal(e.target.value);
                        calDistancebyOdometer();
                      }}
                      checked={mileageCal === "Odometer reading"}
                       /> Odometer reading
                    </div>
                  </div>
                </div>
              </div>
              { mileageCal === "Odometer reading" && 
                <div className="row">
                  <div className="col-sm-6 col-md-6">
                    <div className="form-group">
                      <label>
                        Odometer reading
                      </label>
                      <div className="d-flex align-item-center">
                        <input type="number" name="odoMeterReading" 
                          value={odoMeterReading?.from}
                          onChange={e => setOdoMeterReading({ ...odoMeterReading, from: e.target.value })}
                        className="form-control" /> 
                        <span className='m-3'>To</span>
                        <input type="number" name="ratePerKM" 
                          value={odoMeterReading?.to}
                          min={odoMeterReading?.from}
                          onChange={e => setOdoMeterReading({ ...odoMeterReading, to: e.target.value })}
                          onBlur={() => calDistancebyOdometer()}
                        className="form-control" />
                      </div>
                    </div>
                  </div>
                </div>
              }
              <div className="row">
                <div className="col-sm-6 col-md-3">
                  <div className="form-group">
                    <label>
                      Rate per KM
                    </label>
                    <input type="number" name="ratePerKM" 
                      value={ratePerKM}
                      onChange={e => setRatePerKM(e.target.value)}
                    className="form-control"
                    />
                  </div>
                </div>
                <div className="col-sm-6 col-md-3">
                  <div className="form-group">
                    <label>
                      Distance (in KM)
                    </label>
                    <input type="number" name="distance" 
                      value={distance}
                      onChange={e => setDistance(e.target.value)}
                    className="form-control"
                    disabled={mileageCal === "Odometer reading"}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
              <div className="col-sm-6 col-md-3">
                  <div className="form-group">
                    <label>
                      Amount <span className="text-danger">*</span>
                    </label>
                    <input type="number" 
                      name="expenseAmount" 
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                    className='form-control' required/>
                  </div>
                </div>
                <div className="col-sm-6 col-md-3">
                  <div className="form-group">
                    <label>
                      Paid Through <span className="text-danger">*</span>
                    </label>
                    <select className="custom-select" 
                      name="paymentThrough" 
                      value={paymentThrough}
                      onChange={(e) => setPaymentThrough(e.target.value)}
                      required
                      >
                        <option></option>
                        <optgroup label='cash'>
                          <option value="Petty Cash">Petty Cash</option>
                          <option value="Undeposited Fund">Undeposited Fund</option>
                        </optgroup>
                        <optgroup label='Other Current Liability'>
                          <option value="Employee Reimburstment">Employee Reimburstment</option>
                        </optgroup>
                        <optgroup label='Credit Card'>
                        </optgroup>
                        <optgroup label='Equity'>
                          <option value="Capital Stock">Capital Stock</option>
                          <option value="Distribution">Distribution</option>
                        </optgroup>
                        <optgroup label='Other Current Asset'>
                          <option value="Furniture and Equipment">Furniture and Equipment</option>
                        </optgroup>
                    </select>
                  </div>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-6 col-md-6">
                  <div className="form-group">
                    <label>
                      Vendor
                    </label>
                    <select
                      className="custom-select"
                      value={vendor}
                      onChange={(e) => setVendor(e.target.value)} 
                      >
                      <option selected>Please Select</option>
                      {vendors.map((vendor) => (
                        <option key={vendor._id} value={vendor._id}>
                          {vendor.name}
                        </option>
                      ))}
                  </select>
                  </div>
                  <div className="form-group">
                    <label>
                      Reference#
                    </label>
                    <input type="text" 
                    name="invoiceId" 
                    value={invoiceId}
                    onChange={(e) => setInvoiceId(e.target.value)}
                    className='form-control' />
                  </div>
                  <div className="form-group">
                    <label>
                      Notes
                    </label>
                    <textarea 
                    name="notes" 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    cols="30" rows="5" className='form-control'></textarea>
                  </div>
                </div>
                { !state?.edit && 
                <div className="col-sm-6 col-md-6">
                  {/* <UploadFileComponent handleFileInfos={setFileInfos} /> */}
                  <Dropzone onDrop={onDrop} multiple={false}>
                    {({ getRootProps, getInputProps }) => (
                      <section>
                        <div {...getRootProps({ className: "dropzone" })}>
                          <input {...getInputProps()} />
                          {selectedFiles && selectedFiles[0].name ? (
                            <div className="selected-file">
                              {selectedFiles && selectedFiles[0].name}
                            </div>
                          ) : (
                            "Drag and drop file here, or click to select file"
                          )}
                        </div>
                        {/* <aside className="selected-file-wrapper">
                          <button
                            className="btn btn-success"
                            disabled={!selectedFiles}
                            onClick={upload}
                          >
                            Upload
                          </button>
                        </aside> */}
                      </section>
                    )}
                  </Dropzone>
                </div>
                }
              </div>
              <div className="row">
                <div className="col-sm-6 col-md-6">
                  <div className="form-group">
                    <label>
                      Customer Name
                    </label>
                    <select
                      className="custom-select"
                        value={customer}
                        onChange={(e) => setCustomer(e.target.value)}
                        onBlur={fetchProjects}
                      >
                      <option value={""} selected>Please Select</option>
                      {customers.map((customer) => (
                        <option key={customer?._id} value={customer?._id}>
                          {customer?.displayName}
                        </option>
                      ))}
                  </select>
                  </div>
                </div>
                {
                  customer && 
                  <div className="col-sm-3 col-md-3 d-flex align-items-center">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="" onChange={(e) => setIsBillable(!isBillable)} checked={isBillable}
                      />
                      <label class="form-check-label" >
                          Billable
                      </label>
                    </div>
                  </div>
                }
                
              </div>
              <div className="row">
                { customer && 
                  <div className="col-sm-6 col-md-6">
                  <div className="form-group">
                    <label>
                      Project
                    </label>
                    <select
                      className="custom-select"
                        value={project}
                        onChange={(e) => setProject(e.target.value)}
                      >
                      <option value={""} selected>Please Select</option> 
                     {projects?.map((project) => (
                      <option key={project?._id} value={project?._id}>{project?.name}</option>
                    ))}
                  </select>
                  </div>
                </div>
                }
              </div>
              <div className="row">
                { isBillable && 
                  <div className="col-sm-6 col-md-6">
                    <div className="form-group">
                      <label>
                        Mark up by (in %)
                      </label>
                      <input type="number" 
                      name="markUpBy" 
                      value={markUpBy}
                      onChange={(e) => setMarkupBy(e.target.value)}
                      className='form-control' />
                    </div>
                  </div>
                }
              </div>
              <hr />
              <div className='row'>
                <button className="btn btn-primary mr-2" type="submit">
                  Save
                </button>
                <div className="btn btn-outline-secondary" onClick={() => history.goBack()}>
                  Cancel
                </div>
            </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecordMileage