import { Add, DeleteOutline } from '@mui/icons-material';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createNotify } from '../../../../features/notify/notifySlice';
import httpService from '../../../../lib/httpService';

const VendorBill = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const history = useHistory();

  const dispatch = useDispatch();

  const empId = useSelector((state) => state?.authentication?.value?.user?._id);

  const [vendors, setVendors] = useState([]);
  const [name, setName] = useState(id || state?.vendorId || '');
  const [billNo, setBillNo] = useState(
    `BL-${Math.ceil(Math.random() * 100000)}`
  );
  const [orderNo, setOrderNo] = useState(
    `OD-${Math.ceil(Math.random() * 100000)}`
  );
  const [billDate, setBillDate] = useState(moment().format('YYYY-MM-DD'));
  const [dueDate, setDueDate] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');

  const [fileInfos, setFileInfos] = useState([]);

  const [discountType, setDiscountType] = useState('At Transactional Level');

  const [customers, setCustomers] = useState([]);

  // project
  const [projectList, setProjectList] = useState([]);
  const [projectId, setProjectId] = useState('');
  const fetchProjectList = async () => {
    const { data } = await httpService.get('/project');
    setProjectList(data);
  };

  const transactionTemplate = {
    itemDetails: '',
    account: '',
    quantity: 0,
    unit: 'pcs.',
    rate: 0,
    discount: { discountType: 'percent', discountValue: 0 },
    customerDetails: undefined,
    amount: 0,
  };
  const [transaction, settransaction] = useState([transactionTemplate]);

  const handleSingleTrxAmount = (e, index) => {
    let updatedAmount = 0;
    if (transaction[index].discount.discountType === 'percent') {
      let amountWOD = transaction[index].quantity * transaction[index].rate;
      updatedAmount =
        amountWOD -
        (amountWOD * transaction[index].discount.discountValue) / 100;
    } else if (transaction[index].discount.discountType === 'INR') {
      updatedAmount =
        transaction[index].quantity * transaction[index].rate -
        transaction[index].discount.discountValue;
    }
    const updatedTrx = transaction.map((trx, i) =>
      index == i ? Object.assign(trx, { amount: updatedAmount }) : trx
    );
    settransaction(updatedTrx);
  };

  const [subTotal, setSubTotal] = useState(subTotal || 0);
  const [discount, setDiscount] = useState({
    discountType: 'percent',
    discountValue: 0,
  });


  const [ discountAmount, setDiscountAmount ] = useState(0);

  const [ taxSystem, setTaxSystem ] = useState("TDS");

  const [tcstaxes, settcstaxes] = useState([]);
  const [tcsTax, settcsTax] = useState("");

  const fetchTCSTaxes = async () => {
    const tcsData = await httpService.get('/tax');
    settcstaxes(tcsData.data);
  };

  const [ adjustment, setAdjustment ] = useState({
    adjustmentName: "Adjustment",
    adjustmentValue: 0
  });

  const [taxType, setTaxType] = useState('');

  const [taxAmount, setTaxAmount] = useState(0);

  const [total, setTotal] = useState(0);

  const [notes, setNotes] = useState('');

  const handletransaction = (e, index) => {
    const updatedTrx = transaction.map((trx, i) =>
      index == i ? Object.assign(trx, { [e.target.name]: e.target.value }) : trx
    );
    settransaction(updatedTrx);
  };

  const handleInlineDiscountValue = (e, index) => {
    const updatedTrx = transaction.map((trx, i) => {
      if (index == i) {
        let updatedDiscount = {
          ...trx.discount,
          [e.target.name]: e.target.value,
        };

        return Object.assign(trx, { discount: updatedDiscount });
      } else {
        return trx;
      }
    });

    settransaction(updatedTrx);
  };

  const addtransactionField = () => {
    settransaction([...transaction, transactionTemplate]);
  };

  const removetransactionField = (e, index) => {
    if (index !== 0) {
      const updatedtransaction = transaction.filter((trx, i) => index !== i);
      settransaction(updatedtransaction);
    }
  };

  const handleSubTotal = () => {
    let finalSubTotal = transaction.reduce((acc, curr) => {
      acc = acc + curr.amount;

      return acc;
    }, 0);
    setSubTotal(finalSubTotal);
    handleGrandTotal();
  };

  let handleTrxDiscountValue = () => {
    let updatedDiscount;
    if (discount.discountType === 'percent') {
      updatedDiscount = subTotal * (discount.discountValue / 100);
    } else if (discount.discountType === 'INR') {
      updatedDiscount = discount.discountValue;
    }
    setDiscountAmount((prev) => updatedDiscount);
    handleGrandTotal();
  };

  // console.log(adjustment.adjustmentValue);

  let handleTaxAmount = () => {
      if(taxSystem === "TCS"){
        if(tcsTax){
          setTaxType("");
          const taxObj = tcstaxes.filter(t => t?._id == tcsTax)[0];
          // console.log(taxObj)
          let updatedAmount = subTotal - discountAmount + Number(adjustment.adjustmentValue);
          // console.log(updatedAmount)
          let updatedTaxAmount = updatedAmount * (Number(taxObj?.amount)/100);
          // console.log(updatedTaxAmount)
          setTaxAmount(Number(updatedTaxAmount));
        } else {
          setTaxAmount(0);
        }
      } else {
        if(taxType !== ""){
          settcsTax("");
          let updatedAmount = subTotal - discountAmount;
    
          let str = taxType;
          str = str?.split(" ").reverse()
          str = str[1].slice(1, );
          str = (+ str);
          // console.log(str)
    
          let updatedTaxAmount = updatedAmount * (str/100);
          setTaxAmount(updatedTaxAmount);

        } else{
          setTaxAmount(0);
        }
      }
    
    handleGrandTotal()
  }

  const handleGrandTotal = () => {
    let grandTotal = 0;
    if(taxSystem === "TCS"){
      grandTotal = subTotal - discountAmount + taxAmount + Number(adjustment.adjustmentValue);
    } else{
      grandTotal = subTotal - discountAmount - taxAmount + Number(adjustment.adjustmentValue);
    }
    setTotal(grandTotal);
  };

  const fetchVendors = async () => {
    
    const res = await httpService.get(`/vendor`);
    // const res = await httpService.get(`/vendor?vendorType=${"supplier"}`);
    setVendors(res.data);
  };

  const fetchCustomers = async () => {
    const res = await httpService.get('/customer');
    setCustomers(res.data);
  };

  const handleDiscountTypeRefactor = () => {
    if (discountType === 'At Transactional Level') {
      const updatedTrx = transaction.map((trx) => {
        return Object.assign(trx, {
          discount: { discountType: 'percent', discountValue: 0 },
        });
      });

      settransaction(updatedTrx);
    }

    if (discountType === 'At Inline Item Level') {
      setDiscount({
        discountType: 'percent',
        discountValue: 0,
      });
    }
    const updatedTrxAmount = transaction.map((trx) => {
      return Object.assign(trx, { amount: trx.quantity * trx.rate });
    });
    settransaction(updatedTrxAmount);
    handleSubTotal();
  };

  useEffect(() => {
    if (state?.edit) {
      const {
        vendorId,
        projectId,
        billNo,
        orderNo,
        billDate,
        dueDate,
        paymentTerms,
        discountType,
        transaction,
        subTotal,
        discount,
        discountAccount,
        discountAmount,
        taxSystem,
        taxType,
        tcsTax,
        taxAmount,
        adjustment,
        total,
        balanceDue,
        status,
        notes,
      } = state?.BillData;
      setName(vendorId?._id);
      setProjectId(projectId?._id);
      setBillNo(billNo);
      setOrderNo(orderNo);
      setBillDate(billDate?.split('T')[0]);
      setDueDate(dueDate?.split('T')[0]);
      setPaymentTerms(paymentTerms);
      setDiscountType(discountType);
      settransaction([...transaction]);
      setSubTotal(subTotal);
      setDiscount({ ...discount });
      setDiscountAmount(discountAmount);
      setTaxSystem(taxSystem);
      setTaxType(taxType);
      settcsTax(tcsTax);
      setTaxAmount(taxAmount);
      setAdjustment({ ...adjustment });
      setTotal(total);
      setNotes(notes);
    }
    // handleTaxAmount();
  }, []);

  useEffect(() => {
    if (state?.pOConversion) {
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
      taxType,
      tcsTax,
      taxAmount,
      total,
      notes,
      termsAndConditions,
      status,
      billedStatus,
      fileInfos
      } = state?.pOData;

      setName(vendorId?._id);
      setProjectId(projectId?._id);
      setOrderNo(purchaseOrderNo);
      setPaymentTerms(paymentTerms);
      setDiscountType(discountType);
      settransaction([...transaction]);
      setSubTotal(subTotal);
      setDiscount({ ...discount });
      setDiscountAmount(discountAmount);
      setTaxSystem(taxSystem);
      setTaxType(taxType);
      settcsTax(tcsTax);
      setTaxAmount(taxAmount);
      setAdjustment({ ...adjustment });
      setTotal(total);
    }
  }, []);

  useEffect(() => {
    if (state?.convertRecurring) {
      const {
      vendorId,
      projectId,
      billStartDate,
      paymentTerms,
      discountType,
      transaction,
      subTotal,
      discount,
      discountAccount,
      discountAmount,
      adjustment,
      taxSystem,
      taxType,
      tcsTax,
      taxAmount,
      total,
      notes,
      } = state?.recurringBillData;

      setName(vendorId?._id);
      setProjectId(projectId?._id);
      setBillDate(billStartDate?.split('T')[0]);
      setPaymentTerms(paymentTerms);
      setDiscountType(discountType);
      settransaction([...transaction]);
      setSubTotal(subTotal);
      setDiscount({ ...discount });
      setDiscountAmount(discountAmount);
      setTaxSystem(taxSystem);
      setTaxType(taxType);
      settcsTax(tcsTax);
      setTaxAmount(taxAmount);
      setAdjustment({ ...adjustment });
      setTotal(total);
    }
  }, []);

  useEffect(() => {
    fetchVendors();
    fetchCustomers();
    fetchProjectList();
    fetchTCSTaxes();
  }, []);

  useEffect(() => {
    handleTrxDiscountValue();
  }, [subTotal, discount]);

  useEffect(() => {
    if (taxType !== '') {
      handleTaxAmount();
    }
  }, [taxSystem, adjustment]);

  useEffect(() => {
    handleGrandTotal();
  }, [subTotal, discount, taxSystem, discountType]);

  useEffect(() => {
    handleSubTotal();
    handleGrandTotal();
    handleTaxAmount();
  });

  // const handleStock = async (updatedBillData) => {

  //   if(updatedBillData?.transaction?.length){
  //     let billtrx = updatedBillData?.transaction;
  //     let updatedBilltrx = billtrx?.map(bt => {
  //       const upbt = {
  //         itemDetails: bt.itemDetails,
  //         stockNo: `STK-${Math.ceil(Math.random()*100000)}`,
  //         quantity: bt?.quantity,
  //         leftQuantity: bt?.quantity,
  //         unit: bt?.unit,
  //         vendorId: updatedBillData?.vendorId,
  //         billId: updatedBillData?._id,
  //         date: updatedBillData?.billDate,
  //         projectId: updatedBillData?.projectId
  //       }
  //       return upbt;
  //     });

  //     // const updtedBillWithTrx = { ...updatedBillData, transaction : updatedBilltrx }
  //     // setBillData(updtedBillWithTrx);

  //     const ustockData = [ ...updatedBilltrx ]
  //     const res = await httpService.post('/stock/billstock', ustockData);
  //     await toast.success("Stock added");
  //   }
  //   return;
  // }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name) {
      toast.error('Select Vendor');
      return;
    }
    if (!projectId) {
      toast.error('Select Project');
      return;
    }

    if(tcsTax == ""){
      settcsTax(undefined)
    }

    let billFinalData = {
      vendorId: name,
      projectId,
      billNo,
      orderNo,
      billDate,
      dueDate,
      paymentTerms,
      discountType,
      transaction,
      subTotal: subTotal,
      discount,
      discountAccount: '',
      discountAmount,
      taxSystem,
      taxType,
      tcsTax : tcsTax == "" ? undefined : tcsTax,
      taxAmount,
      adjustment,
      total,
      balanceDue: total,
      status: 'OPEN',
      notes,
    };

    // console.log({ billFinalData });
    if (state?.edit) {
      let bal = total - state?.BillData?.credit + state?.BillData?.payments;
      toast
        .promise(
          httpService.put(
            `/vendortrx/updatevendorbill/${state?.BillData?._id}`,
            {
              ...billFinalData,
              balanceDue: bal,
              status: state?.BillData?.status,
            }
          ),
          {
            error: 'Failed to update bill',
            success: 'Bill updated successfully',
            pending: 'Updating vendor bill...',
          }
        )
        .then((res) => {
          dispatch(
            createNotify({
              notifyHead: `Bill ${res?.data?.billNo || billFinalData?.billNo}`,
              notifyBody: `Bill ${
                res?.data?.billNo || billFinalData?.billNo
              } got updated`,
              createdBy: empId,
            })
          );
          history.goBack();
        });
      document.querySelectorAll('.close')?.forEach((e) => e.click());
    } else {

        toast
          .promise(
            httpService.post(`/vendortrx/createvendorbill`, billFinalData),
            {
              error: 'Failed to create bill',
              success: 'Bill created successfully',
              pending: 'Building vendor bill...',
            }
          )
          .then((res) => {
            // console.log("Hello1")
            // handleStock(res?.data);
            if(state?.pOConversion){
              return httpService.put(`/vendortrx/updatepurchaseorder/${state?.pOData?._id}`, { status : "CLOSED", billedStatus: "BILLED", billInfo: res?.data?._id });
            } else{
              dispatch(createNotify({
                notifyHead: `Bill ${res?.data?.billNo || billFinalData?.billNo}`,
                notifyBody: `Bill ${res?.data?.billNo || billFinalData?.billNo} got created`,
                createdBy: empId
              }))
              history.goBack()
            }
            return;
          })
          .then((res) => { 
          dispatch(createNotify({
            notifyHead: `Bill ${res?.data?.billNo || billFinalData?.billNo}`,
            notifyBody: `Bill ${res?.data?.billNo || billFinalData?.billNo} got created`,
            createdBy: empId
          }))
          history.goBack()
        });

      document.querySelectorAll('.close')?.forEach((e) => e.click());
    }
  };

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
                      Project Name <span className="text-danger">*</span>
                    </label>
                    <select
                      className="custom-select"
                      name="project"
                      value={projectId}
                      onChange={(e) => {
                        setProjectId(e.target.value);
                      }}
                      required
                    >
                      <option selected>Please Select</option>
                      {projectList.map((p) => (
                        <option value={p._id}>{p.name}</option>
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
                    <input
                      type="text"
                      className="form-control"
                      name="billNo"
                      value={billNo}
                      onChange={(e) => setBillNo(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="col-sm-6 col-md-6">
                  <div className="form-group">
                    <label htmlFor="">Order Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="orderNo"
                      value={orderNo}
                      onChange={(e) => setOrderNo(e.target.value)}
                    />
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
                      <input
                        className="form-control"
                        type="date"
                        name="billDate"
                        value={billDate}
                        onChange={(e) => setBillDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-md-4">
                  <div className="form-group">
                    <label>Due Date</label>
                    <div>
                      <input
                        className="form-control"
                        type="date"
                        name="dueDate"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-md-4">
                  <div className="form-group">
                    <label>Payment Terms</label>
                    <select
                      className="custom-select"
                      name="paymentTerms"
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                    >
                      <option></option>
                      <option value="Net 15">Net 15</option>
                      <option value="Net 30">Net 30</option>
                      <option value="Net 45">Net 45</option>
                      <option value="Net 60">Net 60</option>
                      <option value="Due end of the Month">
                        Due end of the Month
                      </option>
                      <option value="Due end of next Month">
                        Due end of next Month
                      </option>
                      <option value="Due on Receipt">Due on Receipt</option>
                    </select>
                  </div>
                </div>
              </div>
              {/* Transaction  */}
              <div className="row">
                <div className="col-sm-6 col-md-4">
                  <div className="form-group">
                    <label>Discount Type</label>
                    <select
                      className="custom-select"
                      name="discountType"
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value)}
                      onBlur={() => {
                        handleDiscountTypeRefactor();
                        handleGrandTotal();
                      }}
                    >
                      <option value="At Transactional Level">
                        At Transactional Level
                      </option>
                      <option value="At Inline Item Level">
                        At Inline Item Level
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 col-sm-12">
                  <div className="table-responsive">
                    <table className="table table-hover table-white">
                      <thead>
                        <tr className="text-center">
                          <th style={{ minWidth: '250px' }}>
                            ITEM DETAILS<span className="text-danger">*</span>
                          </th>
                          <th style={{ minWidth: '50px' }}>ACCOUNT</th>
                          <th style={{ minWidth: '50px' }}>QUANTITY</th>
                          <th style={{ minWidth: '50px' }}>UNIT</th>
                          <th style={{ minwidth: '10px' }}>RATE</th>
                          {discountType === 'At Inline Item Level' && (
                            <th style={{ minwidth: '50px' }}>DISCOUNT</th>
                          )}
                          {/* <th>CUSTOMER DETAILS</th> */}
                          <th style={{ minwidth: '150px' }}>AMOUNT</th>
                          <th style={{ minwidth: '50px' }}>DELETE</th>
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
                                name="itemDetails"
                                value={trx.itemDetails}
                                onChange={(e) => handletransaction(e, index)}
                                required
                              />
                            </td>
                            <td>
                              <select
                                name="account"
                                id=""
                                className="custom-select"
                                value={trx.account}
                                onChange={(e) => handletransaction(e, index)}
                              >
                                <option>Choose...</option>
                                <optgroup label="Other Current Asset">
                                  <option value="Advance Tax">
                                    Advance Tax
                                  </option>
                                  <option value="Employee Advance">
                                    Employee Advance
                                  </option>
                                  <option value="Prepaid Expense">
                                    Prepaid Expense
                                  </option>
                                </optgroup>
                                <optgroup label="Fixed Asset">
                                  <option value="Furniture and Equipment">
                                    Furniture and Equipment
                                  </option>
                                </optgroup>
                                <optgroup label="Other Current Liability">
                                  <option value="Employee Reimburstment">
                                    Employee Reimburstment
                                  </option>
                                </optgroup>
                                <optgroup label="Credit Card"></optgroup>
                                <optgroup label="Long Term Liability">
                                  <option value="Contruction Loans">
                                    Contruction Loans
                                  </option>
                                  <option value="Mortgages">Mortgages</option>
                                </optgroup>
                                <optgroup label="Income">
                                  <option value="Discount">Discount</option>
                                  <option value="General Income">
                                    General Income
                                  </option>
                                </optgroup>
                                <optgroup label="Expense">
                                  <option value="Uncategorized">
                                    Uncategorized
                                  </option>
                                </optgroup>
                                <optgroup label="Cost of Goods Sold">
                                  <option value="Cost of Goods Sold">
                                    Cost of Goods Sold
                                  </option>
                                  <option value="job Costing">
                                    job Costing
                                  </option>
                                </optgroup>
                                <optgroup label="Stock">
                                  <option value="Inventory Asset">
                                    Inventory Asset
                                  </option>
                                </optgroup>
                              </select>
                            </td>
                            <td>
                              <input
                                className="form-control"
                                style={{ width: '120px' }}
                                type="number"
                                name="quantity"
                                value={trx.quantity}
                                onChange={(e) => {
                                  handletransaction(e, index);
                                  handleSingleTrxAmount(e, index);
                                }}
                                onBlur={handleSubTotal}
                              />
                            </td>
                            <td>
                              <select
                                className="custom-select"
                                style={{ width: '100px' }}
                                name="unit"
                                value={trx?.unit}
                                onChange={(e) => {
                                  handletransaction(e, index);
                                }}
                              >
                                {[
                                  'pcs.',
                                  'ton',
                                  'kg',
                                  'g',
                                  'mg',
                                  'ltr.',
                                  'ml',
                                ].map((u, i) => (
                                  <option key={i} value={u}>
                                    {u}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <input
                                style={{ width: '160px' }}
                                className="form-control"
                                type="number"
                                name="rate"
                                value={trx.rate}
                                onChange={(e) => {
                                  handletransaction(e, index);
                                  handleSingleTrxAmount(e, index);
                                }}
                                onBlur={handleSubTotal}
                              />
                            </td>
                            {discountType === 'At Inline Item Level' && (
                              <td className="d-flex align-items-center">
                                <input
                                  className="form-control flex-2"
                                  style={{ width: '80px' }}
                                  type="number"
                                  name="discountValue"
                                  value={trx.discount.discountValue}
                                  onChange={(e) => {
                                    handleInlineDiscountValue(e, index);
                                    handleSingleTrxAmount(e, index);
                                  }}
                                  // onBlur={(e) => handleSingleTrxAmount(e, index)}
                                  onBlur={handleSubTotal}
                                />
                                <select
                                  className="custom-select"
                                  style={{ width: '60px' }}
                                  name="discountType"
                                  value={trx.discount.discountType}
                                  onChange={(e) => {
                                    handleInlineDiscountValue(e, index);
                                    handleSingleTrxAmount(e, index);
                                  }}
                                  // onBlur={(e) => handleSingleTrxAmount(e, index)}
                                  onBlur={handleSubTotal}
                                >
                                  <option value="percent">%</option>
                                  <option value="INR">&#x20B9;</option>
                                </select>
                              </td>
                            )}
                            {/* <td>
                              <select className="custom-select"
                                name='customerDetails'
                                value={trx.customerDetails}
                                onChange={(e) => handletransaction(e, index)}
                              
                              >
                                <option></option>
                                {customers.map((cust) => (
                                  <option key={cust._id} value={cust._id}>
                                    {cust.displayName}
                                  </option>
                                ))}
                              </select>
                            </td> */}
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                style={{ minWidth: '120px' }}
                                name="amount"
                                value={trx.amount}
                                onChange={(e) => handletransaction(e, index)}
                                disabled
                              />
                            </td>
                            <td className="text-center">
                              {index !== 0 && (
                                <DeleteOutline
                                  onClick={(e) =>
                                    removetransactionField(e, index)
                                  }
                                />
                              )}
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
                <div
                  className="ml-3 btn btn-primary"
                  onClick={addtransactionField}
                >
                  <Add /> Add another Line
                </div>
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
                    {discountType === 'At Transactional Level' && (
                      <tr>
                        <td colSpan={4} className="text-right">
                          Discount
                        </td>
                        <td className="d-flex align-items-center">
                          <input
                            className="form-control flex-2"
                            style={{ width: '80px' }}
                            type="number"
                            name="discountValue"
                            value={discount.discountValue}
                            onChange={(e) => {
                              setDiscount({
                                ...discount,
                                discountValue: e.target.value,
                              });
                            }}
                            onBlur={handleTrxDiscountValue}
                          />
                          <select
                            className="custom-select"
                            style={{ width: '60px' }}
                            name="discountType"
                            value={discount.discountType}
                            onChange={(e) => {
                              setDiscount({
                                ...discount,
                                discountType: e.target.value,
                              });
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
                    )}

                    {taxSystem === 'TCS' && (
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name="adjustmentName"
                            value={adjustment.adjustmentName}
                            onChange={(e) =>
                              setAdjustment({
                                ...adjustment,
                                adjustmentName: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control text-right"
                            name="adjustmentValue"
                            value={adjustment.adjustmentValue}
                            onChange={(e) =>
                              setAdjustment({
                                ...adjustment,
                                adjustmentValue: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={adjustment.adjustmentValue}
                            disabled
                          />
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td />
                      <td />
                      <td />
                      <td className='d-flex'>
                          <div class="form-check mr-3">
                            <input class="form-check-input" type="radio" name="taxSystem" id="exampleRadios1" value="option1"
                              onClick={(e) => { setTaxSystem("TDS");
                              setAdjustment({ ...adjustment, adjustmentValue : 0 });
                              }}
                            // defaultChecked={taxSystem === "TDS"}
                              checked={taxSystem === "TDS"}
                            />
                            <label class="form-check-label" for="exampleRadios1">
                              TDS
                            </label>
                          </div>
                          <div class="form-check">
                            <input class="form-check-input" type="radio" name="taxSystem" id="exampleRadios2" value="option2" 
                              onClick={(e) => {setTaxSystem("TCS");
                              setAdjustment({ ...adjustment, adjustmentValue : 0 });
                              }}
                              // defaultChecked={taxSystem === "TCS"}
                              checked={taxSystem === "TCS"}
                            />
                            <label class="form-check-label" for="exampleRadios2">
                              TCS
                            </label>
                          </div>
                      </td>
                      <td>
                      {taxSystem === "TCS" ? 
                        <select className="custom-select" 
                        name="tcsTax"
                        style={{ maxWidth: '250px' }}
                        value={tcsTax}
                        onChange={(e) => {settcsTax(e.target.value);
                          
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

                        : 
                      
                        <select className="custom-select" 
                          name="taxType"
                          style={{ maxWidth: '250px' }}
                          value={taxType}
                          onChange={(e) => {
                            setTaxType(e.target.value);
                          }}
                          onBlur={handleTaxAmount}
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
                        }
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
                          name="taxAmount"
                          value={taxAmount}
                        />
                      </td>
                    </tr>
                    {taxSystem === 'TDS' && (
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name="adjustmentName"
                            value={adjustment.adjustmentName}
                            onChange={(e) =>
                              setAdjustment({
                                ...adjustment,
                                adjustmentName: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control text-right"
                            name="adjustmentValue"
                            value={adjustment.adjustmentValue}
                            onChange={(e) =>
                              setAdjustment({
                                ...adjustment,
                                adjustmentValue: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td style={{ paddingRight: '30px' }}>
                          <input
                            type="number"
                            className="form-control text-right"
                            value={adjustment.adjustmentValue}
                            disabled
                          />
                        </td>
                      </tr>
                    )}
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
                <div className="ml-5">
                  <label htmlFor="">Notes</label>
                  <textarea
                    name="notes"
                    id=""
                    cols="100"
                    rows="3"
                    className="form-control"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <br />
              <div>
                {/* <button className="btn btn-outline-secondary mr-2" type="submit">
                  Save as Draft
                </button> */}
                <button className="btn btn-primary mr-2" type="submit">
                  Save as Open
                </button>
                <div
                  className="btn btn-outline-secondary"
                  onClick={() => history.goBack()}
                >
                  Cancel
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorBill;
