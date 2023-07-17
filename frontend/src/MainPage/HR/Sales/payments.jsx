import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Table } from 'antd';
import 'antd/dist/antd.css';
import { itemRender, onShowSizeChange } from '../../paginationfunction';
import '../../antdstyle.css';
import { fetchPayment } from '../../../lib/api';
import httpService from '../../../lib/httpService';

const Payments = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState({});
  const [paymentToEdit, setPaymentToEdit] = useState({});
  const { state } = useLocation();

  useEffect(async () => {
    if (state?.customerInv && state?.customerId) {
      console.log({state});
      const res = await httpService.get(`/sale-payment/customerinvpay?customerId=${state?.customerId}&customerInv=${state?.customerInv}`);
      setData(res.data);
      setDataToRender([...res.data]);
      return;
    } else if (state?.customerId) {
      const res = await httpService.get(`/customer/payments/${state?.customerId}`);
      setData(res.data);
      setDataToRender([...res.data]);
      return;
    }
    const res = await fetchPayment();
    setData(res);
    setDataToRender([...res]);
  }, []);

  const [data, setData] = useState([]);
  const [dataToRender, setDataToRender] = useState([]);

  const filterCustomerName = (e) => {
    if (e.target.value === '') {
      setDataToRender([...data]);
      return;
    }
    setDataToRender((dataToRender) =>
      dataToRender.filter((data, i) =>
        data.customer?.displayName
          ?.toLowerCase()
          ?.includes(e.target.value.toLowerCase())
      )
    );
  };

  const handleDelete = async () => {
    await httpService.delete(`/sale-payment/${paymentToEdit._id}`);
    setData(data.filter((payment) => payment._id !== paymentToEdit._id));
    setDataToRender(data.filter((payment) => payment._id !== paymentToEdit._id));
    document.querySelectorAll('.cancel-btn')?.forEach((e) => e.click());
  }

  // Search 

  const [ qpay, setqpay ] = useState("");
  const [ qcustomer, setqcustomer ] = useState("");
  const [ qdatefrom, setqdatefrom ] = useState("");
  const [ qdateto, setqdateto ] = useState("");
  // const [ qdateby, setqdateby ] = useState("sodateby");

  function searchTable(data) {

    let newData = data
      .filter(row => row.paymentNumber?.toLowerCase()?.indexOf(qpay.toLowerCase()) > -1)
      .filter(c => c.customer?.displayName.toLowerCase().indexOf(qcustomer.toLowerCase()) > -1);

    newData = newData.filter(fd => fd?.paymentDate >= qdatefrom);
    if(qdateto !== ""){
      newData = newData.filter(fd => fd?.paymentDate.split("T")[0] <= qdateto);
    }
      
    return newData;
  }

  const columns = [
    {
      title: 'Date',
      dataIndex: 'paymentDate',
      render: (text, record) => (
        <span>{record?.paymentDate?.split('T')[0]}</span>
      ),
      sorter: (a, b) => a.paymentDate.length - b.paymentDate.length,
    },
    {
      title: 'Payment #',
      dataIndex: 'paymentNumber',
      render: (text, record) => (
        <Link to={`/app/sales/payment-view/${record._id}`}>#{text}</Link>
      ),
      sorter: (a, b) => b.invoicenumber.length - a.invoicenumber.length,
    },
    {
      title: 'Reference Number',
      dataIndex: 'reference',
      render: (text, record) => (
        <span>{text}</span>
      ),
      sorter: (a, b) => b.reference.length - a.reference.length,
    },
    {
      title: 'Customer Name',
      dataIndex: 'customer',
      render: (text, record) => (
        <Link to={`/app/profile/customer-profile/${record?.customer?._id}`}>
          {record?.customer?.displayName}
        </Link>
      ),
      sorter: (a, b) => a.customer.name.length - b.customer.name.length,
    },
    {
      title: 'Invoice #',
      dataIndex: 'invoice',
      render: (text, record) => {
        let invoices = '';
        record.invoice.map((inv) => {
          invoices = invoices.concat(`${inv.invoiceNumber}, `)
        });
        return (
          <span>{invoices}</span>
        );
      },
      sorter: (a, b) => a.customer.name.length - b.customer.name.length,
    },
    {
      title: 'Mode',
      dataIndex: 'paymentMode',
      sorter: (a, b) => a.paymenttype.length - b.paymenttype.length,
    },
    {
      title: 'Amount',
      dataIndex: 'amountReceived',
      render: (text, record) => <span>₹ {text}</span>,
      sorter: (a, b) => a.duedate.length - b.duedate.length,
    },
    {
      title: 'Unused Amount',
      dataIndex: 'excessAmount',
      render: (text, record) => <span>₹ {text}</span>,
      sorter: (a, b) => a.amount.length - b.amount.length,
    },
    // {
    //   title: 'Action',
    //   render: (text, record) => (
    //     <div className="dropdown dropdown-action text-right">
    //       <a
    //         href="#"
    //         className="action-icon dropdown-toggle"
    //         data-toggle="dropdown"
    //         aria-expanded="false"
    //       >
    //         <i className="material-icons">more_vert</i>
    //       </a>
    //       <div className="dropdown-menu dropdown-menu-right">
    //         <Link className="dropdown-item" to={{ pathname: "/app/sales/record-payment", state: { ...record, edit: true }}}>
    //           <i className="fa fa-pencil m-r-5" /> Edit
    //         </Link>
    //         <a
    //           className="dropdown-item"
    //           href="#"
    //           data-toggle="modal"
    //           data-target="#delete_payment"
    //           onClick={(e) => {
    //             setPaymentToEdit(record);
    //           }}
    //         >
    //           <i className="fa fa-trash-o m-r-5" /> Delete
    //         </a>
    //       </div>
    //     </div>
    //   ),
    // },
  ];

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Payment Received</title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Payments Received</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Payments Received</li>
              </ul>
            </div>
            <div className="col-auto float-right ml-auto">
              <Link to="/app/sales/record-payment" className="btn add-btn">
                <i className="fa fa-plus" /> Record Payment
              </Link>
            </div>
            {/* <div className="col-auto float-right ml-auto">
              <Link to="/app/sales/record-pay-wo-inv" className="btn add-btn">
                <i className="fa fa-plus" /> Record Payment W/O Invoice
              </Link>
            </div> */}
          </div>
        </div>
        {/* Search Filter */}
        <div className="row filter-row justify-content-between">
          <div className="col-sm-3 col-md-3">
            <div className="form-group form-focus focused">
              <input
                type="text"
                className="form-control floating"
                value={qpay}
                onChange={(e) => setqpay(e.target.value)}
              />
              <label className="focus-label">Payment No</label>
            </div>
          </div>
          <div className="col-sm-3 col-md-3">
            <div className="form-group form-focus focused">
              <input
                type="text"
                className="form-control floating"
                value={qcustomer}
                onChange={(e) => setqcustomer(e.target.value)}
              />
              <label className="focus-label">Customer</label>
            </div>
          </div>
          <div className="col-sm-3 col-md-3">
            <div className="form-group form-focus focused">
              <input
                className="form-control floating"
                type="date"
                value={qdatefrom}
                  onChange={(e) => setqdatefrom(e.target.value)}
              />
              <label className="focus-label">From</label>
            </div>
          </div>
          <div className="col-sm-3 col-md-3">
            <div className="form-group form-focus focused">
              <input
                className="form-control floating"
                type="date"
                value={qdateto}
                onChange={(e) => setqdateto(e.target.value)}
              />
              <label className="focus-label">To</label>
            </div>
          </div>
          {/* <div className="col-sm-3 col-md-2">
            <div className="form-group form-focus focused">
              <select
                className="custom-select form-control floating"
                name=""
                value={qdateby}
                onChange={(e) => setqdateby(e.target.value)}
              >
                <option value="sodateby">Order Date</option>
                <option value="expdateby">Expected Date</option>
              </select>
              <label className="focus-label">Filter By</label>
            </div>
          </div> */}

        </div>
        {/* /Search Filter */}
        {/* /Page Header */}
        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive">
              <Table
                className="table-striped"
                pagination={{
                  total: data.length,
                  showTotal: (total, range) =>
                    `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                  showSizeChanger: true,
                  onShowSizeChange: onShowSizeChange,
                  itemRender: itemRender,
                }}
                style={{ overflowX: 'auto' }}
                columns={columns}
                // bordered
                dataSource={searchTable(dataToRender)}
                rowKey={(record) => record.id}
                // onChange={this.handleTableChange}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Delete Estimate Modal */}
      <div
        className="modal custom-modal fade"
        id="delete_payment"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete Payment</h3>
                <p>Are you sure want to delete?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <a onClick={(e) => {
                      e.preventDefault();
                      handleDelete()
                    }} 
                    href="" className="btn btn-primary continue-btn">
                      Delete
                    </a>
                  </div>
                  <div className="col-6">
                    <a
                      href=""
                      data-dismiss="modal"
                      className="btn btn-primary cancel-btn"
                    >
                      Cancel
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Delete Estimate Modal */}
    </div>
  );
};

export default Payments;
