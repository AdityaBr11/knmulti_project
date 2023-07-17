import { Add, DeleteOutline } from '@mui/icons-material';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useParams } from 'react-router-dom';
import httpService from '../../../../lib/httpService';

const DummyVBill = () => {

  const { id } = useParams();

  const [ vendors, setVendors ] = useState([]);

  const [ name, setName ] = useState(id || "");
  const [ billNo, setBillNo ] = useState("");
  const [ orderNo, setOrderNo ] = useState("");
  const [ billDate, setBillDate ] = useState("");
  const [ dueDate, setDueDate ] = useState("");
  const [ paymentTerms, setPaymentTerms ] = useState("");


  const [discountType, setDiscountType] = useState("At Transactional Level");

  
  const transactionTemplate = {
    itemDetails: "",
    account: "",
    quantity: "",
    rate: "",
    discount: {discountType: "percent", discountValue: 0},
    customerDetails: "",
    amount: ""
  };
  const [ transaction, settransaction ] = useState([transactionTemplate]);
  
  const [ subTotal, setSubTotal ] = useState(0);
  const [ discount, setDiscount ] = useState({
    discountType: "percent",
    discountValue: 0.00
  });

  const [ taxSystem, setTaxSystem ] = useState("TDS");

  const [ adjustment, setAdjustment ] = useState({
    adjustmentName: "Adjustment",
    adjustmentValue: 0.00
  });

  const [ taxType, setTaxType ] = useState("");

  const [ discountAmount, setDiscountAmount ] = useState(0.00);

  const [ total, setTotal ] = useState(0);

  const [ notes, setNotes ] = useState("");

  const handletransaction = (e, index) => {

  }

  const addtransactionField = () => {
    settransaction([...transaction, transactionTemplate]);
  }

  const removetransactionField = (e, index) => {
    if(index !== 0){
      const updatedtransaction = transaction.filter((pct, i) => index !== i );
      settransaction(updatedtransaction);
    }
  }

  const fetchVendors = async () => {
    const res = await httpService.get('/vendor');
    setVendors(res.data);
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Vendor Bill</title>
        <meta name="description" content="vendor bill" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col-sm-12">
              <h3 className="page-title">Vendor Bill</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Vendor Bill</li>
              </ul>
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
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                    <label htmlFor="">
                      Bill# <span className="text-danger">*</span>
                    </label>
                    <input type="text" className="form-control" name='billNo' value={billNo} onChange={(e) => setBillNo(e.target.value)}/>
                  </div>
                </div>
                <div className="col-sm-6 col-md-6">
                  <div className="form-group">
                    <label htmlFor="">
                      Order Number
                    </label>
                    <input type="text" className="form-control" name="orderNo" value={orderNo} onChange={(e) => setOrderNo(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6 col-md-4">
                  <div className="form-group">
                    <label>
                      Bill date <span className="text-danger">*</span>
                    </label>
                    <div>
                      <input className="form-control" type="date" name="billDate" value={billDate} onChange={(e) => setBillDate(e.target.value)} />
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-md-4">
                  <div className="form-group">
                    <label>
                      Due Date 
                    </label>
                    <div>
                      <input className="form-control" type="date" name='dueDate' value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-md-4">
                  <div className="form-group">
                    <label>
                      Payment Terms 
                    </label>
                    <select className="custom-select" name="paymentTerms" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} >
                      <option></option>
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
                <div className="col-sm-6 col-md-4">
                  <div className="form-group">
                    <label>
                      Discount Type
                    </label>
                    <select className="custom-select" name="discountType" value={discountType} onChange={(e) => setDiscountType(e.target.value)} >
                      <option value="At Transactional Level">At Transactional Level</option>
                      <option value="At Inline Item Level">At Inline Item Level</option>
                    </select>
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
                          <th style={{ width: '150px' }}>RATE</th>
                          { discountType === "At Inline Item Level" && 
                            <th style={{ width: '150px' }}>DISCOUNT</th>
                          }
                          <th>CUSTOMER DETAILS</th>
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
                                  <option value="">Employee Advance</option>
                                  <option value="">Prepaid Expense</option>
                                </optgroup>
                                <optgroup label='Fixed Asset'>
                                  <option value="">Furniture and Equipment</option>
                                </optgroup>
                                <optgroup label='Other Current Liability'>
                                  <option value="">Employee Reimburstment</option>
                                </optgroup>
                                <optgroup label='Credit Card'>
                                </optgroup>
                                <optgroup label='Long Term Liability'>
                                  <option value="">Contruction Loans</option>
                                  <option value="">Mortgages</option>
                                </optgroup>
                                <optgroup label='Income'>
                                  <option value="">Discount</option>
                                  <option value="">General Income</option>
                                </optgroup>
                                <optgroup label='Expense'>
                                  <option value="">Uncategorized</option>
                                </optgroup>
                                <optgroup label='Cost of Goods Sold'>
                                  <option value="">Cost of Goods Sold</option>
                                  <option value="">job Costing</option>
                                </optgroup>
                                <optgroup label='Stock'>
                                  <option value="">Inventory Asset</option>
                                </optgroup>
                              </select>
                            </td>
                            <td>
                              <input
                                className="form-control"
                                // style={{ width: '100px' }}
                                type="number" step={0.01}
                                name='quantity'
                                value={trx.quantity}
                                onChange={(e) => handletransaction(e, index)}
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                // style={{ width: '80px' }}
                                type="number" step={0.01}
                                name='rate'
                                value={trx.rate}
                                onChange={(e) => handletransaction(e, index)}
                              />
                            </td>
                            { discountType === "At Inline Item Level" && 
                              <td className='d-flex align-items-center'>
                                <input
                                  className="form-control flex-2"
                                  style={{ width: '80px' }}
                                  type="number"
                                  name="discountValue"
                                  value={trx.discount.discountValue}
                                  onChange={(e) => handletransaction(e, index)}
                                />
                                <select className="custom-select" style={{ width: '60px' }}
                                  name="discountType"
                                  value={trx.discount.discountType}
                                  onChange={(e) => handletransaction(e, index)}
                                >
                                  <option value="percent">%</option>
                                  <option value="INR">&#x20B9;</option>
                                </select>
                              </td>
                            }
                            <td>
                              <select className="custom-select"
                                name='customerDetails'
                                value={trx.customerDetails}
                                onChange={(e) => handletransaction(e, index)}
                              >
                                <option></option>
                              </select>
                            </td>
                            <td>
                              <input type="number" className="form-control" step={0.01}
                                name='amount'
                                value={trx.amount}
                                onChange={(e) => handletransaction(e, index)}
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
                <div className="ml-3 btn btn-primary" onClick={addtransactionField}><Add/> Add another Line</div>
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
                        {subTotal}
                        {/* {itemsToAdd.reduce((p, c) => p + c.amount, 0)} */}
                      </td>
                    </tr>
                    { discountType === "At Transactional Level" && 
                    <tr>
                        <td colSpan={4} className="text-right">
                        Discount %
                      </td>
                        <td className='d-flex align-items-center'>
                          <input
                            className="form-control flex-2"
                            style={{ width: '80px' }}
                            type="number"
                            step={0.01}
                            name='discountValue'
                            value={discount.discountValue}
                            onChange={(e) => setDiscount({ ...discount, discountValue : e.target.value })}
                          />
                          <select className="custom-select" style={{ width: '60px' }}
                            name='discountType'
                            value={discount.discountType}
                            onChange={(e) => setDiscount({ ...discount, discountType : e.target.value })}
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
                          type="text"
                        />
                      </td>
                    </tr>
                    }

                    { taxSystem === "TCS" && 
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
                          <input type="number" className="form-control"
                            name='adjustmentValue' value={adjustment.adjustmentValue}
                            onChange={(e) => setAdjustment({ ...adjustment, adjustmentValue : e.target.value })} step={0.01}
                          />
                        </td>
                        <td>
                          <input type="number" className="form-control" value={adjustment.adjustmentValue} disabled/>
                        </td>
                      </tr>
                    }
                    <tr>
                      <td />
                      <td />
                      <td />
                      <td className='d-flex'>
                          <div class="form-check mr-3">
                            <input class="form-check-input" type="radio" name="taxSystem" id="exampleRadios1" value="option1"
                              onClick={(e) => setTaxSystem("TDS")}
                            checked={taxSystem === "TDS"}
                            />
                            <label class="form-check-label" for="exampleRadios1">
                              TDS
                            </label>
                          </div>
                          <div class="form-check">
                            <input class="form-check-input" type="radio" name="taxSystem" id="exampleRadios2" value="option2" 
                              onClick={(e) => setTaxSystem("TCS")}
                              checked={taxSystem === "TCS"}
                            />
                            <label class="form-check-label" for="exampleRadios2">
                              TCS
                            </label>
                          </div>
                      </td>
                      <td>
                        <select className="custom-select" 
                          name="taxType"
                          style={{ maxWidth: '250px' }}
                          value={taxType}
                          onChange={(e) => setTaxType(e.target.value)}
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
                      </td>
                      <td
                        style={{
                          textAlign: 'right',
                          width: '230px',
                        }}
                      >
                        <input
                          className="form-control text-right"
                          defaultValue={0}
                          readOnly
                          type="text"
                          name='discountAmount'
                          value = { discountAmount }
                        />
                      </td>
                    </tr>
                    { taxSystem === "TDS" && 
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
                        <input type="number" className="form-control"
                          name='adjustmentValue' value={adjustment.adjustmentValue}
                          onChange={(e) => setAdjustment({ ...adjustment, adjustmentValue : e.target.value })} step={0.01}
                        />
                      </td>
                      <td>
                        <input type="number" className="form-control" value={adjustment.adjustmentValue} disabled/>
                      </td>
                    </tr>
                    }
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
              <div>
                <button className="btn btn-outline-secondary mr-2" type="submit">
                  Save as Draft
                </button>
                <button className="btn btn-primary mr-2" type="submit">
                  Save as Open
                </button>
                <button className="btn btn-outline-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    
  )
}

export default DummyVBill