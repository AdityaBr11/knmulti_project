import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useHistory, useLocation } from 'react-router-dom';
import httpService from '../../../lib/httpService';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { toast } from 'react-toastify';

const CreateDeliveryChallan = () => {
  const [customer, setCustomer] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [challanToAdd, setChallanToAdd] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [itemsToAdd, setItemsToAdd] = useState([
    {
      item: '',
      description: '',
      unitCost: 0,
      quantity: 0,
      amount: '',
    },
  ]);
  const [total, setTotal] = useState(0)

  const history = useHistory()
  const { state } = useLocation()

  useEffect(async () => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }
    fetchCustomers()
  }, []);

  useEffect(() => {
    let newTotal = 0;
    itemsToAdd.forEach((item) => {
      newTotal = newTotal + parseInt(item.amount)
    })
    setTotal(newTotal);
  }, [itemsToAdd]);

  useEffect(() => {
    setGrandTotal(total-discount)
  }, [total, discount]);

  useEffect(() => {
    if (state?.edit) {
      const {
        amount,
        challanDate,
        challanType,
        customer,
        customerNotes,
        deliveryChallan,
        discount,
        grandTotal,
        items,
        reference,
        termsAndConditions,
      } = state;
      setChallanToAdd({
        amount,
        challanDate,
        challanType,
        customer,
        customerNotes,
        deliveryChallan,
        discount,
        grandTotal,
        items,
        reference,
        termsAndConditions,
      });
      setItemsToAdd(items);
      setDiscount(discount);
    }
  }, [])

  const fetchCustomers = async () => {
    const customers = await httpService.get('/customer');
    setCustomer(customers.data);
  };

  const selectCustomer = (id) => {
    customer.forEach((item) => {
      if(item._id === id) {
        setChallanToAdd({
          ...challanToAdd,
          customer: id
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

  const handleSubmit = async (e) => {
    const deliveryChallan = {
      ...challanToAdd,
      items: itemsToAdd,
      amount: total,
      discount: discount,
      grandTotal: grandTotal
    };
    if (state?.edit) {
      const response = await toast.promise(
        httpService.put(`/deliverychallan/${state._id}`, deliveryChallan),
        {
          pending: 'Creating Delovery Challan',
          success: 'Delivery Challan created',
          error: "Couldn't create Delivery Challan, recheck the details entered",
        }
      );
      console.log(response)
      if (e.submit) {
        history.push({
          pathname: '/app/apps/email',
          state: {
            id: response?.data?._id,
            subject: `Details of Delivery Challan ${response?.data?.deliveryChallan}`,
            pdf: response?.data?.pdf_url,
            index: response?.data?.deliveryChallan,
            type: 'delivery-challan'
          }
        })
        return;
      }
      history.push('/app/sales/deliverychallan')
      return;
    }
    const response = await toast.promise(
      httpService.post('/deliverychallan', deliveryChallan),
      {
        pending: 'Creating Delovery Challan',
        success: 'Delivery Challan created',
        error: "Couldn't create Delivery Challan, recheck the details entered",
      }
    );
    if (e.submit) {
      history.push({
        pathname: '/app/apps/email',
        state: {
          id: response?.data?._id,
          subject: `Details of Delivery Challan ${response?.data?.deliveryChallan}`,
          pdf: response?.data?.pdf_url,
          index: response?.data?.deliveryChallan,
          type: 'delivery-challan'
        }
      })
    }
    history.push('/app/sales/deliverychallan')
  }

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>New Delivery Challan</title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col-sm-12">
              <h3 className="page-title">New Delivery Challan</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">New Delivery Challan</li>
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
                      value={challanToAdd?.customer?._id || null}
                      onChange={(e) => {
                        selectCustomer(e.target.value)
                      }}
                      className="custom-select"
                    >
                      <option selected value="select">Select</option>
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
                  <label className="text-danger">Delivery Challan#*</label>
                  <input
                    value={challanToAdd?.deliveryChallan || null}
                    placeholder="DC-000XX"
                    onChange={(e) => {
                      setChallanToAdd({
                        ...challanToAdd,
                        deliveryChallan: e.target.value,
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
                    value={challanToAdd?.reference || null}
                    onChange={(e) => {
                      setChallanToAdd({
                        ...challanToAdd,
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
                    <label className="text-danger">
                      Delivery Challan Date*
                    </label>
                    <div>
                      <input
                        value={challanToAdd?.challanDate?.split('T')[0] || null}
                        className="form-control"
                        onChange={(e) => {
                          setChallanToAdd({
                            ...challanToAdd,
                            challanDate: e.target.value,
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
                  <label className="text-danger">
                    Challan Type*
                  </label>
                  <select
                    value={challanToAdd?.challanType || null}
                    onChange={(e) => {
                      setChallanToAdd({
                        ...challanToAdd,
                        challanType: e.target.value,
                      });
                    }}
                    className="custom-select"
                  >
                    <option>Please Select</option>
                    {['Supply of Liquid Gas', 'Job Work', 'Supply on Approval', 'Others'].map((item) => (
                      <option key={item} value={item}>{item}</option>
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
                                {p.amount || 0}
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
                          <td colSpan={5} className="text-right">
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
                              value={discount || 0}
                              className="form-control text-right"
                              type="number"
                              onChange={(e) => {
                                setDiscount(e.target.value)
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
                          rows={4}
                          value={challanToAdd?.customerNotes || null}
                          onChange={(e) => {
                            setChallanToAdd({
                              ...challanToAdd,
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
                          rows={4}
                          value={challanToAdd?.termsAndConditions || null}
                          onChange={(e) => {
                            setChallanToAdd({
                              ...challanToAdd,
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

export default CreateDeliveryChallan;
