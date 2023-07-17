import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useHistory, useLocation } from 'react-router-dom';
import httpService from '../../../lib/httpService';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { set } from 'lodash';
import { createNotify } from '../../../features/notify/notifySlice';
import moment from 'moment';

const CreateInvoice = () => {
  const dispatch = useDispatch();
  const empObj = useSelector((state) => state?.authentication?.value?.user);
  const [customer, setCustomer] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [adjustment, setAdjustment] = useState(0);
  const [custom, setCustom] = useState(false);
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
  const [tax, setTax] = useState([]);
  const [taxCalc, setTaxCalc] = useState('');
  const [taxType, setTaxType] = useState('');
  const [taxOption, setTaxOption] = useState('');
  const [taxPercentage, setTaxPercentage] = useState('');
  // const [taxPercentage, setTaxPercentage] = useState('');
  const [taxationAmount, setTaxationAmount] = useState(0);
  const [tdsIndex, setTdsIndex] = useState(null);
  const [tcsIndex, setTcsIndex] = useState(null);
  const [tds, setTds] = useState([
    {
      type: 'Commission on Borkerage',
      value: '5%',
    },
    {
      type: 'Commission on Borkerage (reduced)',
      value: '3.75%',
    },
    {
      type: 'Divident',
      value: '10%',
    },
    {
      type: 'Divident (reduced)',
      value: '7.5%',
    },
    {
      type: 'Other Interest than securities',
      value: '10%',
    },
    {
      type: 'Other Interest than securities (reduced)',
      value: '7.5%',
    },
    {
      type: 'Payment of Contractors for Others',
      value: '10%',
    },
    {
      type: 'Payment of Contractors for Others (reduced)',
      value: '7.5%',
    },
    {
      type: 'Payment of Contractors HUF/Indiv',
      value: '1%',
    },
    {
      type: 'Payment of Contractors HUF/Indiv (reduced)',
      value: '0.75%',
    },
    {
      type: 'Professional fees',
      value: '10%',
    },
    {
      type: 'Professional fees (reduced)',
      value: '7.5%',
    },
    {
      type: 'Rent on Land or Furniture',
      value: '10%',
    },
    {
      type: 'Rent on Land or Furniture (reduced)',
      value: '7.5%',
    },
  ]);

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


  const history = useHistory();
  const { state } = useLocation();
  useEffect(() => {
    handleInlineDiscountValue();

  }, [typediscount, discountValue, total])

  useEffect(() => {
    setInvoiceToAdd({
      ...invoiceToAdd,
      invoiceDate: moment().format('YYYY-MM-DD'),
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
    const taxData = await fetchTaxes();
    console.log(state);
    if (state?.estConvert) {
      const {
        estimate,
        adjustments,
        amount,
        customer,
        customerNotes,
        discountValue,
        discountVarient,
        discount,
        expiryDate: dueDate,
        employee,
        grandTotal,
        invoice,
        estimateDate: invoiceDate,
        items,
        orderNumber,
        paidAmount,
        taxType,
        taxationAmount,
        terms,
        tdsType,
        tcsTax,
        termsAndConditions,
        withholdingTax,
        taxPercentage,
      } = state;
      setInvoiceToAdd({
        adjustments,
        amount,
        customer: customer?._id,
        customerNotes,
        discount,
        dueDate,
        employee: employee?._id,
        grandTotal,
        invoice,
        invoiceDate,
        items,
        orderNumber: estimate,
        paidAmount,
        taxType,
        taxationAmount,
        terms,
        termsAndConditions,
        withholdingTax,
        taxPercentage,
      });
      setTaxType(taxType);
      setItemsToAdd(items);
      settypediscount(discountVarient?.discountType);
      setdiscountValue(discountVarient?.discountValue);
      setDiscount(discount);
      setAdjustment(adjustment);
      let index = 14;
      if (tdsType != null) {
        tds?.forEach((t, i) => {
          if (tdsType === t.type) {
            setCustom(false);
            index = i;
            setTdsIndex(i);
            setTaxPercentage(t.value?.split('%')[0]);
          }
        });
        if (index === 14) {
          setCustom(true);
          setTdsIndex(tdsType);
          setTaxPercentage(taxPercentage);
        }
      }
      if (tcsTax != null) {
        taxData?.forEach((t, i) => {
          if (tcsTax === t._id) {
            setTcsIndex(i);
            setTaxCalc(t.type);
            setTaxPercentage(t.amount);
          }
        });
      }
    } else if (state?.sOConvert) {
      const {
        salesOrder,
        adjustments,
        amount,
        customer,
        customerNotes,
        discountVarient,
        discount,
        shipmentDate: dueDate,
        employee,
        grandTotal,
        invoice,
        orderDate: invoiceDate,
        items,
        orderNumber,
        paidAmount,
        taxType,
        taxationAmount,
        terms,
        termsAndConditions,
        withholdingTax,
        taxPercentage,
      } = state;
      setInvoiceToAdd({
        adjustments,
        amount,
        customer: customer._id,
        customerNotes,
        discount,
        dueDate,
        employee,
        grandTotal,
        invoice,
        invoiceDate,
        items,
        orderNumber: salesOrder,
        paidAmount,
        taxType,
        taxationAmount,
        terms,
        termsAndConditions,
        withholdingTax,
        taxPercentage,
      });
      settypediscount(discountVarient?.discountType);
      setdiscountValue(discountVarient?.discountValue);
      setItemsToAdd(items);
      setDiscount(discount);
    } else if (state?.sOConvert) {
      const {
        adjustments,
        amount,
        customer,
        customerNotes,
        discount,
        shipmentDate: dueDate,
        employee,
        grandTotal,
        invoice,
        orderDate: invoiceDate,
        items,
        orderNumber,
        paidAmount,
        taxType,
        taxationAmount,
        terms,
        termsAndConditions,
        withholdingTax,
        taxPercentage,
      } = state;
      setInvoiceToAdd({
        adjustments,
        amount,
        customer: customer._id,
        customerNotes,
        discount,
        dueDate,
        employee,
        grandTotal,
        invoice,
        invoiceDate,
        items,
        orderNumber,
        paidAmount,
        taxType,
        taxationAmount,
        terms,
        termsAndConditions,
        withholdingTax,
        taxPercentage,
      });
      setItemsToAdd(items);
      setDiscount(discount);
    } else if (state?.expenseData) {
      const { customerId, expenseAccount, expenseAmount } = state?.expenseData;
      setInvoiceToAdd({
        customer: customerId?._id,
        invoiceDate: moment().format('YYYY-MM-DD'),
      });
      setItemsToAdd([
        {
          item: expenseAccount,
          description: '',
          unitCost: expenseAmount,
          quantity: 1,
          amount: expenseAmount,
        },
      ]);
      // setDiscount(discount);
    } else if (state?.edit) {
      const {
        adjustments,
        amount,
        customer,
        customerNotes,
        discount,
        dueDate,
        employee,
        grandTotal,
        invoice,
        invoiceDate,
        items,
        orderNumber,
        paidAmount,
        taxType,
        taxationAmount,
        terms,
        tdsType,
        tcsTax,
        termsAndConditions,
        withholdingTax,
        taxPercentage,
        discountVarient,
      } = state;
      setInvoiceToAdd({
        adjustments,
        amount,
        customer: customer._id,
        customerNotes,
        discount,
        dueDate,
        employee,
        grandTotal,
        invoice,
        invoiceDate,
        items,
        orderNumber,
        paidAmount,
        taxType,
        taxationAmount,
        terms,
        termsAndConditions,
        withholdingTax,
        taxPercentage,
      });
      settypediscount(discountVarient?.discountType);
      setdiscountValue(discountVarient?.discountValue);
      setTaxType(taxType);
      setItemsToAdd(items);
      setDiscount(discount);
      setAdjustment(adjustment);
      console.log()
      let index = 14;
      if (tdsType != null) {
        tds.forEach((t, i) => {
          if (tdsType === t.type) {
            setCustom(false);
            index = i;
            setTdsIndex(i);
            setTaxPercentage(t.value?.split('%')[0]);
          }
        });
        if (index === 14) {
          setCustom(true);
          setTdsIndex(tdsType);
          setTaxPercentage(taxPercentage);
        }
      }
      if (tcsTax != null) {
        taxData.forEach((t, i) => {
          if (tcsTax === t._id) {
            setTcsIndex(i);
            setTaxCalc(t.type);
            setTaxPercentage(t.amount);
          }
        });
      }
    } else if (state?.convertRecurring) {
      const {
        adjustments,
        amount,
        customer,
        customerNotes,
        discount,
        dueDate,
        employee,
        grandTotal,
        invoice,
        invoiceDate,
        items,
        orderNumber,
        paidAmount,
        taxType,
        taxationAmount,
        terms,
        tdsType,
        tcsTax,
        termsAndConditions,
        withholdingTax,
        taxPercentage,
        discountVarient
      } = state?.recurringinvoiceData;
      setInvoiceToAdd({
        adjustments,
        amount,
        customer: customer?._id,
        customerNotes,
        discount,
        dueDate,
        employee,
        grandTotal,
        invoice,
        invoiceDate: moment().format('YYYY-MM-DD'),
        items,
        orderNumber,
        paidAmount,
        taxType,
        taxationAmount,
        terms,
        termsAndConditions,
        withholdingTax,
        taxPercentage,
      });

      settypediscount(discountVarient?.discountType);
      setdiscountValue(discountVarient?.discountValue);
      setTaxType(taxType);
      setItemsToAdd(items);
      setDiscount(discount);
      setAdjustment(adjustments);
      let index = 14;
      if (tdsType != null) {
        tds.forEach((t, i) => {
          if (tdsType === t.type) {
            setCustom(false);
            index = i;
            setTdsIndex(i);
            console.log("setTaxPercentage", t.value?.split('%')[0]);
            setTaxPercentage(t.value?.split('%')[0]);
          }
        });
        if (index === 14) {
          setCustom(true);
          setTdsIndex(tdsType);
          setTaxPercentage(taxPercentage);
          console.log("setTaxPercentage14", taxPercentage, "tdsType", tdsType);
        }
      }
      if (tcsTax != null) {
        taxData.forEach((t, i) => {
          if (tcsTax === t._id) {
            setTcsIndex(i);
            setTaxCalc(t.type);
            setTaxPercentage(t.amount);
          }
        });
      }
    }
  }, []);

  useEffect(() => {
    if (state?.customerId) {
      setInvoiceToAdd({
        ...invoiceToAdd,
        customer: state?.customerId,
        invoiceDate: moment().format('YYYY-MM-DD'),
      });
      selectCustomer(state?.customerId);
    }
  }, []);
  useEffect(() => {
    console.log(taxType, taxPercentage, 'taxPercentage', taxationAmount, 'TaxationAmountTaxationAmount');
    switch (taxType) {
      case 'select':
        setTaxationAmount("");
        break;
      case 'tds':
        setTaxationAmount((total / 100) * taxPercentage);
        break;
      case 'tcs':
        if (taxCalc === 'Amount') {
          setTaxationAmount(taxPercentage);
        } else if (taxCalc === 'Percentage') {
          setTaxationAmount((total / 100) * taxPercentage);
        }
        break;
    }
  }, [tax, taxCalc, taxType, taxOption, taxPercentage, total]);

  useEffect(() => {
    let newTotal = 0;
    itemsToAdd?.forEach((item) => {
      newTotal = newTotal + parseInt(item.amount);
    });
    setTotal(newTotal);
  }, [itemsToAdd]);

  useEffect(() => {
    if (taxType === 'tds') {
      setGrandTotal(total - discount + adjustment - taxationAmount);
    } else {
      setGrandTotal(total - discount + adjustment + taxationAmount);
    }
  }, [total, discount, adjustment, taxationAmount]);
  // console.log(
  //   taxType,
  //   grandTotal,
  //   taxPercentage,
  //   taxationAmount,
  //   'setGrandTotalTaxationAmountTaxationAmount'
  // );
  const fetchCustomers = async () => {
    const customers = await httpService.get('/customer');
    setCustomer(customers.data);
  };

  const fetchEmployees = async () => {
    const employees = await httpService.get('/employee');
    setEmployees(employees.data);
  };

  const fetchTaxes = async () => {
    const taxData = await httpService.get('/tax');
    setTax(taxData.data);
    return taxData.data;
  };

  const selectCustomer = (id) => {
    customer?.forEach((item) => {
      if (item._id === id) {
        setInvoiceToAdd({
          ...invoiceToAdd,
          customer: id,
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


  const handleSubmit = async (e) => {
    console.log(e, '{{{{{{{<<<<');

    const invoice = {
      ...invoiceToAdd,
      items: itemsToAdd,
      amount: total,
      discount: discount,
      grandTotal: grandTotal,
      adjustments: adjustment,
      taxType: taxType,
      taxationAmount: taxationAmount,
      taxPercentage: taxPercentage,
      discountVarient: {
        discountType: typediscount,
        discountValue: discountValue,
      },
    };

    console.log({ invoiceToAdd }, 'wsaaaaaaaaaaaaaasasa');

    // return;
    if (itemsToAdd[0].item == undefined || itemsToAdd[0].item == '') {
      // toast.error('Please Select Customer');
      return;
    }
    if (
      invoiceToAdd?.orderNumber == undefined ||
      invoiceToAdd?.orderNumber == ''
    ) {
      toast.error('Please Enter Order numbe');
      return;
    }

    if (invoiceToAdd?.customer == undefined || invoiceToAdd?.customer == '') {
      toast.error('Please Select Customer');
      return;
    }
    if (invoiceToAdd.employee == undefined || invoiceToAdd.employee == '') {
      toast.error('Please Select Employee');
      return;
    }

    switch (taxType) {
      case 'tds':
        invoice.tdsType = taxOption;
        break;
      case 'tcs':
        invoice.tcsTax = taxOption || undefined;
        break;
      default:
        break;
    }
    if (state?.estConvert) {
      invoice.estimate = state._id;
      if (state?.plot) {
        invoice.plot = state?.plot;
        invoice.project = state?.project;
      }
      state.isInvoiced = true;
      state.status = 'INVOICED';

      const response = await toast.promise(
        httpService.post(`/sale-invoice/`, invoice),
        {
          pending: 'Creating the Invoice',
          success: 'Invoice created successfully',
          error: "Couldn't create the Invoice, recheck the details entered",
        }
      );
      state.invoiceId = await response.data._id;
      await httpService.put(`/sale-estimate/${state?._id}`, state);

      // change status os lead 
      const plotName = await response?.data?.plot;
      const projectToModify = await response?.data?.project;
      const plot = await projectToModify?.subPlots.find((p) => p?.name == plotName);
      console.log({ plotName });

      if (plotName) {
        console.log("i am in")
        response.data.project.subPlots
          .find((p) => p?.name == plotName)
          .leadsInfo.find((l) => l?.customer == response?.data?.customer?._id).leadType = "Booking";

        await toast.promise(
          httpService.put(`/project/status/${response?.data?.project?._id}`, {
            project: projectToModify,
            status: "Booking",
            plot: plot,
            leadcustomer: response?.data?.customer?._id
          }), {
          pending: 'Updating Customer Status',
          success: 'Customer Status Updated',
          error: 'Error Updating Customer Status',
        })
      }
      // console.log(response, 'frm cretInvoice');
      // if (e.submit) {
      //   history.push({
      //     pathname: '/app/apps/email',
      //     state: {
      //       id: response?.data?._id,
      //       subject: `Details for Invoice ${response?.data?.invoice}`,
      //       pdf: response?.data?.pdf_url,
      //       index: response?.data?.invoice,
      //       type: 'sale-invoice',
      //       emailId: response?.data?.customer?.email,
      //       backTo: -3,
      //     },
      //   });
      //   return;
      // }
      history.push('/app/sales/invoices');
      return;
    }

    if (state?.expenseData) {
      invoice.expense = state?.expenseData?._id;

      const response = await toast.promise(
        httpService.post(`/sale-invoice/`, invoice),
        {
          pending: 'Creating the Invoice',
          success: 'Invoice created successfully',
          error: "Couldn't create the Invoice, recheck the details entered",
        }
      );

      await httpService.put(
        `/vendortrx/updatevendorexpense/${state?.expenseData?._id}`,
        {
          isInvoiced: true,
          invoiceRef: response?.data._id,
          invoiceId: response?.data.invoice,
          status: 'INVOICED',
        }
      );

      console.log(response, 'frm cretInvoice');
      if (e.submit) {
        history.push({
          pathname: '/app/apps/email',
          state: {
            id: response?.data?._id,
            subject: `Details for Invoice ${response?.data?.invoice}`,
            pdf: response?.data?.pdf_url,
            index: response?.data?.invoice,
            type: 'sale-invoice',
            emailId: response?.data?.customer?.email,
            backTo: -3,
          },
        });
        return;
      }
      history.push('/app/sales/invoices');
      return;
    }

    if (state?.sOConvert) {
      invoice.salesOrder = state._id;
      state.isInvoiced = true;
      await httpService.put(`/sale-order/${state?._id}`, state);
      const response = await toast.promise(
        httpService.post(`/sale-invoice/`, invoice),
        {
          pending: 'Creating the Invoice',
          success: 'Invoice created successfully',
          error: "Couldn't create the Invoice, recheck the details entered",
        }
      );
      if (e.submit) {
        history.push({
          pathname: '/app/apps/email',
          state: {
            id: response?.data?._id,
            subject: `Details for Invoice ${response?.data?.invoice}`,
            pdf: response?.data?.pdf_url,
            index: response?.data?.invoice,
            type: 'sale-invoice',
            emailId: response?.data?.customer?.email,
            backTo: -3,
          },
        });
        return;
      }
      history.push('/app/sales/invoices');
      return;
    }
    if (state?.dcConvert) {
      invoice.deliveryChallan = state._id;
      state.isInvoiced = true;
      await httpService.put(`/deliverychallan/${state?._id}`, state);
      const response = await toast.promise(
        httpService.post(`/sale-invoice/`, invoice),
        {
          pending: 'Creating the Invoice',
          success: 'Invoice created successfully',
          error: "Couldn't create the Invoice, recheck the details entered",
        }
      );
      if (e.submit) {
        history.push({
          pathname: '/app/apps/email',
          state: {
            id: response?.data?._id,
            subject: `Details for Invoice ${response?.data?.invoice}`,
            pdf: response?.data?.pdf_url,
            index: response?.data?.invoice,
            type: 'sale-invoice',
            emailId: response?.data?.customer?.email,
            backTo: -3,
          },
        });
        return;
      }
      history.push('/app/sales/invoices');
      return;
    }
    if (state?.edit) {
      const response = await toast.promise(
        httpService.put(`/sale-invoice/${state?._id}`, invoice),
        {
          pending: 'Creating the Invoice',
          success: 'Invoice updated successfully',
          error: "Couldn't create the Invoice, recheck the details entered",
        }
      );
      if (e.submit) {
        history.push({
          pathname: '/app/apps/email',
          state: {
            id: response?.data?._id,
            subject: `Details for Invoice ${response?.data?.invoice}`,
            pdf: response?.data?.pdf_url,
            index: response?.data?.invoice,
            type: 'sale-invoice',
            emailId: response?.data?.customer?.email,
            backTo: -3,
          },
        });
        return;
      }
      history.push('/app/sales/invoices');
      return;
    }

    const response = await toast.promise(
      httpService.post('/sale-invoice', invoice),
      {
        pending: 'Creating the Invoice',
        success: 'Invoice created successfully',
        error: "Couldn't create the Invoice, recheck the details entered",
      }
    );

    dispatch(
      createNotify({
        notifyHead: `New Invoice Added`,
        notifyBody: `Invoice ${response?.data?.invoice} is created`,
        createdBy: empObj?._id,
      })
    );

    if (e.submit) {
      history.push({
        pathname: '/app/apps/email',
        state: {
          id: response?.data?._id,
          subject: `Details for Invoice ${response?.data?.invoice}`,
          pdf: response?.data?.pdf_url,
          index: response?.data?.invoice,
          type: 'sale-invoice',
          emailId: response?.data?.customer?.email,
          backTo: -3,
        },
      });
      return;
    }
    history.push('/app/sales/invoices');
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>New Invoice</title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col-sm-12">
              <h3 className="page-title">New Invoice</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">New Invoice</li>
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
                      value={invoiceToAdd?.customer || null}
                      onChange={(e) => {
                        selectCustomer(e.target.value);
                      }}
                      className="custom-select"
                    >
                      <option value={''}>Select</option>
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
                  <label className="text-danger">Invoice#</label>
                  <input
                    value={invoiceToAdd?.invoice || null}
                    placeholder="INV-000XX"
                    onChange={(e) => {
                      setInvoiceToAdd({
                        ...invoiceToAdd,
                        invoice: e.target.value,
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
                  <label>Order number#</label>
                  <input
                    value={invoiceToAdd?.orderNumber || null}
                    onChange={(e) => {
                      setInvoiceToAdd({
                        ...invoiceToAdd,
                        orderNumber: e.target.value,
                      });
                    }}
                    required
                    className="form-control"
                    type="text"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3">
                  <div className="form-group">
                    <label className="text-danger">Invoice Date*</label>
                    <div>
                      <input
                        value={invoiceToAdd?.invoiceDate?.split('T')[0] || null}
                        className="form-control"
                        onChange={(e) => {
                          setInvoiceToAdd({
                            ...invoiceToAdd,
                            invoiceDate: e.target.value,
                          });
                        }}
                        type="date"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="col-sm-3">
                  <div className="form-group">
                    <label>Due Date</label>
                    <div>
                      <input
                        value={invoiceToAdd?.dueDate?.split('T')[0] || null}
                        onChange={(e) => {
                          setInvoiceToAdd({
                            ...invoiceToAdd,
                            dueDate: e.target.value,
                          });
                        }}
                        className="form-control"
                        type="date"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Terms</label>
                    <div>
                      <select
                        value={invoiceToAdd?.terms || null}
                        // defaultValue="Due on receipt"
                        onChange={(e) => {
                          setInvoiceToAdd({
                            ...invoiceToAdd,
                            terms: e.target.value,
                          });
                        }}
                        className="form-control"
                        type="date"
                      >
                        <option selected>Please Select</option>
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
                        {/* <option value="Custom" selected>Custom</option> */}
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
                    value={invoiceToAdd?.employee || null}
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
                        {itemsToAdd?.map((p, index) => (
                          <tr className="text-center" key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <input
                                className="form-control"
                                type="text"
                                name="item"
                                value={p?.item}
                                onChange={(e) => handleItemsAddition(e, index)}
                                required
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
                          <td></td>
                          <td></td>
                          <td className="text-right">Discount</td>
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
                              readOnly
                              onChange={(e) => {
                                setDiscount(e.target.value);
                              }}
                            />
                          </td>
                        </tr>

                        <tr>
                          <td></td>
                          <td></td>
                          <td className="text-right">Adjustment</td>
                          <td
                            style={{
                              textAlign: 'left',
                              paddingRight: '30px',
                              width: '230px',
                            }}
                          >
                            <input
                              value={adjustment || 0}
                              className="form-control text-right"
                              type="number"
                              onChange={(e) => {
                                setAdjustment(parseInt(e.target.value));
                              }}
                            />
                          </td>
                          <td></td>
                          <td>
                            <input
                              readOnly
                              value={adjustment || 0}
                              style={{ width: '184' }}
                              className="form-control text-right"
                              type="number"
                              onChange={(e) => {
                                setAdjustment(parseInt(e.target.value));
                              }}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td></td>
                          <td></td>
                          <td colSpan={1} className="text-right">
                            Tax
                          </td>
                          <td
                          // style={{
                          //   textAlign: 'right',
                          //   paddingRight: '30px',
                          //   width: '230px',
                          // }}
                          >
                            <div class="form-check mr-3">
                              <select
                                value={taxType}
                                style={{ width: '170px' }}
                                defaultValue="select"
                                className="form-control custom-select"
                                onChange={(e) => {
                                  setTaxOption('');
                                  setTaxPercentage(null);
                                  setTaxType(e.target.value);
                                  if (e.target.value === 'tds') {
                                    setCustom(false);
                                  }
                                }}
                              >
                                <option value="select">Select</option>
                                <option value="tds">TDS</option>
                                <option value="tcs">TCS</option>
                              </select>
                            </div>

                            {taxType === 'tds' && (
                              <select
                                value={tdsIndex}
                                style={{ marginLeft: '20px', width: '170px' }}
                                className="form-control"
                                onChange={(e) => {
                                  if (e.target.value === 'custom') {
                                    setCustom(true);
                                  } else if (e.target.value === 'select') {
                                    setTaxPercentage(null);
                                    setTdsIndex("");
                                  } else {
                                    setCustom(false);
                                    setTdsIndex(e.target.value);
                                    setTaxOption(tds[e.target.value].type);
                                    setTaxPercentage(
                                      parseFloat(tds[e.target.value].value)
                                    );
                                  }
                                }}
                              >
                                <option value="select">Select Tds</option>
                                {tds?.map((item, i) => (
                                  <option
                                    key={i}
                                    value={i}
                                  >{`${item.type} -[${item.value}]`}</option>
                                ))}

                              </select>
                            )}
                            {taxType === 'tcs' && (
                              <select
                                value={tcsIndex}
                                style={{ marginLeft: '20px', width: '170px' }}

                                // defaultValue={tcsIndex}
                                onChange={(e) => {
                                  if (e.target.value === 'select') {
                                    setTaxPercentage(null);
                                    setTcsIndex('');
                                    setTcsIndex(null);
                                  } else {
                                    setTcsIndex(e.target.value);
                                    setTaxOption(tax[e.target.value]._id);
                                    setTaxPercentage(
                                      parseFloat(tax[e.target.value].amount)
                                    );
                                    setTaxCalc(tax[e.target.value].type);
                                  }
                                }}
                                className="form-control"
                              >
                                <option value="select">
                                  Please Select Tcs
                                </option>
                                {tax.map((t, i) => (
                                  <option key={t._id} value={i}>
                                    {`${t.name} ${t.type} ${t.amount}`}
                                  </option>
                                ))}
                              </select>
                            )}
                          </td>
                          <td></td>
                          <td>
                            <input
                              readOnly
                              Value={taxationAmount}
                              className="form-control text-right"
                              type="number"
                              onChange={(e) => {
                                setTaxationAmount(e.target.value);
                              }}
                            />
                          </td>
                        </tr>
                        {custom === true && taxType === 'tds' && (
                          <tr>
                            <td colSpan={5} className="text-right">
                              Tax Type
                            </td>
                            <td
                              style={{
                                textAlign: 'right',
                                paddingRight: '30px',
                                width: '230px',
                              }}
                            >
                              <input
                                defaultValue={taxOption}
                                className="form-control text-right"
                                type="text"
                                onChange={(e) => {
                                  setTaxOption(e.target.value);
                                }}
                              />
                              <input
                                defaultValue={taxPercentage}
                                className="form-control text-right"
                                type="number"
                                onChange={(e) => {
                                  setTaxPercentage(parseFloat(e.target.value));
                                }}
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
                          value={invoiceToAdd?.customerNotes || null}
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
                          value={invoiceToAdd?.termsAndConditions || null}
                          className="form-control"
                          rows={4}
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

export default CreateInvoice;
