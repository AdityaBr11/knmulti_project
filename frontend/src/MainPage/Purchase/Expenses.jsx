import React, { useEffect, useState } from 'react'
import Dropzone from 'react-dropzone';
import { Helmet } from 'react-helmet'
import { useHistory, useLocation } from 'react-router-dom';
import httpService from '../../lib/httpService';

import UploadFileService from './UploadFileService';
import '../../MainPage/index.css';
import { toast } from 'react-toastify';
import moment from 'moment';
import { createNotify } from '../../features/notify/notifySlice';
import { useDispatch, useSelector } from 'react-redux';

const Expenses = () => {

  const history = useHistory();
  const { state } = useLocation();

  const dispatch = useDispatch();
  const empId = useSelector((state) => state?.authentication?.value?.user?._id);

  const [ expenseDate, setExpenseDate ] = useState(moment().format("YYYY-MM-DD"));
  const [ expenseAccount, setExpenseAccount ] = useState("");
  const [ expenseAmount, setExpenseAmount ] = useState("");
  const [ paymentThrough, setPaymentThrough ] = useState("");

  const [ vendors, setVendors ] = useState([]); 
  const [ vendor, setVendor ] = useState(state?.vendorId || undefined);

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
    fetchVendors();
    fetchCustomers();
    fetchProjects();
  }, []);

  useEffect(() => {
    if(state?.edit){
      const { expenseDate, expenseAccount, expenseAmount, paymentThrough, vendorId, invoiceId,
        notes, fileInfos, customerId, isBillable, projectId, markUpBy, } = state?.expenseData;

      setExpenseDate(expenseDate?.split("T")[0]);
      setExpenseAccount(expenseAccount);
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

  useEffect(() => {
    if(state?.convertRecurring){
      const { profileName,
        repeatEvery,
        expenseStartDate,
        expenseEndDate,
        neverExpire,
        expenseAccount,
        expenseAmount,
        paymentThrough,
        vendorId,
        notes,
        customerId,
        isBillable,
        projectId,
        markUpBy,
        status } = state?.recurringExpenseData;

      setExpenseAccount(expenseAccount);
      setExpenseAmount(expenseAmount);
      setPaymentThrough(paymentThrough);
      setVendor(vendorId?._id);
      setNotes(notes);
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
      expenseAccount,
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
      .then((res) => { 
        dispatch(createNotify({
          notifyHead: `Expense ${res?.data?.expenseAccount}`,
          notifyBody: `Expense ${res?.data?.expenseAccount} got Updated of amount ${res?.data?.expenseAmount}`,
          createdBy: empId
        }))
        history.goBack()
      });
    document.querySelectorAll('.close')?.forEach((e) => e.click());
    } else {

      if(selectedFiles){

        let currentFile = selectedFiles[0];
        UploadFileService.upload(currentFile)
          .then((res) => {
            // setFileInfos([ ...fileInfos, res?.data ]);
            return httpService.post(`/vendortrx/createvendorexpense`, { ...expenseData, fileInfos: [ ...fileInfos, res?.data ] })
          })
          .then((res) => { 
            dispatch(createNotify({
              notifyHead: `Expense ${res?.data?.expenseAccount}`,
              notifyBody: `Expense ${res?.data?.expenseAccount} got Created of amount ${res?.data?.expenseAmount}`,
              createdBy: empId
            }))
            history.goBack()
          })
          .catch((err) => {
            console.log(err);
          });

      } else {
        httpService.post(`/vendortrx/createvendorexpense`, { ...expenseData })
          .then((res) => { 
            dispatch(createNotify({
              notifyHead: `Expense ${res?.data?.expenseAccount}`,
              notifyBody: `Expense ${res?.data?.expenseAccount} got Created of amount ${res?.data?.expenseAmount}`,
              createdBy: empId
            }))
            history.goBack()
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }

  }

  return (
    <div className="page-wrapper"> 
      <Helmet>
        <title>Expenses</title>
        <meta name="description" content="vendor bill" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col">
              <h3 className="page-title">Add Expense</h3>
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
                      Expense Account <span className="text-danger">*</span>
                    </label>
                    <select className="custom-select"
                      name="expenseAccount" 
                      value={expenseAccount}
                      onChange={(e) => setExpenseAccount(e.target.value)}
                      required
                    >
                      <option>Choose...</option>
                      <optgroup label='Other Current Asset'>
                        <option value="Advance Tax">Advance Tax</option>
                        <option value="Employee Advance">Employee Advance</option>
                        <option value="Prepaid Expense">Prepaid Expense</option>
                      </optgroup>
                      <optgroup label='Fixed Asset'>
                        <option value="Furniture and Equipment">Furniture and Equipment</option>
                      </optgroup>
                      <optgroup label='Other Current Liability'>
                        <option value="Employee Reimburstment">Employee Reimburstment</option>
                      </optgroup>
                      <optgroup label='Credit Card'>
                      </optgroup>
                      <optgroup label='Long Term Liability'>
                        <option value="Contruction Loans">Contruction Loans</option>
                        <option value="Mortgages">Mortgages</option>
                      </optgroup>
                      <optgroup label='Income'>
                        <option value="Discount">Discount</option>
                        <option value="General Income">General Income</option>
                      </optgroup>
                      <optgroup label='Expense'>
                        <option value="Uncategorized">Uncategorized</option>
                      </optgroup>
                      <optgroup label='Cost of Goods Sold'>
                        <option value="Cost of Goods Sold">Cost of Goods Sold</option>
                        <option value="job Costing">job Costing</option>
                      </optgroup>
                      <optgroup label='Stock'>
                        <option value="Inventory Asset">Inventory Asset</option>
                      </optgroup>
                    </select>
                  </div>
                </div>
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
              </div>
              <div className="row">
                <div className="col-sm-6 col-md-6">
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
              <hr />
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
              <hr />
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

export default Expenses