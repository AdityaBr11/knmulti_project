import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useHistory, useLocation } from 'react-router-dom';
import httpService from '../../../lib/httpService';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { toast } from 'react-toastify';
import moment from 'moment';

const CreateCreditNotes = () => {
  const [typediscount, settypediscount] = useState("percent");
  const [customer, setCustomer] = useState([]);
  const [employees, setEmployees] = useState([]);
  // const [ advanceNote, setAdvanceNote ] = useState(false);
  const [discount, setDiscount] = useState();
  const [grandTotal, setGrandTotal] = useState(0);
  const [creditToAdd, setCreditToAdd] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [tax, setTax] = useState();
  const [taxationAmount, setTaxationAmount] = useState();
  const [selectedTax, setSelectedTax] = useState({});
  const [itemsToAdd, setItemsToAdd] = useState([
    {
      item: '',
      description: '',
      unitCost: 0,
      quantity: 0,
      amount: '',
    },
  ]);
  const [total, setTotal] = useState(0);

  const history = useHistory();
  const { state } = useLocation();
  
  const [discountValue, setdiscountValue] = useState('');
   
  const handleInlineDiscountValue = () => { 
    let updatedDiscount
    if (typediscount == 'INR') {
      // setDiscount(discountValue);
      updatedDiscount = discountValue;
    }
    if (typediscount == 'percent') {
      updatedDiscount = (total * discountValue) / 100;
      // setDiscount(discoun1);
    }
   setDiscount(updatedDiscount);
  };

  useEffect(()=>{
    handleInlineDiscountValue();

  },[typediscount,discountValue,total])

  useEffect(() => {
    setCreditToAdd({
      ...creditToAdd,
      creditDate: moment().format('YYYY-MM-DD'),
    });
  }, []);

  useEffect(async () => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }
    await fetchCustomers();
    await fetchEmployees();
    await fetchTaxes();
    if (state?.edit) {
      console.log(state);
      const {
        customer,
        amount,
        creditDate,
        creditNote,
        customerNotes,
        discount,
        employee,
        grandTotal,
        items,
        reference,
        subject,
        tax,
        termsAndConditions,
        discountVarient,
        taxAmount
      } = state;
      setCreditToAdd({
        customer: customer._id,
        amount,
        creditDate,
        creditNote,
        customerNotes,
        discount,
        employee,
        grandTotal,
        items,
        reference,
        subject,
        tax,
        termsAndConditions,
      });
      settypediscount(discountVarient?.discountType);
      setdiscountValue(discountVarient?.discountValue);
      setItemsToAdd(items);
      setDiscount(parseInt(discount));
      setSelectedTax(tax);
      setTaxationAmount(taxAmount);
      console.log("haskhba",taxAmount);
    }

    if (state?.sOConvert) {
      console.log(state);
      const {
        customer,
        amount,
        invoice,
        creditDate,
        creditNote,
        customerNotes,
        discount,
        employee,
        grandTotal,
        items,
        reference,
        subject,
        tax,
        termsAndConditions,
      } = state;
      setCreditToAdd({
        customer: customer?._id,
        amount,
        creditDate: moment().format('YYYY-MM-DD'),
        creditNote,
        customerNotes,
        discount,
        employee,
        grandTotal,
        items,
        reference: reference || invoice,
        subject,
        tax: tax?._id,
        termsAndConditions,
      });
      setItemsToAdd(items);
      setDiscount(parseInt(discount));
      setSelectedTax(tax);
    }
  }, []);

  useEffect(() => {
    if (state?.customerId) {
      setCreditToAdd({
        ...creditToAdd,
        customer: state?.customerId,
        creditDate: moment().format('YYYY-MM-DD'),
      });
      selectCustomer(state?.customerId);
    }
  }, []);

  useEffect(() => {
    let newTotal = 0;
    itemsToAdd.map((item) => {
      newTotal = newTotal + parseInt(item?.amount);
    });
    console.log(
      newTotal,'newTotal',
     selectedTax?.amount,
      'elseabnm,.____________'
    );
    setTotal(newTotal);
    if (selectedTax?.type === 'Amount') {
      setTaxationAmount(selectedTax?.amount);
    } else if (selectedTax?.amount) {
      setTaxationAmount((newTotal / 100) * selectedTax?.amount);

    }
  }, [itemsToAdd, selectedTax]);
  
  useEffect(() => {
    setGrandTotal(total + (taxationAmount || 0) - discount);
  }, [total, taxationAmount, discount]);

  const fetchCustomers = async () => {
    const customers = await httpService.get('/customer');
    setCustomer(customers.data);
  };

  const fetchEmployees = async () => {
    const employees = await httpService.get('/employee');
    setEmployees(employees.data);
  };

  const fetchTaxes = async () => {
    const tax = await httpService.get('/tax');
    setTax(tax.data);
  };

  const selectCustomer = (id) => {
    customer.forEach((item) => {
      if (item._id === id) {
        setCreditToAdd({
          ...creditToAdd,
          customer: id,
        });
        setSelectedCustomer(item);
      }
    });
  };

  const selectTax = (id) => {
    if(id=="select") {
      setTaxationAmount(0);
    }else{
      tax.forEach((t) => {
        if (t._id === id) {
          setSelectedTax(t);
          console.log(t, 'nanana___________');
        }
      });
    }
    
  };
 
  useEffect(() => {
    // selectTax(632c323692d96c37e84245cd);
    // selectTax();
    
  }, []);



  const handleItemsAddition = (e, index) => {
    const updatedItemList = itemsToAdd.map((pct, i) =>
      index == i ? Object.assign(pct, { [e.target.name]: e.target.value }) : pct
    );
    updatedItemList[index].amount =
      parseInt(updatedItemList[index].quantity) *
      parseInt(updatedItemList[index].unitCost);
    setItemsToAdd(updatedItemList);
  };

  const removeitem = (e, index) => {
    if (index !== 0) {
      const updatedItemList = itemsToAdd.filter((pct, i) => index !== i);
      setItemsToAdd(updatedItemList);
    }
  };
  console.log('discountValue',creditToAdd); 
  const addItems = () => {
    setItemsToAdd([
      ...itemsToAdd,
      {
        item: '',
        description: '',
        unitCost: 0,
        quantity: 0,
        amount: '',
      },
    ]);
  };




  
  const handleSubmit = async (e) => {
    console.log(creditToAdd,'creditToAddcreditToAddcreditToAdd');
    // return;

    const creditNote = {
      ...creditToAdd,
      taxAmount: taxationAmount,
      items: itemsToAdd,
      amount: total,
      discount: discount,
      grandTotal: grandTotal,
      discountVarient: {
        discountType: typediscount,
        discountValue: discountValue,
      },
    };
    if (itemsToAdd[0].item == undefined || itemsToAdd[0].item == '') {
      // alert("Please select a job role");
      toast.error('Please Select Items');
      return;
    }
    if (creditToAdd.customer == undefined || creditToAdd.customer == '') {
      // alert("Please select a job role");
      toast.error('Please Select Customer');
      return;
    }
    // if (creditToAdd.employee == undefined || creditToAdd.employee == '') {
    //   // alert("Please select a job role");
    //   toast.error('Please Select Employee');
    //   return;
    // }
    
    
    if (state?.edit) {
      if (creditNote.creditUsed > creditNote.grandTotal) {
        toast.error('Credit Total is less than the credits already used', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
      await toast.promise(
        httpService.put(`/credit-note/${state?._id}`, creditNote),
        {
          pending: 'Creating Credit Note',
          success: 'Credit Note Created',
          error: "Couldn't create the Credit Note, recheck the details entered",
        }
      );
      history.push('/app/sales/credit-notes');
      return;
    }
    const response = await toast.promise(
      httpService.post('/credit-note', creditNote),
      {
        pending: 'Creating Credit Note',
        success: 'Credit Note Created',
        error: "Couldn't create the Credit Note, recheck the details entered",
      }
    );
    console.log(e.submit);
    if (e.submit) {
      history.push({
        pathname: '/app/apps/email',
        state: {
          id: response?.data?._id,
          subject: `Details for Credit Note: ${response?.data?.creditNote}`,
          pdf: response?.data?.pdf_url,
          index: response?.data?.creditNote,
          type: 'credit-note',
          emailId: response?.data?.customer?.email,
          backTo: -3,
        },
      });
      return;
    }
    history.push('/app/sales/credit-notes');
    return;
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>New Credit Note</title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col-sm-12">
              <h3 className="page-title">New Credit Note</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">New Credit Note</li>
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
                    <label className="text-danger">Customer Name *</label>
                    <select
                      value={creditToAdd?.customer || null}
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
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-6 form-group">
                  <label className="text-danger">Credit Note#</label>
                  <input
                    value={creditToAdd?.creditNote || null}
                    placeholder="CN-000XX"
                    onChange={(e) => {
                      setCreditToAdd({
                        ...creditToAdd,
                        creditNote: e.target.value,
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
                  <label>Reference#</label>
                  <input
                    value={creditToAdd?.reference || null}
                    onChange={(e) => {
                      setCreditToAdd({
                        ...creditToAdd,
                        reference: e.target.value,
                      });
                    }}
                    className="form-control"
                    type="text"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label className="text-danger">Credit Note Date</label>
                    <div>
                      <input
                        value={creditToAdd?.creditDate?.split('T')[0] || null}
                        className="form-control"
                        onChange={(e) => {
                          setCreditToAdd({
                            ...creditToAdd,
                            creditDate: e.target.value,
                          });
                        }}
                        type="date"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-6 form-group">
                  <label>Employees</label>
                  <select
                    value={creditToAdd?.employee || null}
                    onChange={(e) => {
                      setCreditToAdd({
                        ...creditToAdd,
                        employee: parseInt(e.target.value),
                      });
                    }}
                    className="custom-select"
                  >
                    <option>Please Select</option>
                    {employees.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {`${employee.firstName} ${employee.lastName}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-6 form-group">
                  <label>Subject</label>
                  <input
                    value={creditToAdd?.subject || null}
                    onChange={(e) => {
                      setCreditToAdd({
                        ...creditToAdd,
                        subject: e.target.value,
                      });
                    }}
                    className="form-control"
                    type="text"
                  />
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-md-12 col-sm-12">
                  <div className="table-responsive">
                    <table className="table table-hover table-white">
                      <thead>
                        <tr className="text-center">
                          <th>S.No.</th>
                          <th>Item</th>
                          <th>Description</th>
                          <th>Unit Cost</th>
                          <th>Qty</th>
                          <th>Amount</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itemsToAdd.map((p, index) => (
                          <tr className="text-center" key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <input
                                className="form-control"
                                type="text"
                                required
                                name="item"
                                value={p.item}
                                onChange={(e) => handleItemsAddition(e, index)}
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="text"
                                name="description"
                                value={p.description}
                                onChange={(e) => handleItemsAddition(e, index)}
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="number"
                                name="unitCost"
                                value={p.unitCost}
                                onChange={(e) => handleItemsAddition(e, index)}
                              />
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="number"
                                maxLength={10}
                                name="quantity"
                                value={p.quantity}
                                onChange={(e) => handleItemsAddition(e, index)}
                              />
                            </td>
                            <td>{p.amount || 0}</td>
                            <td>
                              {index === 0 ? (
                                <span></span>
                              ) : (
                                <div
                                  className=""
                                  onClick={(e) => removeitem(e, index)}
                                >
                                  <DeleteForeverIcon />
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="btn btn-primary" onClick={addItems}>
                      + Add Items
                    </div>
                  </div>
                  <hr />
                  <div className="table-responsive">
                    <table className="table table-hover table-white">
                      <tbody>
                        <tr>
                          <td />
                          <td />
                          <td />
                          <td />
                          <td className="text-right">Total</td>
                          <td
                            style={{
                              textAlign: 'right',
                              paddingRight: '30px',
                              width: '230px',
                            }}
                          >
                            {total || 0}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={3} className="text-right">
                            Discount
                          </td>
                          <td
                            style={{
                              textAlign: 'right',
                              paddingRight: '30px',
                              width: '230px',
                            }}
                          >
                            <input
                              value={discountValue}
                              style={{ width: '180px',marginLeft: '10px' }}
                              className="form-control"
                              type="number"
                              onChange={(e) => {
                                setdiscountValue(e.target.value);
                              }}
                              onBlur={handleInlineDiscountValue}
                            /> 
                            <select
                              className="custom-select"
                              style={{ width: '180px' }}
                              name="discountType"
                              value={typediscount}
                              onChange={(e) => {
                                settypediscount(e.target.value);
                                handleInlineDiscountValue(e.target.value);
                              }}
                              // onBlur={handleInlineDiscountValue}
                            >
                              <option value="percent">%</option>
                              <option value="INR">&#x20B9;</option>

                            </select>
                          </td>
                          <td></td>
                          <td>
                            <input
                              value={discount || 0}
                              readOnly
                              className="form-control text-right"
                              type="number"
                              onChange={(e) => {
                                setDiscount(e.target.value);
                              }}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={3} className="text-right">
                            TCS
                          </td>
                          <td
                            style={{
                              textAlign: 'right',
                              paddingRight: '30px',
                              width: '230px',
                            }}
                          >
                            <select
                              value={creditToAdd?.tax || null}
                              onChange={(e) => {
                                setCreditToAdd({
                                  ...creditToAdd,
                                  tax: e.target.value,
                                });
                                selectTax(e.target.value || creditToAdd?.tax);
                              }}

                              
                              className="custom-select"
                            >
                              <option value={"select"}>Please Select</option>
                              
                              {tax?.map((t) => (
                                <option key={t._id} value={t._id}>
                                  {`${t.name} ${t.type}`}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td></td>
                          <td>
                            <input
                              readOnly
                              value={taxationAmount}
                              className="form-control text-right"
                              type="number"
                            />
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
                            {grandTotal || 0}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Customer Notes</label>
                        <textarea
                          value={creditToAdd?.customerNotes || null}
                          className="form-control"
                          rows={4}
                          defaultValue={''}
                          onChange={(e) => {
                            setCreditToAdd({
                              ...creditToAdd,
                              customerNotes: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Terms & Conditions</label>
                        <textarea
                          value={creditToAdd?.termsAndConditions || null}
                          className="form-control"
                          rows={4}
                          defaultValue={''}
                          onChange={(e) => {
                            setCreditToAdd({
                              ...creditToAdd,
                              termsAndConditions: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="submit-section">
                {/* <button onClick={e => handleSubmit({...e, submit: true})} type="submit" value="send" className="btn btn-primary submit-btn m-r-10">
                  Save &amp; Send
                </button> */}
                <button
                  onClick={(e) => handleSubmit({ ...e, submit: false })}
                  type="submit"
                  value="save"
                  className="btn btn-primary submit-btn"
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

export default CreateCreditNotes;
