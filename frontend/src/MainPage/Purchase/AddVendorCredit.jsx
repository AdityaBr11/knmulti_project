import { Add, DeleteOutline } from '@mui/icons-material';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import httpService from '../../lib/httpService';
import { createNotify } from '../../features/notify/notifySlice';

const Credit = () => {
  const history = useHistory();

  const {state} = useLocation();

  const dispatch = useDispatch();

  const empId = useSelector((state) => state?.authentication?.value?.user?._id);

  const [ vendors, setVendors ] = useState([]);
  const [ vendor, setVendor ] = useState(state?.vendorId || "");

  const [ creditOrder, setcreditOrder ] = useState(`CN-${Math.ceil(Math.random()*100000)}`);
  const [ orderNo, setorderNo ] = useState(`OD-${Math.ceil(Math.random()*100000)}`);
  const [ vendorCreditDate, setvendorCreditDate ] = useState(moment().format("YYYY-MM-DD"));

  const transactionTemplate = {
    itemDetails: "",
    account: "",
    quantity: 0,
    unit: "pcs.",
    rate: 0,
    amount: 0
  };
  const [ transaction, settransaction ] = useState([transactionTemplate]);

  const handleSingleTrxAmount = (e, index) => {
    let updatedAmount = transaction[index].quantity * transaction[index].rate;

    const updatedTrx = transaction.map((trx, i) => index == i ? Object.assign(trx, {amount: updatedAmount }) : trx);
    settransaction(updatedTrx);
  }

  const [ subTotal, setSubTotal ] = useState(subTotal || 0);
  const [ discount, setDiscount ] = useState({
    discountType: "percent",
    discountValue: 0
  }); 

  const [ adjustment, setAdjustment ] = useState({
    adjustmentName: "Adjustment",
    adjustmentValue: 0
  });


  const [ discountAmount, setDiscountAmount ] = useState(0);

  const [ total, setTotal ] = useState(0);

  const [ notes, setNotes ] = useState(""); 

  const handletransaction = (e, index) => {
    const updatedTrx = transaction.map((trx, i) => index == i ? Object.assign(trx, {[e.target.name]: e.target.value }) : trx);
    settransaction(updatedTrx);
  }

  const addtransactionField = () => {
    settransaction([...transaction, transactionTemplate]);
  }

  const removetransactionField = (e, index) => {
    if(index !== 0){
      const updatedtransaction = transaction.filter((trx, i) => index !== i );
      settransaction(updatedtransaction);
    }
    
  }

  const handleSubTotal = () => {
    let finalSubTotal = transaction.reduce((acc, curr) => {
        acc = acc + curr.amount;
        
        return acc;
      }, 0);
    setSubTotal(finalSubTotal);
    handleGrandTotal();
  }

  let handleTrxDiscountValue = () => {
    let updatedDiscount
    if(discount.discountType === "percent"){
      
      updatedDiscount = subTotal * (discount.discountValue/100);
      
    } else if(discount.discountType === "INR") {
      updatedDiscount = discount.discountValue;
    }
    setDiscountAmount((prev) => updatedDiscount);
    handleGrandTotal();
  }


  const handleGrandTotal = () => {
    let grandTotal = subTotal - discountAmount + Number(adjustment.adjustmentValue);
    setTotal(grandTotal);
  }

  const fetchVendors = async () => {
    const res = await httpService.get(`/vendor`);
    // const res = await httpService.get(`/vendor?vendorType=${"supplier"}`);
    setVendors(res.data);
  };


  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    if(state?.edit){
       const {
        vendorId,
        creditOrder,
        orderNo,
        vendorCreditDate,
        transaction,
        subTotal,
        discount,
        discountAccount,
        discountAmount,
        adjustment,
        total,
        balance,
        notes,
        status
      } = state?.creditData;
      setVendor(vendorId?._id);
      setcreditOrder(creditOrder);
      setorderNo(orderNo);
      setvendorCreditDate(vendorCreditDate?.split("T")[0]);
      settransaction(transaction);
      setSubTotal(subTotal);
      setDiscount(discount);
      setDiscountAmount(discountAmount);
      setAdjustment(adjustment);
      setTotal(total);
      setNotes(notes);
    }
  }, []);

  useEffect(() => {
    handleTrxDiscountValue();
  }, [subTotal, discount]);


  useEffect(() => {
    handleGrandTotal()
  }, [subTotal, discount]);


  useEffect(() => {
    handleSubTotal();
    handleGrandTotal();
  });

  const handleSubmit = (e) => {

    e.preventDefault();
    if( !vendor ){
      toast.error("Select Vendor name");
      return;
    }

    if(!transaction[0].itemDetails){
      return;
    }
    
    const vendorCreditData = {
      vendorId: vendor,
      creditOrder,
      orderNo,
      vendorCreditDate,
      transaction,
      subTotal,
      discount,
      discountAccount: "",
      discountAmount,
      adjustment,
      total,
      balance: total,
      notes,
      status: "OPEN"
    }
    console.log(vendorCreditData);

    if(state?.edit){

      toast
        .promise(
          httpService.put(`/vendortrx/updatevendorcredit/${state?.creditData?._id}`, { ...vendorCreditData, balance: state?.creditData?.balance, status: state?.creditData?.status}),
          {
            error: 'Failed to update vendor credit',
            success: 'vendor credit updated successfully',
            pending: 'Updating vendor vendor credit...',
          }
        )
        .then((res) => { 
            dispatch(createNotify({
              notifyHead: `Vendor Credit ${res?.data?.creditOrder}`,
              notifyBody: `Vendor Credit ${res?.data?.creditOrder} got Updated`,
              createdBy: empId
            }))
            history.goBack()
          });
      document.querySelectorAll('.close')?.forEach((e) => e.click());
      
    } else {

      toast
        .promise(
          httpService.post(`/vendortrx/createvendorcredit`, vendorCreditData),
          {
            error: 'Failed to create vendor credit',
            success: 'vendor credit created successfully',
            pending: 'Building vendor vendor credit...',
          }
        )
        .then((res) => { 
            dispatch(createNotify({
              notifyHead: `Vendor Credit ${res?.data?.creditOrder}`,
              notifyBody: `Vendor Credit ${res?.data?.creditOrder} got Created`,
              createdBy: empId
            }))
            history.goBack()
          });
      document.querySelectorAll('.close')?.forEach((e) => e.click());
      
    }

    // toast
    //   .promise(
    //     httpService.post(`/vendortrx/createvendorcredit`, vendorCreditData),
    //     {
    //       error: 'Failed to create vendor credit',
    //       success: 'vendor credit created successfully',
    //       pending: 'Building vendor vendor credit...',
    //     }
    //   )
    //   .then((res) => history.goBack());
    // document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

  return (
    <div className="page-wrapper"> 
      <Helmet>
        <title>Add Vendor Credit</title>
        <meta name="description" content="Add Vendor Credit" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col">
              <h3 className="page-title">New Vendor Credit</h3>
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
              </div>
              
              <div className="row">
                <div className="col-sm-6 col-md-6">
                  <div className="form-group">
                    <label>
                      Credit Note# <span className="text-danger">*</span>
                    </label>
                    <input type="text" 
                    name="creditOrder" 
                    value={creditOrder}
                    onChange={(e) => setcreditOrder(e.target.value)}
                    className='form-control' />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6 col-md-6">
                  <div className="form-group">
                    <label>
                      Order Number#
                    </label>
                    <input type="text" 
                    name="orderNo" 
                    value={orderNo}
                    onChange={(e) => setorderNo(e.target.value)}
                    className='form-control' />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6 col-md-3">
                  <div className="form-group">
                    <label>
                      Date
                    </label>
                    <input type="date" 
                    name="vendorCreditDate" 
                    value={vendorCreditDate}
                    onChange={(e) => setvendorCreditDate(e.target.value)}
                    className='form-control' required/>
                  </div>
                </div>
              </div> 
              <div className="row">
                <div className="col-md-12 col-sm-12">
                  <div className="table-responsive">
                    <table className="table table-hover table-white">
                      <thead>
                        <tr className='text-center'>
                          <th style={{ minWidth: '250px' }}>ITEM DETAILS</th>
                          <th style={{ minWidth: '150px' }}>ACCOUNT</th>
                          <th style={{ minWidth: '50px' }}>QUANTITY</th>
                          <th style={{ minWidth: '50px' }}>UNIT</th>
                          <th style={{ width: '150px' }}>RATE</th> 
                          <th style={{ width: '150px' }}>AMOUNT</th>
                          <th style={{ width: '50px' }}>DELETE</th>
                        </tr>
                      </thead>
                      <tbody>
                        { transaction.map((trx, index) => (

                          <tr>
                            <td>
                              <input 
                                className="form-control"
                                type="text"
                                style={{ minWidth: '150px' }}
                                name='itemDetails'
                                required
                                value={trx.itemDetails}
                                onChange={(e) => handletransaction(e, index)}
                              />
                            </td>
                            <td>
                              <select name="account" id="" className="custom-select"
                                value={trx.account} 
                                onChange={(e) => handletransaction(e, index)}
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
                            </td>
                            <td>
                              <input
                                className="form-control"
                                // style={{ width: '100px' }}
                                type="number"
                                name='quantity'
                                value={trx.quantity}
                                onChange={(e) => {handletransaction(e, index);
                                  handleSingleTrxAmount(e, index);
                                }}
                                onBlur={handleSubTotal}
                              />
                            </td>
                            <td>
                              <select className="custom-select" style={{ width: '100px' }}
                                  name="unit"
                                  value={trx?.unit}
                                  onChange={(e) => {handletransaction(e, index);}}
                                >
                                  { [ "pcs.", "ton", "kg", "g", "mg", "ltr.", "ml" ].map((u, i) => (
                                    <option key={i} value={u}>{u}</option>

                                  )) }
                                </select>
                            </td>
                            <td>
                              <input
                                className="form-control"
                                style={{ width: '160px' }}
                                type="number"
                                name='rate'
                                value={trx.rate}
                                onChange={(e) => { handletransaction(e, index); 
                                  handleSingleTrxAmount(e, index);
                                }}
                                onBlur={handleSubTotal}
                              />
                            </td> 
                            <td>
                              <input type="number" className="form-control"
                              style={{ width: '160px' }}
                                name='amount'
                                value={trx.amount}
                                onChange={(e) => handletransaction(e, index)}
                                disabled
                              />
                            </td>
                            <td className='text-center'>
                              { index !== 0 && 
                                <DeleteOutline onClick={(e) => removetransactionField(e, index)} />
                              }
                            </td>
                          </tr>
                          )) }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <br />
              <div className="row">
                <div className="ml-3 btn btn-primary" onClick={addtransactionField}><Add /> Add another Line</div>
              </div>
              <br />
              <div className="table-responsive">
                <table className="table table-hover table-white">
                  <tbody>
                    <tr>
                      <td />
                      <td />
                      <td />
                      <td />
                      <td className="text-right">Sub Total</td>
                      <td
                        style={{
                          textAlign: 'right',
                          paddingRight: '30px',
                          width: '230px',
                        }}
                      >
                        <input
                          type="number"
                          className="form-control text-right"
                          value={subTotal}
                          disabled
                        />
                        {/* {subTotal} | {subTotal} */}
                        {/* {itemsToAdd.reduce((p, c) => p + c.amount, 0)} */}
                      </td>
                    </tr>
                   
                    <tr>
                        <td colSpan={4} className="text-right">
                        Discount
                      </td>
                        <td className='d-flex align-items-center'>
                          <input
                            className="form-control flex-2"
                            style={{ width: '80px' }}
                            type="number"
                            name='discountValue'
                            value={discount.discountValue}
                            onChange={(e) => {setDiscount({ ...discount, discountValue : e.target.value }); 
                            }}
                            onBlur={handleTrxDiscountValue}
                          />
                          <select className="custom-select" style={{ width: '60px' }}
                            name='discountType'
                            value={discount.discountType}
                            onChange={(e) => { setDiscount({ ...discount, discountType : e.target.value }); 
                            }}
                            onBlur={handleTrxDiscountValue}
                          >
                            <option value="percent">%</option>
                            <option value="INR">&#x20B9;</option>
                          </select>
                        </td>
                        <td
                        style={{
                          textAlign: 'right',
                          paddingRight: '30px',
                          width: '230px',
                        }}
                      >
                        <input
                          className="form-control text-right"
                          type="number"
                          value={discountAmount}
                          disabled
                        />
                      </td>
                    </tr> 
                      <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>
                        <input type="text" className="form-control" name='adjustmentName' value={adjustment.adjustmentName}
                          onChange={(e) => setAdjustment({ ...adjustment, adjustmentName : e.target.value })}
                        />
                      </td>
                      <td>
                        <input type="number" className="form-control text-right"
                          name='adjustmentValue' value={adjustment.adjustmentValue}
                          onChange={(e) => setAdjustment({ ...adjustment, adjustmentValue : e.target.value })}
                        />
                      </td>
                      <td style={{ paddingRight: '30px', }}>
                        <input type="number" className="form-control text-right" value={adjustment.adjustmentValue} disabled/>
                      </td>
                    </tr> 
                    <tr>
                      <td
                        colSpan={5}
                        style={{ textAlign: 'right', fontWeight: 'bold' }}
                      >
                        Grand Total
                      </td>
                      <td
                        style={{
                          textAlign: 'right',
                          paddingRight: '30px',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          width: '230px',
                        }}
                      >
                        ₹ {total}
                        {/* {itemsToAdd.reduce((p, c) => p + c.amount, 0)} */}
                      </td>
                    </tr>
                    
                  </tbody>
                </table>
              </div>
              <div className="row d-flex justify-content-start">
                <div className='ml-5'>
                  <label htmlFor="">Notes</label>
                  <textarea name="notes" id="" cols="60" rows="2" className="form-control"
                    value={notes} onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <br />
              
              <div className="row">
                <button className="btn btn-primary mr-2" type="submit">
                  Save as Open
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

export default Credit