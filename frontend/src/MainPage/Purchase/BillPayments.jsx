import { Table } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createNotify } from '../../features/notify/notifySlice';
import httpService from '../../lib/httpService';
import { itemRender, onShowSizeChange } from '../paginationfunction';

const BillPayments = () => {

  const history = useHistory();
  const location = useLocation();

  const dispatch = useDispatch();
  const empId = useSelector((state) => state?.authentication?.value?.user?._id);

  const [ vendors, setVendors ] = useState([]);

  const [ vendor, setVendor ] = useState(location?.state?.vendorId || "");

  const [ vendorBill, setVendorBill ] = useState([]);

  const [ paymentNo, setPaymentNo ] = useState(`PYM-${Math.ceil(Math.random()*100000)}`);
  const [ paymentMade, setPaymentMade ] = useState(0);
  const [ paymentDate, setPaymentDate ] = useState(moment().format("YYYY-MM-DD"));
  const [ paymentMode, setPaymentMode ] = useState("");
  const [ paymentThrough, setPaymentThrough ] = useState("");
  const [ referenceId, setReferenceId ] = useState(`RTX-${Math.ceil(Math.random()*100000)}`);

  const [ amountPaid, setAmountPaid ] = useState(0);
  const [ totalPaymentAmount, setTotalPaymentAmount ] = useState(0);
  const [ amountRefunded, setAmountRefunded ] = useState(0);
  const [ amountExcess, setAmountExcess ] = useState(0);
  const [ notes, setNotes ] = useState("");
  const [ modeCustom, setmodeCustom ] = useState(false);
  const [ custom, setCustom ] = useState(false);

  const fetchVendors = async () => {
    const res = await httpService.get('/vendor');
    setVendors(res.data);
  };

  const fetchVendorBill = async() => {
    if(vendor){

      const { data } = await httpService.get(`/vendortrx/getvendorbills?vendorId=${vendor}`);
  
      let vendorBillData = await data.map((vb) => { 
          const { _id, billNo, dueDate, billDate, total, balanceDue } = vb;
          const dvb = { _id, billNo, dueDate, billDate, total, balanceDue, billPaymentDate:"", billPaymentAmount: 0, purchaseOrder: "" };
          return dvb; 
      });
  
      let updatedVendorBillData = vendorBillData.filter(vb => vb.balanceDue !== 0);
  
      if(location?.state?.billId){
        updatedVendorBillData = updatedVendorBillData.filter(vb => vb._id === location?.state?.billId);
      }
      
      setVendorBill([ ...updatedVendorBillData ]);
    }
  }

  const handleVendorBill = (e, vBId) => {
    let date = new Date();
    date = date.toISOString()
    
    const updatedVendorBill = vendorBill.map((b) => vBId == b._id ? Object.assign(b, {[e.target.name]: e.target.value, billPaymentDate: date }) : b);
    setVendorBill(updatedVendorBill);
  }

  const handlePayData = () => {
    const totalVendorBillPay = vendorBill.reduce((acc, curr) => { acc = acc + (+ curr.billPaymentAmount); return acc;}, 0)
    setTotalPaymentAmount(totalVendorBillPay);
    setAmountExcess(amountPaid - totalVendorBillPay);
  }

  // const handleAmountDueOnEdit = () => {
  //   if(location?.state?.edit){
  //     console.log(vendorBill)
  //     let vendorBillData = vendorBill.map((vb) => {
  //       console.log({vb})
  //       let dvb = { ...vb, balanceDue : balanceDue + billPaymentAmount };
  //       console.log({dvb})
  //       return dvb;
  //     });

  //     setVendorBill([ ...vendorBillData ]);
  //   }
  // }

  

  useEffect(() => {
    if(location?.state?.edit){
      const { 
        vendorId,
        paymentNo,
        paymentMade,
        paymentDate,
        paymentMode,
        paymentThrough,
        referenceId,
        vendorBill,
        amountPaid,
        totalPaymentAmount,
        amountRefunded,
        amountExcess,
        notes
       } = location?.state?.payInfo;

       setVendor(vendorId?._id);
       setPaymentMade(paymentMade);
       setPaymentDate(paymentDate?.split("T")[0]);
       setPaymentMode(paymentMode);
       setPaymentThrough(paymentThrough);
       setReferenceId(referenceId);
       setVendorBill([ ...vendorBill ]);
       setAmountPaid(amountPaid);
       setNotes(notes);
       
    }

  }, []);

  useEffect(() => {
    fetchVendors();
    fetchVendorBill();
  }, []);

  useEffect(() => {
    handlePayData();
  });

  // console.log(vendorBill);

  const postBillPayment = () => {
    let updatedVendorBill = vendorBill.filter(vb => (vb?.billPaymentAmount != 0) || (vb?.billPaymentAmount != '') )
    const billPayments = {
      vendorId : vendor,
      paymentNo,
      paymentMade,
      paymentDate,
      paymentMode,
      paymentThrough,
      referenceId,
      vendorBill: updatedVendorBill,
      amountPaid,
      totalPaymentAmount,
      amountRefunded,
      amountExcess,
      notes
    }
    // console.log(billPayments);

    if(location?.state?.edit){
      toast
        .promise(
          httpService.put(`/vendortrx/updatevendorbillpayment/${location?.state?.payInfo?._id}`, { ...billPayments, paymentNo : location?.state?.payInfo?.paymentNo}),
          {
            error: 'Failed to update vendor bills payment',
            success: 'Bills Payment update successfully',
            pending: 'updating vendor bill payment...',
          }
        )
        .then((res) => { 
            dispatch(createNotify({
              notifyHead: `Bills Payment ${res?.data?.paymentNo}`,
              notifyBody: `Bills Payment ${res?.data?.paymentNo} got Updated`,
              createdBy: empId
            }))
            history.goBack()
          });
      document.querySelectorAll('.close')?.forEach((e) => e.click());
    }else{
      toast
        .promise(
          httpService.post(`/vendortrx/createvendorbillpayment`, billPayments),
          {
            error: 'Failed to make vendor bills payment',
            success: 'Bills Payment successfully',
            pending: 'processing vendor bill payment...',
          }
        )
        .then((res) => { 
            dispatch(createNotify({
              notifyHead: `Bills Payment ${res?.data?.paymentNo}`,
              notifyBody: `Bills Payment ${res?.data?.paymentNo} got Created`,
              createdBy: empId
            }))
            history.goBack()
          });
      document.querySelectorAll('.close')?.forEach((e) => e.click());
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let date = new Date();
    date = date.toISOString();
    if (vendor == undefined || vendor == '') {
      toast.error('Please Select vendor Name');
      return;
    }

    const updatedVendorBill = vendorBill.map((b) =>  {
      if(b.billPaymentAmount > 0){
        const dueBalance = b.balanceDue - b.billPaymentAmount;
        return Object.assign(b, {balanceDue: dueBalance, billPaymentDate: date });
      }
      return b;
    });

    setVendorBill([ ...updatedVendorBill ]);

    postBillPayment();
  }

  const columns = [
    {
      title: 'Date',
      dataIndex: 'billDate',
      render: (billDate) => <span>{billDate?.split("T")[0]}</span>
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      render: (dueDate) => <span>{dueDate?.split("T")[0]}</span>
    },
    {
      title: 'Bill#',
      dataIndex: 'billNo',
    },
    // {
    //   title: 'Purchase Orders',
    //   dataIndex: 'purchaseOrder',
    // },
    {
      title: 'Bill Amount',
      dataIndex: 'total',
    },
    {
      title: 'Amount Due',
      dataIndex: 'balanceDue',
      // render: (text, record) => <span>{location?.state?.edit ? text + record?.billPaymentAmount : text}</span>
    },
    {
      title: 'Payment',
      dataIndex: 'billPaymentAmount',
      render: (text, record) => <input name='billPaymentAmount' type="number"
        min={0}
        max={record?.balanceDue}
        value={text}
        onChange={(e) => handleVendorBill(e, record?._id)}
      className="form-control text-right" />
    },
  ]


  return (
    <div className="page-wrapper"> 
      <Helmet>
        <title>All Vendors Bills</title>
        <meta name="description" content="vendor bill" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col">
              <h3 className="page-title">Bill Payments</h3>
            </div>
          </div>
        </div>
        <div className="row">
        <div className="col-sm-12">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-sm-6 col-md-6">
                <div className="form-group">
                  <label>
                    Vendor Name <span className="text-danger">*</span>
                  </label>
                  <select
                    className="custom-select"
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    onBlur={fetchVendorBill}
                    required
                  >
                    <option selected>Please Select</option>
                    {vendors.map((vendor) => (
                      <option key={vendor._id} value={vendor._id}>
                        {vendor.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-sm-6 col-md-6">
                <div className="form-group">
                  <label>
                    Payment No <span className="text-danger">*</span>
                  </label>
                  <input type="string" name="paymentNo" className="form-control"
                  value={paymentNo}
                  onChange={(e) => setPaymentNo(e.target.value)}
                  // onBlur={() => setAmountPaid(paymentNo)}
                  disabled
                  required/>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6 col-md-6">
                <div className="form-group">
                  <label>
                    Payment Made <span className="text-danger">*</span>
                  </label>
                  <input type="number" name="paymentMade" className="form-control"
                  value={paymentMade}
                  onChange={(e) => setPaymentMade(e.target.value)}
                  onBlur={() => setAmountPaid(paymentMade)}
                  required/>
                </div>
              </div>
              <div className="col-sm-6 col-md-3">
                  <div className="form-group">
                    <label>
                      Payment date <span className="text-danger">*</span>
                    </label>
                    <div>
                      <input className="form-control" type="date" name="paymentDate"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      required />
                    </div>
                  </div>
              </div>
              <div className="col-sm-6 col-md-3">
                <div className="form-group">
                  <label>
                    Reference#
                  </label>
                  <input type="text" name="referenceId" id="" className="form-control"
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {/* setmodeCustom */}
            <div className="row">
              <div className="col-sm-6 col-md-4">
                <div className="form-group">
                  <label>
                    Payment Mode <span className="text-danger">*</span>
                  </label>
                  <select className="custom-select" 
                    name="paymentMode"
                    // value={paymentMode}
                    // onChange={(e) => setPaymentMode(e.target.value)}
                    onChange={(e) => {
                      if(e.target.value === 'custom') {
                        setmodeCustom(true);
                        setPaymentMode("")
                      } else{
                        setmodeCustom(false);
                        setPaymentMode(e.target.value)
                      }
                    }}
                    required
                    >
                    <option value="">Please Select</option>
                    <option value="Bank Remittance">Bank Remittance</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Check">Check</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                </div>
                {modeCustom === true && (
                  <div className="col-sm-3 form-group">
                    <label>Custom Payment Mode <span className="text-danger">*</span></label>
                    <input
                      name="paymentMode" 
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      className="form-control"
                      type="text"
                      required
                    />
                  </div>
                )}
            </div>
            <div className="row">
              <div className="col-sm-6 col-md-4">
                <div className="form-group">
                  <label>
                    Payment Through <span className="text-danger">*</span>
                  </label>
                  <select className="custom-select" 
                    name="paymentThrough" 
                    // value={paymentThrough}
                    // onChange={(e) => setPaymentThrough(e.target.value)}
                    onChange={(e) => {
                      if(e.target.value === 'custom') {
                        setCustom(true);
                        setPaymentThrough("")
                      } else{
                        setCustom(false);
                        setPaymentThrough(e.target.value)
                      }
                    }}
                    >
                    <option value="">Please Select</option>
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
                    <option value="custom">Custom</option>
                  </select>
                </div>
                </div>
                {custom === true && (
                  <div className="col-md-3 form-group">
                    <label>Custom Payment Through <span className="text-danger">*</span></label>
                    <input
                      name="paymentThrough" 
                      value={paymentThrough}
                      onChange={(e) => setPaymentThrough(e.target.value)}
                      className="form-control"
                      type="text"
                      required
                    />
                  </div>
                )}
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="table-responsive">
                  <Table
                    className="table-striped"
                    pagination={{
                      total: vendorBill?.length,
                      showTotal: (total, range) =>
                        `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                      showSizeChanger: true,
                      onShowSizeChange: onShowSizeChange,
                      itemRender: itemRender,
                    }}
                    style={{ overflowX: 'auto' }}
                    columns={columns}
                    // bordered
                    dataSource={vendorBill}
                    rowKey={(record) => record?._id}
                  />
                </div>
              </div>
            </div>
            <div className='row d-flex justify-content-end m-3'>
            <div className='text-right p-3 pl-5 border border-warning d-flex flex-column'>
              <div>Amount Paid: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {amountPaid}</div> <br />
              <div>Amount used for Payments: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {totalPaymentAmount}</div> <br />
              <div>Amount Refunded: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {amountRefunded}</div> <br />
              <div>Amount in Excess: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {amountExcess}</div> <br />
            </div>
            </div>
            <br />
            <div className="row d-flex justify-content-start">
              <div className='ml-5'>
                <label htmlFor="">Notes</label>
                <textarea name="notes" id="" cols="140" rows="4" className="form-control"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>
            </div>
            <br />
            <div className='row'>
              <button className="btn btn-primary mr-2" type="submit" 
                // disabled={amountExcess != 0}
                >
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

export default BillPayments