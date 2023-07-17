import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useHistory, useLocation } from 'react-router-dom';
import httpService from '../../../lib/httpService';
import { toast } from 'react-toastify';
import { createNotify } from '../../../features/notify/notifySlice';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

const RecordPayment = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const empObj = useSelector((state) => state?.authentication?.value?.user);

  const [customer, setCustomer] = useState([]);
  const [recordPayment, setRecordPayment] = useState([]);
  const [ifTax, setIfTax] = useState(false);
  const [custom, setCustom] = useState(false);
  const [customDeposit, setCustomDeposit] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [updatedCustomer, setUpdatedCustomer] = useState({});
  const [constantInvoice, setConstantInvoice] = useState();
  const [withholdingTax, setWithholdingTax] = useState(0);
  const [totalAmount, setTotalAmount] = useState('');
  const [paymodes, setPaymodes] = useState([
    'Bank Remittance',
    'Bank Transfer',
    'Cash',
    'Check',
    'Credit Card',
  ]);
  const [depositTo, setDepositTo] = useState([
    'Petty Cash',
    'Undeposited Funds',
    'Employee Reimbursments',
    'Opening Balance Adjustments',
    'TCS Payable',
    'TDS Payable',
  ]);
  const { state } = useLocation();

  useEffect(async () => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }

    const data = await fetchCustomers();

    setRecordPayment({
      ...recordPayment,
      paymentDate: moment().format('YYYY-MM-DD'),
    });

    if (state?.sOConvert) {
      const { customer } = state;
      if (customer) {
        selectCustomer(customer?._id, data);
      }
    }

    // if (state.edit) {
    //   const {
    //     invoices,
    //     customer,
    //     paymentDate,
    //     paymentMode,
    //     paymentAmount,
    //     TdsTaxAcc,
    //     amountReceived,
    //     bankCharges,
    //     depositTo,
    //     excessAmount,
    //     ifTax,
    //     notes,
    //     paymentNumber,
    //     reference,
    //     withholdingTax,
    //   } = state;

    // }
  }, []);

  useEffect(() => {
    if (state?.customerId) {
      setRecordPayment({
        ...recordPayment,
        customer: state?.customerId,
        paymentDate: moment().format('YYYY-MM-DD'),
      });

      selectCustomer(state?.customerId);
      // fetchInvoices(state?.customerId);
    }
  }, [customer]);

  useEffect(async () => {
    await fetchInvoices();
    if (state?.sOConvert) {
      setUpdatedCustomer({
        ...selectedCustomer,
      });
      setInvoices([
        {
          ...state,
        },
      ]);
      setConstantInvoice([
        {
          ...state,
        },
      ]);
    } else {
      setUpdatedCustomer({
        ...selectedCustomer,
      });
    }
    setRecordPayment({
      ...recordPayment,
      paymentDate: moment().format('YYYY-MM-DD'),
    });
  }, [selectedCustomer]);

  const fetchInvoices = async (customerId) => {
    if (selectedCustomer._id || customerId) {
      const customerData = selectedCustomer._id || customerId;
      const invData = await httpService.get(`/customer/invoices/${customerData}`);
      const inv = await invData.data.filter(i => i.status != "PAID");
      setInvoices([...inv]);
      setConstantInvoice([...inv]);
      setWithholdingTax(0);
      setTotalAmount(0);
    }
  };

  const fetchCustomers = async () => {
    const customers = await httpService.get('/customer');
    setCustomer(customers.data);
    return customers.data;
  };

  const selectCustomer = (id, data) => {
    if (customer?.length > 0) {
      customer?.forEach((item) => {
        if (item._id === id) {
          setRecordPayment({
            ...recordPayment,
            customer: id,
          });
          setSelectedCustomer(item);
          setUpdatedCustomer(item);
        }
      });
    } else {
      data?.forEach((item) => {
        if (item._id === id) {
          setRecordPayment({
            ...recordPayment,
            customer: id,
          });
          setSelectedCustomer(item);
          setUpdatedCustomer(item);
        }
      });
    }
  };

  useEffect(() => {
    if(!ifTax){
      setWithholdingTax(0)
    }
  }, [ifTax]);

  const handleTaxAddition = (e, index) => {
    let withhTax = 0;
    let payAmount = 0;
    if (index >= 0) {
      const newInvoiceList = invoices;
      const updatedInvoice = {
        ...invoices[index],
        withholdingTax:
          parseInt(e.target.value) + constantInvoice[index].withholdingTax,
      };
      newInvoiceList[index] = updatedInvoice;
      setInvoices([...newInvoiceList]);
      newInvoiceList.map((newInvoice, i) => {
        withhTax +=
          newInvoice.withholdingTax - constantInvoice[i].withholdingTax;
        payAmount += newInvoice.paidAmount - constantInvoice[i].paidAmount;
      });
      withhTax += updatedCustomer.withholdingTax;
      payAmount += updatedCustomer.paidBalance;
      setWithholdingTax(withhTax);
      setTotalAmount(payAmount);
    } else {
      invoices.map((invoice, i) => {
        withhTax += invoice.withholdingTax - constantInvoice[i].withholdingTax;
        payAmount += invoice.paidAmount - constantInvoice[i].paidAmount;
      });
      withhTax += parseInt(e.target.value);
      payAmount += updatedCustomer.paidBalance;
      setUpdatedCustomer({
        ...updatedCustomer,
        withholdingTax:
          parseInt(e.target.value) + selectedCustomer.withholdingTax,
      });
      setWithholdingTax(withhTax);
      setTotalAmount(payAmount);
    }
  };

  const handleAmountAddition = (e, index) => {
    
    let withhTax = 0;
    let payAmount = 0;
    if (index >= 0) {
      const newInvoiceList = [...invoices];
      console.log(e.target.value,newInvoiceList, index,"riik444");
      const updatedInvoice = {
        ...invoices[index],
        paidAmount:
          parseInt(e.target.value) + constantInvoice[index].paidAmount,
      };
      newInvoiceList[index] = updatedInvoice;
      setInvoices(newInvoiceList);
      newInvoiceList.map((newInvoice, i) => {
        withhTax +=
          newInvoice.withholdingTax - constantInvoice[i].withholdingTax;
        payAmount += newInvoice.paidAmount - constantInvoice[i].paidAmount;
      });
      payAmount += updatedCustomer.paidBalance;
      withhTax += updatedCustomer.withholdingTax;
      setWithholdingTax(withhTax);
      setTotalAmount(payAmount);
    } else {
      invoices.map((invoice, i) => {
        withhTax += invoice.withholdingTax - constantInvoice[i].withholdingTax;
        payAmount += invoice.paidAmount - constantInvoice[i].paidAmount;
      });
      payAmount += parseInt(e.target.value);
      withhTax += updatedCustomer.withholdingTax;
      setUpdatedCustomer({
        ...updatedCustomer,
        paidBalance: parseInt(e.target.value) + selectedCustomer.paidBalance,
      });
      setWithholdingTax(withhTax);
      setTotalAmount(payAmount + selectedCustomer.paidBalance);
    }
  };
  
  
  const [checked, setChecked] = useState(false)
  const [amount, setAmount] = useState(0)
  console.log(constantInvoice,"riik444");
  const handleClick = () => {
    setAmount(constantInvoice[0].amount);
    console.log(constantInvoice[0].amount, index,"riik444");
    let withhTax = 0;
    let payAmount = 0;
    let index = 0;
    setRecordPayment({
      ...recordPayment,
      amountReceived: parseInt(constantInvoice[0].amount)
    });
    if (index >= 0) {
      const newInvoiceList = [...invoices];
      const updatedInvoice = {
        ...invoices[index],
        paidAmount: parseInt(constantInvoice[0].amount) + constantInvoice[index].paidAmount,
      };
      newInvoiceList[index] = updatedInvoice;
      setInvoices(newInvoiceList);
      newInvoiceList.map((newInvoice, i) => {
        withhTax +=
          newInvoice.withholdingTax - constantInvoice[i].withholdingTax;
        payAmount += newInvoice.paidAmount - constantInvoice[i].paidAmount;
      });
      payAmount += updatedCustomer.paidBalance;
      withhTax += updatedCustomer.withholdingTax;
      setWithholdingTax(withhTax);
      setTotalAmount(payAmount);
    }
    setChecked(!checked);
  }
  const handleSubmit = async (e) => {  
    const payment = {
      ...recordPayment,
      withholdingTax: withholdingTax, 
      paymentAmount: totalAmount,
      excessAmount: recordPayment.amountReceived - totalAmount,
    };
    if (
      selectedCustomer.displayName == undefined ||
      selectedCustomer.displayName == ''
    ) {
      // alert("Please select a job role");
      toast.error('Please Select Customer');
      return;
    }
    if (
      recordPayment.paymentDate == undefined ||
      recordPayment.paymentDate == ''
    ) {
      // alert("Please select a job role");
      toast.error('Please Select Date');
      return;
    }
    if (
      recordPayment.depositTo == undefined ||
      recordPayment.depositTo == ''
    ) {
      // alert("Please select a job role");
      
      toast.error('Please Select Deposit To');
      return;
    }
    if (
      recordPayment.paymentMode == undefined ||
      recordPayment.paymentMode == ''
    ) {
      // alert("Please select a job role");
      
      toast.error('Please Select Paymen Mode ');
      return;
    }
    // returns;

    invoices.forEach((invoice) => {
      if (
        invoice.grandTotal < invoice.paidAmount ||
        updatedCustomer.openingBalance <
          updatedCustomer.paidBalance + updatedCustomer.withholdingTax
      ) {
        toast.error(
          'The amount entered is more than the balance due for the selected invoices.',
          {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
        return;
      }
    });
    if (totalAmount > payment.amountReceived) {
      toast.error(
        'The amount entered for individual invoice(s) exceeds the total payment the customer has made. Please check and retry.',
        {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      return;
    }
    const paymentObject = {
      payment,
      invoices,
      updatedCustomer,
    };
    if (
      selectedCustomer.paidBalance !== updatedCustomer.paidBalance ||
      selectedCustomer.withholdingTax !== updatedCustomer.paidBalance
    ) {
      paymentObject.customerModifed = {
        isModified: true,
        paidbalance: updatedCustomer.paidBalance - selectedCustomer.paidBalance,
        withholdingTax:
          updatedCustomer.withholdingTax - selectedCustomer.withholdingTax,
      };
    } else {
      paymentObject.customerModified = {
        isMOdified: false,
      };
    }
    const response = await toast.promise(
      httpService.post('/sale-payment', paymentObject),
      {
        pending: 'Creating the Payment',
        success: 'Payment added successfully',
        error: "Couldn't create the Payment, recheck the details entered",
      }
    );

    dispatch(
      createNotify({
        notifyHead: `New Record Payment Added`,
        notifyBody: `Record Payment ${response?.data?.paymentNumber} is created`,
        createdBy: empObj?._id,
      })
    );

    if (e.submit) {
      history.push({
        pathname: '/app/apps/email',
        state: {
          id: response?.data?._id,
          subject: `Details of Payment for: ${response?.data?.paymentNumber}`,
          pdf: response?.data?.pdf_url,
          index: response?.data?.paymentNumber,
          type: 'sale-payment',
          emailId: response?.data?.customer?.email,
          backTo: -3,
        },
      });
      return;
    }
    history.push('/app/sales/payment-received');
    return;
  };
  const handleattendance = (e) => {
    setattendance({ ...attendance, [e.target.name]: e.target.value });
  };

  console.log({ifTax});

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Record Payment</title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col-sm-12">
              <h3 className="page-title">Record Payment</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Record Payment</li>
              </ul>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        <div className="row">
          <div className="col-sm-12">
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              {/* !! add redirect option to create more customer */}
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Customer Name  <span className='text-danger'>*</span></label>
                    <select
                      value={recordPayment?.customer || null}
                      // value={selectedCustomer?._id || null}

                      onChange={(e) => {
                        selectCustomer(e.target.value);
                      }}
                      className="custom-select"
                    >
                      <option selected>Select</option>
                      {customer.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.displayName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-sm-6 form-group">
                  <label>Payment#</label>
                  <input
                    onChange={(e) => {
                      setRecordPayment({
                        ...recordPayment,
                        paymentNumber: e.target.value,
                      });
                    }}
                    disabled={true}
                    className="form-control"
                    type="text"
                  />
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-4 form-group">
                  <label>Amount Received  <span className='text-danger'> *</span></label>
                  <input
                    placeholder="INR"
                    value={recordPayment.amountReceived}
                    onInput={(e) => {
                      setRecordPayment({
                        ...recordPayment,
                        amountReceived: parseInt(e.target.value),
                      });
                    }}
                    className="form-control"
                    type="number"
                    required
                  />
                </div>
                <div className="col-sm-4 form-group">
                  <label>Bank Charges (if any)</label>
                  <input
                    placeholder="INR"
                    onChange={(e) => {
                      setRecordPayment({
                        ...recordPayment,
                        bankCharges: parseInt(e.target.value),
                      });
                    }}
                    className="form-control"
                    type="number"
                  />
                </div>
                <div className="col-sm-4">
                  <div className="form-group">
                    <label>Payment Date  <span className='text-danger'> *</span></label>
                    <div>
                      <input
                        className="form-control"
                        value={recordPayment?.paymentDate?.split('T')[0] || ''}
                        onChange={(e) => {
                          setRecordPayment({
                            ...recordPayment,
                            paymentDate: e.target.value,
                          });
                        }}
                        type="date"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-4 form-group">
                  <label>Payment Mode#</label>
                  <select
                    // defaultValue="Select"
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setCustom(true);
                        setRecordPayment({
                          ...recordPayment,
                          paymentMode: "",
                        });
                      } else{
                        setCustom(false);
                        setRecordPayment({
                          ...recordPayment,
                          paymentMode: e.target.value,
                        });
                      }
                    }}
                    className="custom-select"
                    type="text"
                  >
                    <option value="">Select</option>
                    {paymodes.map((paymode, i) => (
                      <option key={i} value={paymode}>
                        {paymode}
                      </option>
                    ))}
                    <option value="custom">Custom</option>
                  </select>
                </div>
                {custom === true && (
                  <div className="col-sm-4 form-group">
                    <label>Custom Payment Mode</label>
                    <input
                      onChange={(e) => {
                        setRecordPayment({
                          ...recordPayment,
                          paymentMode: e.target.value,
                        });
                      }}
                      className="form-control"
                      type="text"
                      required
                    />
                  </div>
                )}
              </div>
              <div className="row">
                <div className="col-sm-4 form-group">
                  <label>Deposit To  <span className='text-danger'>*</span></label>
                  <select
                    defaultValue="Select"
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setCustomDeposit(true);
                        setRecordPayment({
                          ...recordPayment,
                          depositTo: "",
                        });
                      } else{
                        setCustomDeposit(false);
                        setRecordPayment({
                          ...recordPayment,
                          depositTo: e.target.value,
                        });
                      }
                    }}
                    className="custom-select"
                    type="text"
                  >
                    <option value="Select">Select</option>
                    {depositTo.map((deposits, i) => (
                      <option key={i} value={deposits}>
                        {deposits}
                      </option>
                    ))}
                    <option value="custom">Custom</option>
                  </select>
                </div>
                {customDeposit === true && (
                  <div className="col-sm-4 form-group">
                    <label>Custom Deposit To</label>
                    <input
                      onChange={(e) => {
                        setRecordPayment({
                          ...recordPayment,
                          depositTo: e.target.value,
                        });
                      }}
                      className="form-control"
                      type="text"
                    />
                  </div>
                )}
              </div>
              <div className="row">
                <div className="col-sm-4 form-group">
                  <label>Reference#</label>
                  <input
                    onChange={(e) => {
                      setRecordPayment({
                        ...recordPayment,
                        reference: e.target.value,
                      });
                    }}
                    className="form-control"
                    type="text"
                  />
                </div>
                <div className="col-sm-4 form-group">
                  <label>Tax Deducted</label>
                  <select
                    onChange={(e) => {
                      setIfTax(!ifTax);
                      setRecordPayment({
                        ...recordPayment,
                        ifTax: e.target.value,
                      });
                    }}
                    className="custom-select"
                  >
                    <option value={false}>No Tax Deducted</option>
                    <option value={true}>Yes, TDS (Income Tax)</option>
                  </select>
                </div>
              {ifTax === true && (
                <div className="col-sm-4 form-group">
                
                    <label>TDS Tax Account*</label>
                    <select
                      onChange={(e) => {
                        // setIfTax(e.target.value);
                        setRecordPayment({
                          ...recordPayment,
                          TdsTaxAcc: e.target.value,
                        });
                      }}
                      className="custom-select"
                    >
                      {[
                        'Advance Tax',
                        'Employee Advance',
                        'Prepaid Expenses',
                        'TCS Receivable',
                        'TDS Receivable',
                      ].map((item, i) => (
                        <option key={i} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                
              )}
              </div>

              <hr />
              <div className="row">
                <div className="col-md-12 col-sm-12">
                  <div className="table-responsive">
                    <table className="table table-hover table-white">
                      <thead>
                        <tr className="text-center">
                          <th>Date</th>
                          <th>Invoice Number</th>
                          <th>Invoice Amount</th>
                          <th>Amount Due</th>
                          {ifTax && <th>Withholding Tax</th>}
                          <th>Payment</th>
                          
                        </tr>
                      </thead>
                      <tbody>
                        {/* {parseInt(selectedCustomer.openingBalance) -
                          parseInt(selectedCustomer.paidBalance) >
                        0 ? (
                          <tr className="text-center">
                            <td>{selectedCustomer.createdAt.split('T')[0]}</td>
                            <td>Customer Opening Balance</td>
                            <td>{selectedCustomer.openingBalance}</td>
                            <td>
                              {selectedCustomer.openingBalance -
                                selectedCustomer.paidBalance -
                                selectedCustomer.withholdingTax}
                            </td>
                            {ifTax && (
                              <td>
                                <input
                                  className="form-control"
                                  type="number"
                                  name="withholdingTax"
                                  onChange={(e) => handleTaxAddition(e)}
                                />
                              </td>
                            )}
                            <td>
                              <input
                                className="form-control"
                                type="number"
                                onChange={(e) => handleAmountAddition(e)}
                              />
                            </td>
                          </tr>
                        ) : (
                          <></>
                        )} */}
                        {constantInvoice?.map((p, index) => (
                          <tr className="text-center" key={index}>
                            <td>{p?.invoiceDate?.split('T')[0]}</td>
                            <td>{p?.invoice}</td>
                            <td>{p?.grandTotal}</td>
                            <td>
                              {p?.grandTotal -
                                p?.paidAmount -
                                p?.withholdingTax}
                            </td>
                            {ifTax && (
                              <td>
                                <input
                                  className="form-control"
                                  type="number"
                                  name="withholdingTax"
                                  onChange={(e) => handleTaxAddition(e, index)}
                                />
                              </td>
                            )}
                            <td>
                              <input
                                className="form-control"
                                type="number"
                                value={amount}
                                // onChange={(e) => handleAmountAddition(e, index)}
                                onChange={(e) => {
                                  handleAmountAddition(e, index)
                                  setAmount(e.target.value);
                                }}
                              />
                            </td>
                            <td>
                            <input onClick={handleClick}  type="checkbox" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <hr />
                  <div className="table-responsive">
                    <table className="table table-hover table-white">
                      <tbody>
                        <tr>
                          <td colSpan={ifTax ? 4 : 5} className="text-right">Total:</td>
                          { ifTax && 
                          
                          <td 
                            style={{
                              textAlign: 'right',
                              paddingRight: '30px',
                              width: '230px',
                            }}
                          >{withholdingTax || 0}</td>
                          }
                          
                          <td
                            style={{
                              textAlign: 'right',
                              paddingRight: '30px',
                              width: '230px',
                            }}
                          >
                            {totalAmount || 0}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={5} className="text-right">
                            Amount Received:
                          </td>
                          <td
                            style={{
                              textAlign: 'right',
                              paddingRight: '30px',
                              width: '230px',
                            }}
                          >
                            {recordPayment.amountReceived || 0}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={5} className="text-right">
                            Amount used for Payments:
                          </td>
                          <td
                            style={{
                              textAlign: 'right',
                              paddingRight: '30px',
                              width: '230px',
                            }}
                          >
                            {totalAmount || 0}
                          </td>
                        </tr>
                        {/* <tr>
                          <td colSpan={5} className="text-right">
                            Amount Redfunded:
                          </td>
                          <td
                            style={{
                              textAlign: 'right',
                              paddingRight: '30px',
                              width: '230px',
                            }}
                          >
                            0
                          </td>
                        </tr> */}
                        <tr>
                          <td
                            colSpan={5}
                            style={{ textAlign: 'right', fontWeight: 'bold' }}
                          >
                            Amount In Excess:
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
                            {recordPayment.amountReceived - totalAmount || 0}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Notes</label>
                        <textarea
                          className="form-control"
                          rows={4}
                          defaultValue={''}
                          onChange={(e) => {
                            setRecordPayment({
                              ...recordPayment,
                              notes: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="submit-section">
                {/* <button onClick={e => handleSubmit({...e, submit: true})} type="submit" value="send" className="btn btn-primary submit-btn">Save &amp; Send</button> */}
                <button
                  onClick={(e) => handleSubmit({ ...e, submit: false })}
                  type="submit"
                  value="save"
                  className="btn btn-primary submit-btn"
                  // disabled={(recordPayment.amountReceived - totalAmount) != 0}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Page Content */}
    </div>
  );
};

export default RecordPayment;
