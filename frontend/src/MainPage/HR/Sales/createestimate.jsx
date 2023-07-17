import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useHistory, useLocation } from 'react-router-dom';
import httpService from '../../../lib/httpService';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { toast } from 'react-toastify';
import moment from 'moment';

const CreateEstimate = () => {
  const [customer, setCustomer] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tax, setTax] = useState([]);
  const [selectedTax, setSelectedTax] = useState({});
  const [taxationAmount, setTaxationAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [estimateToAdd, setEstimateToAdd] = useState({});
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
  const [adjustment, setAdjustment] = useState(0);
  const [total, setTotal] = useState(0);
  const { state } = useLocation();

  const history = useHistory();

  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }
    fetchCustomers();
    fetchEmployees();
    fetchProjects();
    fetchTaxes();
    setEstimateToAdd({
      ...estimateToAdd,
      estimateDate: moment().format("YYYY-MM-DD"),
    })
  }, []);
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

  useEffect(() => {
    if (state?.edit) {
      const { 
        customer,
        amount,
        customerNotes,
        discount,
        adjustment,
        project,
        employee,
        estimate,
        estimateDate,
        expiryDate,
        grandTotal,
        items,
        tax,
        reference,
        subject,
        taxAmount,
        termsAndConditions,
        discountVarient,
      } = state;
      setEstimateToAdd({
        customer: customer?._id,
        amount,
        customerNotes,
        discount,
        project: project?._id,
        employee: employee?._id,
        estimate,
        estimateDate,
        expiryDate,
        // grandTotal,
        items,
        tax: tax?._id,
        reference,
        subject,
        taxAmount,
        termsAndConditions,
        
      });
      settypediscount(discountVarient?.discountType);
      setdiscountValue(discountVarient?.discountValue || 0);
      
      selectCustomer(customer);
      setItemsToAdd(items);
      setDiscount(parseInt(discount));
      setAdjustment(parseInt(adjustment));
      setSelectedTax(tax);
      // setGrandTotal(grandTotal);
    }
  }, []);

  useEffect(() => {
    if(state?.customerId){
      setEstimateToAdd({
        ...estimateToAdd,
        customer: state?.customerId,
        estimateDate: moment().format("YYYY-MM-DD"),
      })

      selectCustomer(state?.customerId);
      }
  }, []);

  useEffect(() => {
    let newTotal = 0;
    itemsToAdd.map((item) => {
      newTotal = newTotal + parseInt(item?.amount)
    })
    setTotal(newTotal);
    if(selectedTax?.type === "Amount") {
      setTaxationAmount(selectedTax?.amount);
    } 
    else {
      setTaxationAmount(newTotal/100*selectedTax?.amount || 0);
    }
  }, [itemsToAdd, selectedTax]);

  useEffect(() => {
    setGrandTotal(total+(taxationAmount || 0)-discount+parseInt(adjustment))
  }, [total, taxationAmount, discount, adjustment]);

  const fetchCustomers = async () => {
    const customers = await httpService.get('/customer');
    setCustomer(customers.data);
  };

  const fetchEmployees = async () => {
    const employees = await httpService.get('/employee');
    setEmployees(employees.data);
  };

  const fetchProjects = async () => {
    const projects = await httpService.get('/project');
    setProjects(projects.data);
  };

  const fetchTaxes = async () => {
    const tax = await httpService.get('/tax');
    setTax(tax.data);
    console.log(tax.data);
  };

  const selectCustomer = (id) => {
    customer.forEach((item) => {
      if(item._id == id) {
        setEstimateToAdd({
          ...estimateToAdd,
          customer: id,
        })
        setSelectedCustomer(item);
      }
    })
  };

  const handleItemsAddition = (e, index) => {
    const updatedItemList = itemsToAdd.map((pct, i) => index == i ? Object.assign(pct, {[e.target.name]: e.target.value }) : pct);
    updatedItemList[index].amount = parseInt(updatedItemList[index].quantity)*parseInt(updatedItemList[index].unitCost)
    setItemsToAdd(updatedItemList);
  };

  const removeitem = (e, index) => {
    if(index !== 0){
      const updatedItemList = itemsToAdd.filter((pct, i) => index !== i );
      setItemsToAdd(updatedItemList);
    }
  };

  const addItems = () => {
    setItemsToAdd([...itemsToAdd, {
      item: '',
      description: '',
      unitCost: 0,
      quantity: 0,
      amount: '',
    }]);
  };

  const selectTax = (id) => {
    console.log("Subject#*Subject#*",id);
    if(id=="") {
      setTaxationAmount(0);
    }else{
      tax.forEach((t) => {
        if(t._id === id) {
          setSelectedTax(t);
        }
      })
    }
    
  };
  console.log(estimateToAdd,"estimateToAddestimateToAdd");

  const handleSubmit = async (e) => {
    const estimate = {
      ...estimateToAdd,
      items: itemsToAdd,
      amount: total,
      taxAmount: taxationAmount,
      discount: discount,
      adjustment: adjustment,
      grandTotal: grandTotal,
      discountVarient: {
        discountType: typediscount,
        discountValue: discountValue,
      },
    };
    if (itemsToAdd[0].item == undefined || itemsToAdd[0].item == '') {
      // toast.error('Please Select Customer');
      return;
      
    }
    if (estimateToAdd?.customer== undefined 
      || estimateToAdd?.customer == '') {
      toast.error('Please Select Customer');
      return;
    }
    if (estimateToAdd?.estimateDate== undefined 
      || estimateToAdd?.estimateDate == '') {
      toast.error('Please Select Estimate Date');
      return;
    }
    // if (estimateToAdd?.expiryDate== undefined 
    //   || estimateToAdd?.expiryDate == '') {
    //   toast.error('Please Select expiry Date');
    //   return;
    // }
    if (estimateToAdd?.project== undefined 
      || estimateToAdd?.project == '') {
      toast.error('Please Select Project');
      return;
    }
    
    // if (estimateToAdd?.Tax == undefined 
    //   || estimateToAdd?.Tax  == '') {
    //   toast.error('Please Select Tax');
    //   return;
    // }
    
    if (state?.edit) {
      const response = await toast.promise(
        httpService.put(`/sale-estimate/${state?._id}`, estimate),
        {
          pending: 'Uploading Estimates',
          success: 'Created Estimate successfully',
          error: "couldn't create the estimate, please recheck the details entered"
        }
      )
      if (e.submit) {
        history.push({
          pathname: '/app/apps/email',
          state: {
            id: response?.data?._id,
            subject: `Estimate for order ${response?.data?.estimate}`,
            pdf: response?.data?.pdf_url,
            index: response?.data?.estimate,
            type: 'estimate',
            emailId: response?.data?.customer?.email,
            backTo: -3
          }
        });
        return;
      }
      history.push("/app/sales/estimates")
      return;
    }
    const response = await toast.promise(
      httpService.post('/sale-estimate', estimate),
      {
        pending: 'Uploading Estimates',
        success: 'Created Estimate successfully',
        error: "couldn't create the estimate, please recheck the details entered"
      }
    );
    console.log(e.submit)
    if (e.submit) {
      history.push({
        pathname: '/app/apps/email',
        state: {
          id: response?.data?._id,
          subject: `Estimate for order ${response?.data?.estimate}`,
          pdf: response?.data?.pdf_url,
          index: response?.data?.estimate,
          type: 'estimate',
          emailId: response?.data?.customer?.email,
          backTo: -3
        }
      });
      return;
    }
    
    history.push("/app/sales/estimates")
  }

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Create Estimate </title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col-sm-12">
              <h3 className="page-title">Create Estimate</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Create Estimate</li>
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
                      value={estimateToAdd?.customer || null}
                      onChange={(e) => {
                        selectCustomer(e.target.value)
                      }}
                      className="custom-select"
                    >
                      <option>Select</option>
                      {customer.map((item) => (
                        <option key={item._id} value={item._id}>{item.displayName}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-6 form-group">
                  <label className="text-danger">Estimate#*</label>
                  <input
                    placeholder="EST-0000XX"
                    value={estimateToAdd?.estimate || ""}
                    onChange={(e) => {
                      setEstimateToAdd({
                        ...estimateToAdd,
                        estimate: e.target.value,
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
                  <label>Reference#*</label>
                  <input
                    value={estimateToAdd?.reference || ""}
                    onChange={(e) => {
                      setEstimateToAdd({
                        ...estimateToAdd,
                        reference: e.target.value,
                      });
                    }}
                    className="form-control"
                    type="text"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3">
                  <div className="form-group">
                    <label>
                      Estimate Date <span className="text-danger">*</span>
                    </label>
                    <div>
                      <input
                        value={(estimateToAdd?.estimateDate?.split('T')[0]) || ""}
                        className="form-control"
                        onChange={(e) => {
                          setEstimateToAdd({
                            ...estimateToAdd,
                            estimateDate: e.target.value,
                          });
                        }}
                        type="date"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-sm-3">
                  <div className="form-group">
                    <label>
                      Expiry Date
                    </label>
                    <div>
                      <input
                        value={(estimateToAdd?.expiryDate?.split('T')[0]) || ""}
                        onChange={(e) => {
                          setEstimateToAdd({
                            ...estimateToAdd,
                            expiryDate: e.target.value,
                          });
                        }}
                        className="form-control"
                        type="date"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      Project <span className="text-danger">*</span>
                    </label>
                    <select
                      value={estimateToAdd?.project || null}
                      onChange={(e) => {
                        setEstimateToAdd({
                          ...estimateToAdd,
                          project: e.target.value,
                        });
                      }}
                      className="custom-select"
                    >
                      <option>Select Project</option>
                      {projects.map((project) => (
                        <option key={project._id} value={project._id}>
                          {project.name}
                        </option>
                      ))}
                      <Link to="/app/projects/project_dashboard">
                        <option>
                        + Create Project
                        </option>
                      </Link>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      Employees 
                    </label>
                    <select
                      value={estimateToAdd?.employee || null}
                      onChange={(e) => {
                        setEstimateToAdd({
                          ...estimateToAdd,
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
                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      Tax
                    </label>
                    <select
                      value={estimateToAdd?.tax || null}
                      onChange={(e) => {
                        if(e.target.value == "") {
                          setEstimateToAdd({
                            ...estimateToAdd,
                            tax: undefined,
                          });
                          selectTax(e.target.value)
                        } else {
                          setEstimateToAdd({
                            ...estimateToAdd,
                            tax: e.target.value,
                          });
                          selectTax(e.target.value)
                        }
                        
                      }}
                      className="custom-select"
                    >
                      <option value={""}>Please Select</option>
                      {tax.map((t) => (
                        <option key={t._id} value={t._id}>
                          {`${t.name} ${t.type}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* {!selectedCustomer.shippingAddress && (
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Shipping Address</label>
                      <textarea
                        onChange={(e) => {
                          setEstimateToAdd({
                            ...estimateToAdd,
                            shippingAddress: e.target.value,
                          });
                        }}
                        className="form-control"
                        rows={3}
                        defaultValue={''}
                      />
                    </div>
                  </div>
                )}
                {!selectedCustomer.billingAddress && (
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Billing Address</label>
                      <textarea
                        className="form-control"
                        onChange={(e) => {
                          setEstimateToAdd({
                            ...estimateToAdd,
                            billingAddress: e.target.value,
                          });
                        }}
                        rows={3}
                        defaultValue={''}
                      />
                    </div>
                  </div>
                )} */}
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
                        {
                          itemsToAdd.map((p, index) => (
                            <tr className="text-center" 
                            key={index}
                            >
                              <td>
                                {index+1}
                              </td>
                              <td>
                                <input className="form-control" type="text"
                                name='item'
                                required
                                value={p.item} 
                                onChange={(e) => handleItemsAddition(e, index)}
                                />
                              </td>
                              <td>
                                <input className="form-control" type="text"
                                name='description'
                                value={p.description} 
                                onChange={(e) => handleItemsAddition(e, index)}
                                />
                              </td>
                              <td>
                                <input className="form-control" type="number"
                                name='unitCost'
                                value={p.unitCost} 
                                onChange={(e) => handleItemsAddition(e, index)}
                                />
                              </td>
                              <td>
                                <input className="form-control" type="number" maxLength={10}
                                name='quantity'
                                value={p.quantity} 
                                onChange={(e) => handleItemsAddition(e, index)}
                                />
                              </td>
                              <td>
                                {p?.amount || 0}
                              </td>
                              <td>
                                { index === 0 ? 
                                  <span></span>
                                : 
                                  
                                <div className=""
                                    onClick={(e) => removeitem(e, index)}
                                  ><DeleteForeverIcon /></div>
                                }
                              </td>
                            </tr>
                            )) 
                          }
                      </tbody>
                    </table>
                    <div className="btn btn-primary"
                      onClick={addItems}
                    >+ Add Items</div>

                  </div>
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
                          <td colSpan={5} className="text-right">
                            Tax
                          </td>
                          <td
                            style={{
                              textAlign: 'right',
                              paddingRight: '30px',
                              width: '230px',
                            }}
                          >
                            {taxationAmount || 0}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={2}></td>
                            <td></td>
                            <td  className="text-right">
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
                              {/* </td>
                              <td> */}
                              <select
                                className="custom-select"
                                style={{ width: '180px' }}
                                name="discountType"
                                value={typediscount}
                                onChange={(e) => {
                                  settypediscount(e.target.value);
                                  handleInlineDiscountValue(e.target.value);
                                }}
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
                              value={discount || 0}
                              type="number"
                              readOnly
                              onChange={(e) => {
                                setDiscount(e.target.value)
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
                              className="form-control text-right"
                              value={adjustment || 0}
                              type="number"
                              onChange={(e) => {
                                setAdjustment(e.target.value)
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
                          className="form-control"
                          value={estimateToAdd?.customerNotes || null}
                          rows={4}
                          onChange={(e) => {
                            setEstimateToAdd({
                              ...estimateToAdd,
                              customerNotes: e.target.value
                            })
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
                          value={estimateToAdd?.termsAndConditions || null}
                          rows={4}
                          onChange={(e) => {
                            setEstimateToAdd({
                              ...estimateToAdd,
                              termsAndConditions: e.target.value
                            })
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
                <button onClick={e => handleSubmit({...e, submit: false})} type="submit" value="save" className="btn btn-primary submit-btn">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Page Content */}
    </div>
  );
};

export default CreateEstimate;
