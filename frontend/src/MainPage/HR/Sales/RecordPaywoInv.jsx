import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useHistory, useLocation } from 'react-router-dom';
import httpService from '../../../lib/httpService';
import { toast } from 'react-toastify';
import { createNotify } from '../../../features/notify/notifySlice';
import { useDispatch, useSelector } from 'react-redux';

const RecordPaywoInv = () => {
  
  const { state } = useLocation()
  const dispatch = useDispatch();

  const empObj = useSelector((state) => state?.authentication?.value?.user);

  const [customer, setCustomer] = useState([]);
  const [recordPayment, setRecordPayment] = useState([]);
  const [ifTax, setIfTax] = useState(false);
  const [custom, setCustom] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [updatedCustomer, setUpdatedCustomer] = useState({});
  const [constantInvoice, setConstantInvoice] = useState();
  const [withholdingTax, setWithholdingTax] = useState('');
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
    'TDS Payable'
  ]);

  useEffect(async () => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }
    await fetchCustomers();
    
  }, []);

  const fetchCustomers = async () => {
    const customers = await httpService.get('/customer');
    setCustomer(customers.data);
  };

  const selectCustomer = (id) => {
    customer.forEach((item) => {
      if(item._id === id) {
        setRecordPayment({
          ...recordPayment,
          customer: id
        })
        setSelectedCustomer(item);
        setUpdatedCustomer(item);
      }
    })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const paymentObject = {
      ...recordPayment,
      paymentAmount: recordPayment?.amountReceived,
      
    };

    console.log({ paymentObject })

    const response = await toast.promise(
      httpService.post('/sale-payment', { payment: paymentObject, invoices: [] }),
      {
        pending: 'Creating the Payment',
        success: 'Payment added successfully',
        error: "Couldn't create the Payment, recheck the details entered",
      },
    );

    dispatch(createNotify({
      notifyHead: `New Record Payment Added`,
      notifyBody: `Record Payment ${response?.data?.paymentNumber} is created`,
      createdBy: empObj?._id
    }));
  }


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
               <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label className="text-danger">Customer Name *</label>
                    <select
                      onChange={(e) => {
                        selectCustomer(e.target.value)
                      }}
                      className="custom-select"
                    >
                      <option selected>Select</option>
                      {customer.map((item) => (
                        <option key={item._id} value={item._id}>{item.displayName}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3 form-group">
                  <label className="text-danger">Amount Received</label>
                  <input
                    placeholder="INR"
                    onChange={(e) => {
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
                <div className="col-sm-3 form-group">
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
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label className="text-danger">
                      Payment Date*
                    </label>
                    <div>
                      <input
                        className="form-control"
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
              <div className="row">
                <div className="col-sm-6 form-group">
                  <label>Payment Mode#</label>
                  <select
                    defaultValue="Select"
                    onChange={(e) => {
                      if(e.target.value === 'custom') {
                        setCustom(true);
                      } else if (e.target.value != 'Select') {
                        setRecordPayment({
                          ...recordPayment,
                          paymentMode: e.target.value,
                        });
                      }
                    }}
                    className="custom-select"
                    type="text"
                  >
                    <option value="Select">Select</option>
                    {paymodes.map((paymode, i) => (
                      <option key={i} value={paymode}>{paymode}</option>
                    ))}
                    <option value="custom">Custom</option>
                  </select>
                </div>
                {custom === true && (
                  <div className="col-sm-3 form-group">
                    <input
                      onChange={(e) => {
                        setRecordPayment({
                          ...recordPayment,
                          paymentMode: e.target.value,
                        });
                      }}
                      className="form-control"
                      type="text"
                    />
                  </div>
                )}
              </div>
              <div className="row">
                <div className="col-sm-6 form-group">
                  <label>Deposit To*</label>
                  <select
                    defaultValue="Select"
                    onChange={(e) => {
                      if(e.target.value === 'custom') {
                        setCustom(true);
                      } else if (e.target.value != 'Select') {
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
                      <option key={i} value={deposits}>{deposits}</option>
                    ))}
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div className="col-sm-6 form-group">
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
              </div>
              <div className="row">
                <div className="col-sm-6 form-group">
                  <label>Tax Deducted</label>
                  <select
                    onChange={(e) => {
                      setIfTax(e.target.value)
                      setRecordPayment({
                        ...recordPayment,
                        ifTax: e.target.value,
                      })
                    }}
                    className="custom-select"
                  >
                    <option value={false}>No Tax Deducted</option>
                    <option value={true}>Yes, TDS (Income Tax)</option>
                  </select>
                </div>
              </div>
              {ifTax && (
                <div className="row">
                  <div className="col-sm-6 form-group">
                    <label>TDS Tax Account*</label>
                    <select
                      onChange={(e) => {
                        setIfTax(e.target.value)
                        setRecordPayment({
                          ...recordPayment,
                          TdsTaxAcc: e.target.value,
                        })
                      }}
                      className="custom-select"
                    >
                      {['Advance Tax', 'Employee Advance', 'Prepaid Expenses', 'TCS Receivable', 'TDS Receivable'].map((item, i) => (
                        <option key={i} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <hr />
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
                          notes: e.target.value
                        })
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="submit-section">
                {/* <button onClick={e => handleSubmit({...e, submit: true})} type="submit" value="send" className="btn btn-primary submit-btn">Save &amp; Send</button> */}
                <button onClick={handleSubmit} type="submit" value="save" className="btn btn-primary submit-btn">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecordPaywoInv