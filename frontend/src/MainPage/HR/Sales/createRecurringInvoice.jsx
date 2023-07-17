import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useHistory, useLocation } from 'react-router-dom';
import httpService from '../../../lib/httpService';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { toast } from 'react-toastify';

const CreateRecurringInvoice = () => {
  const [customer, setCustomer] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [adjustment, setAdjustment] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [invoiceToAdd, setInvoiceToAdd] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [itemsToAdd, setItemsToAdd] = useState([
    {
      item: '',
      description: '',
      unitCost: 0,
      quantity: 0,
      amount: 0,
    },
  ]);
  const [total, setTotal] = useState(0);
  const [neverExpiry, setNeverExpiry] = useState(false);

  const history = useHistory();
  const { state } = useLocation();

  const [typediscount, settypediscount] = useState("percent");
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
  useEffect(async () => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }
    fetchCustomers();
    fetchEmployees();
    if (state?.edit) {
      console.log(state?.recurringinvoiceData);
      const {
        customer,
        profileName,
        orderNumber,
        frequency,
        frequencyUnit,
        startDate,
        endDate,
        neverExpires,
        terms,
        employee,
        amount,
        adjustments,
        discount,
        grandTotal,
        customerNotes,
        termsAndConditions,
        items,
        discountVarient,
      } = state?.recurringinvoiceData;

      setInvoiceToAdd({
        customer: customer?._id,
        profileName,
        orderNumber,
        frequency,
        frequencyUnit,
        startDate: startDate?.split('T')[0],
        endDate: endDate?.split('T')[0],
        terms,
        employee,
        amount,
        grandTotal,
        customerNotes,
        termsAndConditions,
      });
      settypediscount(discountVarient?.discountType);
      setdiscountValue(discountVarient?.discountValue);
      setItemsToAdd([...items]);
      selectCustomer(customer?._id);
      setNeverExpiry(neverExpires);
      setDiscount(discount);
      setAdjustment(adjustments);
    }
  }, []);

  useEffect(() => {
    let newTotal = 0;
    itemsToAdd.forEach((item) => {
      newTotal = newTotal + parseInt(item.amount);
    });
    setTotal(newTotal);
  }, [itemsToAdd]);

  useEffect(() => {
    setGrandTotal(total - discount + adjustment);
  }, [total, discount, adjustment]);

  useEffect(() => {
    if (state?.edit) {
      console.log(state);
    }
  }, []);

  const fetchCustomers = async () => {
    const customers = await httpService.get('/customer');
    setCustomer(customers.data);
  };

  const fetchEmployees = async () => {
    const employees = await httpService.get('/employee');
    setEmployees(employees.data);
  };

  const selectCustomer = (id) => {
    customer.forEach((item) => {
      if (item._id === id) {
        setInvoiceToAdd({
          ...invoiceToAdd,
          customer: item._id,
          // {
          //   id: id,
          //   name: item.displayName,
          //   email: item.email
          // }
        });
        setSelectedCustomer(item);
      }
    });
  };

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

  const changeExpiry = () => {
    setNeverExpiry(!neverExpiry);
    setInvoiceToAdd({
      ...invoiceToAdd,
      endDate: '',
    });
  };
  console.log(invoiceToAdd?.frequency, 'selectedCustomer');
  const handleSubmit = async (e) => {
    const invoice = {
      ...invoiceToAdd,
      items: itemsToAdd,
      amount: total,
      discount: discount,
      grandTotal: grandTotal,
      adjustments: adjustment,
      neverExpires: neverExpiry,
      discountVarient: {
        discountType: typediscount,
        discountValue: discountValue,
      },
    };
    console.log(invoice);
    if (itemsToAdd[0].item == undefined || itemsToAdd[0].item == '') {
      toast.error('Please Enter Items');
      return;
    }
    // if (invoiceToAdd?.frequency == undefined || invoiceToAdd?.frequency == '') {
    //   toast.error('Please Enter Start Date');
    //   return;
    // }

    // if (invoiceToAdd?.startDate == undefined || invoiceToAdd?.startDate == '') {
    //   toast.error('Please Enter Start Date');
    //   return;
    // }
    if (
      invoiceToAdd?.profileName == undefined ||
      invoiceToAdd?.profileName == ''
    ) {
      toast.error('Please Enter profile Name');
      return;
    }
    if (
      invoiceToAdd?.customer == undefined ||
      invoiceToAdd?.customer == ''
    ) {
      toast.error('Please Select Customer Name');
      return;
    }

    if (state?.edit) {
      toast
        .promise(
          httpService.put(
            `/recurring-invoice/${state?.recurringinvoiceData?._id}`,
            invoice
          ),
          {
            pending: 'Creating the Invoice',
            success: 'Invoice created successfully',
            error: "Couldn't create the Invoice, recheck the details entered",
          }
        )
        .then((res) => history.goBack());
      // history.push('/app/sales/recurring-invoices');
      return;
    }
    toast
      .promise(httpService.post('/recurring-invoice', invoice), {
        pending: 'Creating the Invoice',
        success: 'Invoice created successfully',
        error: "Couldn't create the Invoice, recheck the details entered",
      })
      .then((res) => console.log(res));
    history.push('/app/sales/recurring-invoices');
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>New Recurring Invoice</title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col-sm-12">
              <h3 className="page-title">New Recurring Invoice</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">
                  New Recurring Invoice
                </li>
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
                handleSubmit(e);
              }}
            >
              {/* !! add redirect option to create more customer */}
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label className="text-danger">Customer Name *</label>
                    <select
                      value={invoiceToAdd?.customer}
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
                  <label className="text-danger">ProfileName#</label>
                  <input
                    required
                    value={invoiceToAdd?.profileName}
                    onChange={(e) => {
                      setInvoiceToAdd({
                        ...invoiceToAdd,
                        profileName: e.target.value,
                      });
                    }}
                    className="form-control"
                    type="text"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6 form-group">
                  <label>Order number#</label>
                  <input
                    value={invoiceToAdd?.orderNumber}
                    onChange={(e) => {
                      setInvoiceToAdd({
                        ...invoiceToAdd,
                        orderNumber: e.target.value,
                      });
                    }}
                    className="form-control"
                    type="text"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6 form-group">
                  <label className="text-danger">Repeat Every*</label>
                  <div className="col-sm-12">
                    <div className="row">
                      <input
                        required
                        value={invoiceToAdd?.frequency}
                        onChange={(e) => {
                          setInvoiceToAdd({
                            ...invoiceToAdd,
                            frequency: e.target.value,
                          });
                        }}
                        className="col-sm-6 form-control"
                        type="number"
                      />
                      <select
                        value={invoiceToAdd?.frequencyUnit}
                        onChange={(e) => {
                          setInvoiceToAdd({
                            ...invoiceToAdd,
                            frequencyUnit: e.target.value,
                          });
                        }}
                        className="col-sm-6 form-control"
                        type="number"
                      >
                        <option value="Day">Day(s)</option>
                        <option value="Week">Week(s)</option>
                        <option value="Month">Month(s)</option>
                        <option value="Year">Year(s)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3">
                  <div className="form-group">
                    <label className="text-danger">Start On*</label>
                    <div>
                      <input
                        className="form-control"
                        value={invoiceToAdd?.startDate}
                        onChange={(e) => {
                          setInvoiceToAdd({
                            ...invoiceToAdd,
                            startDate: e.target.value,
                          });
                        }}
                        type="date"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-sm-3">
                  {!neverExpiry && (
                    <div className="form-group">
                      <label>Ends On</label>
                      <div>
                        <input
                          value={invoiceToAdd?.endDate}
                          onChange={(e) => {
                            setInvoiceToAdd({
                              ...invoiceToAdd,
                              endDate: e.target.value,
                            });
                          }}
                          className="form-control"
                          type="date"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="row ml-4 mt-4">
                  <input
                    // value={neverExpiry}
                    checked={neverExpiry}
                    onChange={() => changeExpiry()}
                    className="form-check-input"
                    type="checkbox"
                    id="expiry"
                  />
                  <label className="form-check-label" for="expiry">
                    Never Expires
                  </label>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Terms</label>
                    <div>
                      <select
                        defaultValue="Due on receipt"
                        value={invoiceToAdd?.terms}
                        onChange={(e) => {
                          setInvoiceToAdd({
                            ...invoiceToAdd,
                            terms: e.target.value,
                          });
                        }}
                        className="form-control"
                        type="date"
                      >
                        {[
                          'Net 15',
                          'Net 30',
                          'Net 45',
                          'Net 60',
                          'Due end of month',
                          'Due end of next month',
                          'Due on receipt',
                        ].map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                        <option selected>Select</option>
                        <option value="Custom" selected>
                          Custom
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-6 form-group">
                  <label>Employees</label>
                  <select
                    value={invoiceToAdd?.employee}
                    onChange={(e) => {
                      setInvoiceToAdd({
                        ...invoiceToAdd,
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
                                name="item"
                                required
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
                            <td>{p.amount}</td>
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
                            {total}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={3} className="text-right">
                            Discount
                          </td>
                          <td>
                            <input
                              value={discountValue}
                              style={{ width: '180px' }}
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
                              {/* <option value="">Select option</option> */}
                              <option value="percent">%</option>
                              <option value="INR">&#x20B9;</option>

                            </select>
                          </td>
                          <td></td>
                          <td>
                            <input
                              readOnly
                              className="form-control text-right"
                              type="number"
                              value={discount}
                              onChange={(e) => {
                                setDiscount(e.target.value);
                              }}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={5} className="text-right">
                            Adjustment
                          </td>
                          <td
                            style={{
                              textAlign: 'right',
                              paddingRight: '30px',
                              width: '230px',
                            }}
                          >
                            <input
                              value={adjustment}
                              className="form-control text-right"
                              type="number"
                              onChange={(e) => {
                                setAdjustment(parseInt(e.target.value));
                              }}
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
                            {grandTotal}
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
                          className="form-control"
                          rows={4}
                          defaultValue={''}
                          value={invoiceToAdd?.customerNotes}
                          onChange={(e) => {
                            setInvoiceToAdd({
                              ...invoiceToAdd,
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
                          className="form-control"
                          rows={4}
                          defaultValue={''}
                          value={invoiceToAdd?.termsAndConditions}
                          onChange={(e) => {
                            setInvoiceToAdd({
                              ...invoiceToAdd,
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
                {/* <button type="submit" value="send" className="btn btn-primary submit-btn m-r-10">
                  Save &amp; Send
                </button> */}
                <button
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

export default CreateRecurringInvoice;
