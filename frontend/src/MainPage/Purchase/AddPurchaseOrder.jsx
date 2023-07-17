import { Add, DeleteOutline } from '@mui/icons-material';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createNotify } from '../../features/notify/notifySlice';
import httpService from '../../lib/httpService';

const AddPurchaseOrder = () => {
  const history = useHistory();
  const { state } = useLocation();
  const dispatch = useDispatch();

  const empId = useSelector((state) => state?.authentication?.value?.user?._id);

  const [vendors, setVendors] = useState([]);
  const [vendor, setVendor] = useState(state?.vendorId || "");

  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState(undefined);

  const [purchaseOrderNo, setPurchaseOrderNo] = useState(`PO-${Math.ceil(Math.random() * 100000)}`);
  const [referenceId, setReferenceId] = useState(`RTX-${Math.ceil(Math.random() * 100000)}`);
  const [purchareOrderDate, setPurchaseOrderDate] = useState(moment().format("YYYY-MM-DD"));
  const [expentedDeliveryDate, setExpentedDeliveryDate] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [shipmentPreference, setShipmentPreference] = useState("");
  const [deliveryTo, setDeliveryTo] = useState("Customer");

  const [organisationData, setOrganisationData] = useState({
    name: "KN Multi Projects",
    address: `Plot No 31, 
  Basundhara Complex, Hanspal, 
  Bhubaneshwar, Odisha 752101` });

  // console.log({organisationData});

  // project 
  const [projectList, setProjectList] = useState([]);
  const [projectId, setProjectId] = useState("");
  const fetchProjectList = async () => {
    const { data } = await httpService.get('/project');
    setProjectList(data);
  };

  const [discountType, setDiscountType] = useState("At Transactional Level");

  const transactionTemplate = {
    itemDetails: "",
    account: "",
    quantity: 0,
    unit: "pcs.",
    rate: 0,
    discount: { discountType: "percent", discountValue: 0 },
    amount: 0
  };
  const [transaction, settransaction] = useState([transactionTemplate]);

  const handleSingleTrxAmount = (e, index) => {
    let updatedAmount = 0;
    if (transaction[index].discount.discountType === "percent") {
      let amountWOD = transaction[index].quantity * transaction[index].rate;
      updatedAmount = amountWOD - (amountWOD * transaction[index].discount.discountValue / 100)
    } else if (transaction[index].discount.discountType === "INR") {
      updatedAmount = (transaction[index].quantity * transaction[index].rate) - transaction[index].discount.discountValue
    }
    const updatedTrx = transaction.map((trx, i) => index == i ? Object.assign(trx, { amount: updatedAmount }) : trx);
    settransaction(updatedTrx);
  }

  const [subTotal, setSubTotal] = useState(subTotal || 0);
  const [discount, setDiscount] = useState({
    discountType: "percent",
    discountValue: 0
  });

  const [discountAmount, setDiscountAmount] = useState(0);

  const [taxSystem, setTaxSystem] = useState("TCS");
  const [tcstaxes, settcstaxes] = useState([]);
  const [tcsTax, settcsTax] = useState("");

  const fetchTCSTaxes = async () => {
    const tcsData = await httpService.get('/tax');
    settcstaxes(tcsData.data);
  };

  const [adjustment, setAdjustment] = useState({
    adjustmentName: "Adjustment",
    adjustmentValue: 0
  });

  const [taxType, setTaxType] = useState("");


  const [taxAmount, setTaxAmount] = useState(0);

  const [total, setTotal] = useState(0);

  const [notes, setNotes] = useState("");

  const [termsAndConditions, setTermsAndConditions] = useState("");

  const handletransaction = (e, index) => {
    const updatedTrx = transaction.map((trx, i) => index == i ? Object.assign(trx, { [e.target.name]: e.target.value }) : trx);
    settransaction(updatedTrx);
  }

  const handleInlineDiscountValue = (e, index) => {

    const updatedTrx = transaction.map((trx, i) => {
      if (index == i) {
        let updatedDiscount = { ...trx.discount, [e.target.name]: e.target.value };

        return Object.assign(trx, { discount: updatedDiscount })
      } else {
        return trx
      }
    });

    settransaction(updatedTrx);
  }



  const addtransactionField = () => {
    settransaction([...transaction, transactionTemplate]);
  }

  const removetransactionField = (e, index) => {
    if (index !== 0) {
      const updatedtransaction = transaction.filter((trx, i) => index !== i);
      settransaction(updatedtransaction);
    }

  }

  const handleDiscountTypeRefactor = () => {
    if (discountType === "At Transactional Level") {
      const updatedTrx = transaction.map((trx) => {

        return Object.assign(trx, { discount: { discountType: "percent", discountValue: 0 } })

      });

      settransaction(updatedTrx);

    }

    if (discountType === "At Inline Item Level") {
      setDiscount({
        discountType: "percent",
        discountValue: 0
      });
    }
    const updatedTrxAmount = transaction.map((trx) => {
      return Object.assign(trx, { amount: trx.quantity * trx.rate });
    });
    settransaction(updatedTrxAmount);
    handleSubTotal();

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
    if (discount.discountType === "percent") {

      updatedDiscount = subTotal * (discount.discountValue / 100);

    } else if (discount.discountType === "INR") {
      updatedDiscount = discount.discountValue;
    }
    setDiscountAmount((prev) => updatedDiscount);
    handleGrandTotal();
  }

  // console.log(adjustment.adjustmentValue);

  let handleTaxAmount = () => {

    if (taxSystem === "TCS") {

      if (tcsTax) {
        const taxObj = tcstaxes.filter(t => t?._id == tcsTax)[0];
        // console.log(taxObj)
        let updatedAmount = subTotal - discountAmount + Number(adjustment.adjustmentValue);
        console.log(updatedAmount, taxObj, subTotal, discountAmount, adjustment.adjustmentValue, "adjustment.adjustmentValue")
        let updatedTaxAmount = updatedAmount * (Number(taxObj?.amount) / 100);
        // console.log(updatedTaxAmount)
        setTaxAmount(Number(updatedTaxAmount));
      } else {
        setTaxAmount(0);
      }
    }

    handleGrandTotal()
  }


  const handleGrandTotal = () => {
    // if(discountAmount==undefined) {
    //   setDiscountAmount(0);
    // }
    console.log(discountAmount, "taxAmount");
    let grandTotal = subTotal - discountAmount + taxAmount + Number(adjustment.adjustmentValue);
    setTotal(grandTotal);
  }

  const fetchVendors = async () => {
    const res = await httpService.get(`/vendor`);
    setVendors(res.data);
  };

  const fetchCustomers = async () => {
    const res = await httpService.get('/customer');
    setCustomers(res.data);
  }

  useEffect(() => {
    // console.log(state);
    if (state?.edit) {
      const {
        vendorId,
        projectId,
        deliveryTo,
        organisationData,
        customerId,
        purchaseOrderNo,
        referenceId,
        purchareOrderDate,
        expentedDeliveryDate,
        paymentTerms,
        shipmentPreference,
        discountType,
        transaction,
        subTotal,
        discount,
        discountAccount,
        discountAmount,
        adjustment,
        taxSystem,
        tcsTax,
        taxType,
        taxAmount,
        total,
        notes,
        termsAndConditions,
        status,
        billedStatus
      } = state?.pOData;

      setVendor(vendorId?._id);
      setProjectId(projectId?._id);
      setDeliveryTo(deliveryTo);
      // setOrganisationData({ ...organisationData });
      setCustomer(customerId?._id);
      setPurchaseOrderNo(purchaseOrderNo);
      setReferenceId(referenceId);
      setPurchaseOrderDate(purchareOrderDate?.split("T")[0]);
      setExpentedDeliveryDate(expentedDeliveryDate?.split("T")[0]);

      setPaymentTerms(paymentTerms);
      setShipmentPreference(shipmentPreference);
      setDiscountType(discountType);
      settransaction([...transaction]);
      setSubTotal(subTotal);
      setDiscount({ ...discount });
      setDiscountAmount(discountAmount);
      setTaxSystem(taxSystem);
      settcsTax(tcsTax);
      setTaxType(taxType);
      setTaxAmount(taxAmount);
      setAdjustment({ ...adjustment });
      setTotal(total);
      setTermsAndConditions(termsAndConditions);
      setNotes(notes);
    }
    // handleTaxAmount()
  }, []);

  useEffect(() => {
    fetchVendors();
    fetchCustomers();
    fetchProjectList();
    fetchTCSTaxes()
  }, []);

  useEffect(() => {
    handleTrxDiscountValue();
  }, [subTotal, discount]);

  useEffect(() => {
    if (taxType !== "") {
      handleTaxAmount()
    }
  }, [taxSystem, adjustment]);

  useEffect(() => {
    handleGrandTotal()
  }, [subTotal, discount, taxSystem, discountType]);


  useEffect(() => {
    handleSubTotal();
    handleGrandTotal();
    handleTaxAmount();
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!vendor) {
      toast.error("Select Vendor");
      return;
    }

    if (!projectId) {
      toast.error("Select Project");
      return;
    }

    const purchaseOrderData = {
      vendorId: vendor,
      projectId,
      deliveryTo,
      purchaseOrderNo,
      referenceId,
      purchareOrderDate,
      expentedDeliveryDate,
      paymentTerms,
      shipmentPreference,
      discountType,
      transaction,
      subTotal,
      discount,
      discountAccount: "",
      discountAmount,
      adjustment,
      taxSystem,
      tcsTax: tcsTax == "" ? undefined : tcsTax,
      taxType,
      taxAmount,
      total,
      notes,
      termsAndConditions,
      status: "ISSUED",
      billedStatus: ""
    }

    if (purchaseOrderData?.deliveryTo == "Customer") {
      purchaseOrderData.customerId = customer;
    } else {
      purchaseOrderData.organisationData = organisationData;
    }

    // console.log(purchaseOrderData);

    if (state?.edit) {

      toast
        .promise(
          httpService.put(`/vendortrx/updatepurchaseorder/${state?.pOData?._id}`, purchaseOrderData),
          {
            error: 'Failed to update purchase order',
            success: 'Purchase Order updated successfully',
            pending: 'Updating vendor Purchase Order...',
          }
        )
        .then((res) => {
          dispatch(createNotify({
            notifyHead: `Purchase Order ${res?.data?.purchaseOrderNo}`,
            notifyBody: `Purchase Order ${res?.data?.purchaseOrderNo} got updated`,
            createdBy: empId
          }))
          history.goBack()
        });
      document.querySelectorAll('.close')?.forEach((e) => e.click());

    } else {

      toast
        .promise(
          httpService.post(`/vendortrx/createpurchaseorder`, purchaseOrderData),
          {
            error: 'Failed to create purchase order',
            success: 'Purchase Order created successfully',
            pending: 'Building vendor Purchase Order...',
          }
        )
        .then((res) => {
          dispatch(createNotify({
            notifyHead: `Purchase Order ${res?.data?.purchaseOrderNo}`,
            notifyBody: `Purchase Order ${res?.data?.purchaseOrderNo} got created`,
            createdBy: empId
          }))
          history.goBack()
        });
      document.querySelectorAll('.close')?.forEach((e) => e.click());

    }

  }
  // console.log(organisationData,"organisationDat11a");
  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Purchase Order</title>
        <meta name="description" content="Add Purchase Order" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col">
              <h3 className="page-title">Purchase Order</h3>
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
                      Vendor <span className="text-danger">*</span>
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
                <div className="col-sm-6 col-md-6">
                  <div className="form-group">
                    <label>
                      Project Name <span className="text-danger">*</span>
                    </label>
                    <select className="custom-select" name="project"
                      value={projectId}
                      onChange={(e) => { setProjectId(e.target.value) }}
                      required
                    >
                      <option selected>Please Select</option>
                      {projectList.length && projectList.map((p) => (
                        <option value={p._id}>{p.name}</option>
                      ))}

                    </select>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6 col-md-6">
                  <div className="form-group d-flex">
                    <label className='mr-5'>
                      Deliver To <span className="text-danger">*</span>
                    </label>
                    <div className='d-flex'>
                      <div class="form-check  mr-3">
                        <input class="form-check-input" type="radio" name="DeliverType"
                          value={"Customer"}
                          onChange={(e) => setDeliveryTo(e.target.value)}
                          checked={deliveryTo === "Customer"}
                        />
                        <label class="form-check-label">
                          Customer
                        </label>
                      </div>
                      <div class="form-check">
                        <input class="form-check-input" type="radio" name="DeliverType"
                          value={"Organisation"}
                          onChange={(e) => setDeliveryTo(e.target.value)}
                          checked={deliveryTo === "Organisation"}
                        />
                        <label class="form-check-label">
                          Organisation
                        </label>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              {deliveryTo === "Organisation" &&
                <div className="row">
                  <div className="col-sm-6 col-md-6">
                    <div className="form-group">
                      <input type="text"
                        name="organisationData"
                        value={organisationData?.name}
                        onChange={(e) => setOrganisationData({ ...organisationData, name: e.target.value })}
                        // onChange={(e) => setPurchaseOrderNo(e.target.value)}
                        className='form-control' placeholder='Name' disabled />
                      <textarea name="" id="" cols="30" rows="5"
                        value={organisationData?.address}
                        onChange={(e) => setOrganisationData({ ...organisationData, address: e.target.value })}
                        className="form-control" placeholder='Address' disabled></textarea>
                    </div>
                  </div>
                </div>
              }
              {deliveryTo === "Customer" &&

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
                </div>
              }
              <div className="row">
                <div className="col-sm-6 col-md-6">
                  <div className="form-group">
                    <label>
                      Purchase Order# <span className="text-danger">*</span>
                    </label>
                    <input type="text"
                      name="purchaseOrderNo"
                      value={purchaseOrderNo}
                      disabled
                      onChange={(e) => setPurchaseOrderNo(e.target.value)}
                      className='form-control' />
                  </div>
                </div>
                <div className="col-sm-6 col-md-6">
                  <div className="form-group">
                    <label>
                      Reference#
                    </label>
                    <input type="text"
                      name="reference"
                      value={referenceId}
                      onChange={(e) => setReferenceId(e.target.value)}
                      disabled
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
                      name="purchareOrderDate"
                      value={purchareOrderDate}
                      onChange={(e) => setPurchaseOrderDate(e.target.value)}
                      className='form-control' required />
                  </div>
                </div>
                <div className="col-sm-6 col-md-3">
                  <div className="form-group">
                    <label>
                      Expected Delivery Date
                    </label>
                    <input type="date"
                      name="expentedDeliveryDate"
                      value={expentedDeliveryDate}
                      onChange={(e) => setExpentedDeliveryDate(e.target.value)}
                      className='form-control' required />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="col-form-label"> Payment Terms</label>
                    <select className="custom-select" name="paymentTerms"
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                    >
                      <option value=""></option>
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
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="col-form-label">Shipment Preference</label>
                    <input type="text" name="shipmentPreference"
                      value={shipmentPreference}
                      onChange={(e) => setShipmentPreference(e.target.value)}
                      className="form-control" />
                  </div>
                </div>
              </div>
              {/* Transaction  */}
              <div className="row">
                <div className="col-sm-6 col-md-4">
                  <div className="form-group">
                    <label>
                      Discount Type
                    </label>
                    <select className="custom-select" name="discountType" value={discountType}
                      onChange={(e) => setDiscountType(e.target.value)}
                      onBlur={() => {
                        handleDiscountTypeRefactor();
                        handleGrandTotal();
                      }}
                    >
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
                          <th style={{ minWidth: '200px' }}>ITEM DETAILS<span className="text-danger">*</span></th>
                          <th style={{ minWidth: '150px' }}>ACCOUNT</th>
                          <th style={{ minWidth: '50px' }}>QUANTITY</th>
                          <th style={{ minWidth: '50px' }}>UNIT</th>
                          <th style={{ width: '150px' }}>RATE</th>
                          {discountType === "At Inline Item Level" &&
                            <th style={{ width: '150px' }}>DISCOUNT</th>
                          }

                          <th style={{ width: '150px' }}>AMOUNT</th>
                          <th style={{ width: '50px' }}>DELETE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transaction.map((trx, index) => (

                          <tr>
                            <td>
                              <input
                                className="form-control"
                                type="text"
                                style={{ minWidth: '150px' }}
                                name='itemDetails'
                                value={trx.itemDetails}
                                onChange={(e) => handletransaction(e, index)}
                                required
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
                                style={{ minWidth: '120px' }}
                                type="number"
                                name='quantity'
                                value={trx.quantity}
                                onChange={(e) => {
                                  handletransaction(e, index);
                                  handleSingleTrxAmount(e, index);
                                }}
                                onBlur={handleSubTotal}
                              />
                            </td>
                            <td>
                              <select className="custom-select" style={{ width: '100px' }}
                                name="unit"
                                value={trx?.unit}
                                onChange={(e) => { handletransaction(e, index); }}
                              >
                                {["pcs.", "ton", "kg", "g", "mg", "ltr.", "ml"].map((u, i) => (
                                  <option key={i} value={u}>{u}</option>

                                ))}

                              </select>
                            </td>
                            <td>
                              <input
                                className="form-control"
                                style={{ minWidth: '160px' }}
                                type="number"
                                name='rate'
                                value={trx.rate}
                                onChange={(e) => {
                                  handletransaction(e, index);
                                  handleSingleTrxAmount(e, index);
                                }}
                                onBlur={handleSubTotal}
                              />
                            </td>
                            {discountType === "At Inline Item Level" &&
                              <td className='d-flex align-items-center'>
                                <input
                                  className="form-control flex-2"
                                  style={{ width: '80px' }}
                                  type="number"
                                  name="discountValue"
                                  value={trx.discount.discountValue}
                                  onChange={(e) => {
                                    handleInlineDiscountValue(e, index);
                                    handleSingleTrxAmount(e, index)
                                  }}
                                  // onBlur={(e) => handleSingleTrxAmount(e, index)}
                                  onBlur={handleSubTotal}
                                />
                                <select className="custom-select" style={{ width: '60px' }}
                                  name="discountType"
                                  value={trx.discount.discountType}
                                  onChange={(e) => {
                                    handleInlineDiscountValue(e, index);
                                    handleSingleTrxAmount(e, index)
                                  }}
                                  // onBlur={(e) => handleSingleTrxAmount(e, index)}
                                  onBlur={handleSubTotal}
                                >
                                  <option value="percent">%</option>
                                  <option value="INR">&#x20B9;</option>
                                </select>
                              </td>
                            }
                            <td>
                              <input type="number" className="form-control"
                                style={{ minWidth: '160px' }}
                                name='amount'
                                value={trx.amount}
                                onChange={(e) => handletransaction(e, index)}
                                disabled
                              />
                            </td>
                            <td className='text-center'>
                              {index !== 0 &&
                                <DeleteOutline onClick={(e) => removetransactionField(e, index)} />
                              }
                            </td>
                          </tr>
                        ))}
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
                    {discountType === "At Transactional Level" &&
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
                            onChange={(e) => {
                              setDiscount({ ...discount, discountValue: e.target.value });
                            }}
                            onBlur={handleTrxDiscountValue}
                          />
                          <select className="custom-select" style={{ width: '60px' }}
                            name='discountType'
                            value={discount.discountType}
                            onChange={(e) => {
                              setDiscount({ ...discount, discountType: e.target.value });
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
                    }

                    {taxSystem === "TCS" &&
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                          <input type="text" className="form-control" name='adjustmentName' value={adjustment.adjustmentName}
                            onChange={(e) => setAdjustment({ ...adjustment, adjustmentName: e.target.value })}
                          />
                        </td>
                        <td>
                          <input type="number" className="form-control text-right"
                            name='adjustmentValue' value={adjustment.adjustmentValue}
                            onChange={(e) => setAdjustment({ ...adjustment, adjustmentValue: e.target.value })}
                          />
                        </td>
                        <td
                          style={{
                            textAlign: 'right',
                            paddingRight: '30px',
                            width: '230px',
                          }}
                        >
                          <input type="number" className="form-control text-right" value={adjustment.adjustmentValue} disabled />
                        </td>
                      </tr>
                    }
                    <tr>
                      <td />
                      <td />
                      <td />
                      <td className='d-flex'>
                        {/* <div class="form-check mr-3">
                            <input class="form-check-input" type="radio" name="taxSystem" id="exampleRadios1" value="option1"
                              onClick={(e) => { setTaxSystem("TDS");
                              setAdjustment({ ...adjustment, adjustmentValue : 0 });
                              }}
                            checked={taxSystem === "TDS"}
                              
                            />
                            <label class="form-check-label" for="exampleRadios1">
                              TDS
                            </label>
                          </div> */}
                        <div class="form-check">
                          <input class="form-check-input" type="radio" name="taxSystem" id="exampleRadios2" value="option2"
                            onClick={(e) => {
                              setTaxSystem("TCS");
                              setAdjustment({ ...adjustment, adjustmentValue: 0 });
                            }}
                            defaultChecked={taxSystem === "TCS"}

                          />
                          <label class="form-check-label" for="exampleRadios2">
                            TCS
                          </label>
                        </div>
                      </td>
                      <td>
                        <select className="custom-select"
                          name="tcsTax"
                          style={{ maxWidth: '250px' }}
                          value={tcsTax}
                          onChange={(e) => {
                            settcsTax(e.target.value);

                          }}
                          onBlur={handleTaxAmount}
                        >
                          <option value=""></option>
                          {tcstaxes.map((tcsItem) => (
                            <option key={tcsItem?._id} value={tcsItem?._id}>
                              {`${tcsItem?.name} - ${tcsItem?.amount}%`}
                            </option>
                          ))}
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
                          defaultValue={0}
                          readOnly
                          type="number"
                          name='taxAmount'
                          value={taxAmount}
                        />
                      </td>
                    </tr>
                    {taxSystem === "TDS" &&
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                          <input type="text" className="form-control" name='adjustmentName' value={adjustment.adjustmentName}
                            onChange={(e) => setAdjustment({ ...adjustment, adjustmentName: e.target.value })}
                          />
                        </td>
                        <td>
                          <input type="number" className="form-control text-right"
                            name='adjustmentValue' value={adjustment.adjustmentValue}
                            onChange={(e) => setAdjustment({ ...adjustment, adjustmentValue: e.target.value })}
                          />
                        </td>
                        <td style={{ paddingRight: '30px', }}>
                          <input type="number" className="form-control text-right" value={adjustment.adjustmentValue} disabled />
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
                  <label htmlFor="">Customer Notes</label>
                  <textarea name="notes" id="" cols="60" rows="2" className="form-control"
                    value={notes} onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <br />
              <div className="row d-flex justify-content-start">
                <div className='ml-5'>
                  <label htmlFor="">Terms and Conditions</label>
                  <textarea name="termsAndConditions" id="" cols="100" rows="5" className="form-control"
                    value={termsAndConditions} onChange={(e) => setTermsAndConditions(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <br />
              <div className="row">
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

export default AddPurchaseOrder