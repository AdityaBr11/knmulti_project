import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import { Table } from 'antd';
import 'antd/dist/antd.css';
import { itemRender, onShowSizeChange } from '../../paginationfunction';
import '../../antdstyle.css';
import httpService from '../../../lib/httpService';

const RecurringInvoices = () => {
  useEffect(() => {
    (async () => {
      const res = await httpService.get('/recurring-invoice');
      setData(res.data);
      const invoices = [...res.data];
      setDataToRender(invoices);
      console.log(res.data);
    })();
  }, []);
  const [data, setData] = useState([{}]);
  const [invoiceToEdit, setInvoiceToEdit] = useState();
  const [dataToRender, setDataToRender] = useState([{}]);

  const filterDate = (e) => {
    if (e.target.value === '') {
      setDataToRender([...data])
      return;
    }
    const date = new Date(e.target.value) 
    setDataToRender((dataToRender) => dataToRender.filter((data) => (new Date(data.invoiceDate?.split('T')[0])) > date))
  }

  const filterDateLess = (e) => {
    if (e.target.value === '') {
      setDataToRender([...data])
      return;
    }
    const date = new Date(e.target.value) 
    setDataToRender((dataToRender) => dataToRender.filter((data) => (new Date(data.invoiceDate?.split('T')[0])) < date))
  }

  const filterCustomerName = (e) => {
    if (e.target.value === '') {
      setDataToRender([...data])
      return;
    }
    setDataToRender((dataToRender) => dataToRender.filter((data, i) => data.customer?.name?.includes(e.target.value)))
  }

  const filterInvoice = (e) => {
    if (e.target.value === '') {
      setDataToRender([...data])
      return;
    }
    setDataToRender((dataToRender) => dataToRender.filter((data, i) => data.invoice?.includes(e.target.value)))
  }

  const handleDelete = async () => {
    await httpService.delete(`/recurring-invoice/${invoiceToEdit._id}`);
    setData(data.filter((invoice) => invoice._id !== invoiceToEdit._id));
    setDataToRender(data.filter((invoice) => invoice._id !== invoiceToEdit._id));
    document.querySelectorAll('.cancel-btn')?.forEach((e) => e.click());
  }

   // Search 

   const [ qrinv, setqrinv ] = useState("");
   const [ qcustomer, setqcustomer ] = useState("");
   const [ qdatefrom, setqdatefrom ] = useState("");
   const [ qdateto, setqdateto ] = useState("");
   const [ qdateby, setqdateby ] = useState("startdateby");
 
   function searchTable(data) {
 
     let newData = data
       .filter(row => row.profileName?.toLowerCase()?.indexOf(qrinv.toLowerCase()) > -1)
       .filter(c => c.customer?.displayName.toLowerCase().indexOf(qcustomer.toLowerCase()) > -1);
 
       if(qdateby == "nextdateby"){
         newData = newData.filter(fd => fd?.nextDate >= qdatefrom);
         if(qdateto !== ""){
           newData = newData.filter(fd => fd?.nextDate.split("T")[0] <= qdateto);
         }
       } 
       else{
         newData = newData.filter(fd => fd?.startDate >= qdatefrom);
         if(qdateto !== ""){
           newData = newData.filter(fd => fd?.startDate.split("T")[0] <= qdateto);
         }
       }
       
     return newData;
   }
  
  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }
  });
  const columns = [
    {
      title: 'Profile Name',
      dataIndex: 'profileName',
      render: (text, record) => (
        // <span>{text}</span>
        <span><Link to={`/app/sales/recurring-invoice/${record._id}`}>{text}</Link></span>
      ),
      // sorter: (a, b) => a.customer.name.length - b.customer.name.length,
    },
    {
      title: 'Customer Name',
      dataIndex: 'customer',
      render: (text, record) => (
        <span>{record?.customer?.displayName}</span>
      ),
      // sorter: (a, b) => a.customer.name.length - b.customer.name.length,
    },
    {
      title: 'Frequency#',
      dataIndex: 'frequency',
      render: (text, record) => (
        <span>{`Every ${record.frequency} ${record.frequencyUnit}`}</span>
      ),
      sorter: (a, b) => a.invoice.length - b.invoicenuminvoiceber.length,
    },
    // Last InvoiceDate
    // Next InvoiceDate
    // Status
    // {
    //   title: 'Date',
    //   dataIndex: 'invoiceDate',
    //   render: (text, record) => (
    //     <span>{record?.invoiceDate?.split('T')[0]}</span>
    //   ),
    //   sorter: (a, b) => a.estimateDate.length - b.estimateDate.length,
    // },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      render: (text, record) => (
        <span>{record?.startDate?.split('T')[0]}</span>
      ),
      // sorter: (a, b) => a.dueDate.length - b.dueDate.length,
    },
    {
      title: 'Next Date',
      dataIndex: 'nextDate',
      render: (text, record) => (
        <span>{record?.nextDate?.split('T')[0]}</span>
      ),
      // sorter: (a, b) => a.dueDate.length - b.dueDate.length,
    },
    {
      title: 'Amount',
      dataIndex: 'grandTotal',
      render: (text, record) => <span>₹ {text}</span>,
      sorter: (a, b) => a.amount.length - b.amount.length,
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    //   render: (text, record) => (
    //     <span
    //       className={
    //         text === 'Accepted'
    //           ? 'badge bg-inverse-success'
    //           : 'badge bg-inverse-info'
    //       }
    //     >
    //       {text}
    //     </span>
    //   ),
    //   sorter: (a, b) => a.status.length - b.status.length,
    // },
    {
      title: 'Action',
      render: (text, record) => (
        <div className="dropdown dropdown-action text-right">
          <a
            href="#"
            className="action-icon dropdown-toggle"
            data-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="material-icons">more_vert</i>
          </a>
          <div className="dropdown-menu dropdown-menu-right">
            <Link className="dropdown-item" to={{ pathname: "/app/sales/recurring-invoices-create", state: { ...record, edit: true }}}>
              <i className="fa fa-pencil m-r-5" /> Edit
            </Link>
            <a
              className="dropdown-item"
              href="#"
              data-toggle="modal"
              data-target="#delete_estimate"
              onClick={(e) => {
                setInvoiceToEdit(record);
              }}
            >
              <i className="fa fa-trash-o m-r-5" /> Delete
            </a>
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Recurring Invoices </title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Recurring Invoices</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Recurring Invoices</li>
              </ul>
            </div>
            <div className="col-auto float-right ml-auto">
              <Link to="/app/sales/recurring-invoices-create" className="btn add-btn">
                <i className="fa fa-plus" /> New
              </Link>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        {/* Search Filter */}
        <div className="row filter-row justify-content-between">
          <div className="col-sm-3 col-md-3">
            <div className="form-group form-focus focused">
              <input
                type="text"
                className="form-control floating"
                value={qrinv}
                onChange={(e) => setqrinv(e.target.value)}
              />
              <label className="focus-label">Profile Name</label>
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
          <div className="col-sm-3 col-md-2">
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
          <div className="col-sm-3 col-md-2">
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
          <div className="col-sm-3 col-md-2">
            <div className="form-group form-focus focused">
              <select
                className="custom-select form-control floating"
                name=""
                value={qdateby}
                onChange={(e) => setqdateby(e.target.value)}
              >
                <option value="startdateby">Start Date</option>
                <option value="nextdateby">Next Date</option>
              </select>
              <label className="focus-label">Filter By</label>
            </div>
          </div>

        </div>
        {/* /Search Filter */}
        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive">
              <Table
                className="table-striped"
                pagination={{
                  total: dataToRender.length,
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
      {/* /Page Content */}
      {/* Delete Estimate Modal */}
      <div
        className="modal custom-modal fade"
        id="delete_estimate"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete Invoice</h3>
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

export default RecurringInvoices;
