import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';

import { Table } from 'antd';
import 'antd/dist/antd.css';
import { itemRender, onShowSizeChange } from '../../paginationfunction';
import httpService from '../../../lib/httpService';
import { DeleteForever } from '@mui/icons-material';

const CreditNotes = () => {
  const [data, setData] = useState([]);
  const [dataToRender, setDataToRender] = useState([]);
  const [creditNoteToEdit, setCreditNoteToEdit] = useState();
  const { state } = useLocation();
  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }
  });

  React.useEffect(async () => {
    if (state?.customerId) {
      const res = await httpService.get(`/customer/notes/${state?.customerId}`);
      setData([...res.data]);
      setDataToRender([...res.data]);
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await httpService.get('/credit-note');
    console.log(data)
    setData([...data]);
    setDataToRender([...data]);
  };

  const handleDelete = async () => {
    await httpService.delete(`/credit-note/${creditNoteToEdit._id}`);
    setData(data.filter((note) => note._id !== creditNoteToEdit._id));
    setDataToRender(data.filter((note) => note._id !== creditNoteToEdit._id));
    document.querySelectorAll('.cancel-btn')?.forEach((e) => e.click());
  }

  // Search 

  const [ qcn, setqcn ] = useState("");
  const [ qcustomer, setqcustomer ] = useState("");
  const [ qdatefrom, setqdatefrom ] = useState("");
  const [ qdateto, setqdateto ] = useState("");
  // const [ qdateby, setqdateby ] = useState("sodateby");

  function searchTable(data) {

    let newData = data
      .filter(row => row.creditNote?.toLowerCase()?.indexOf(qcn.toLowerCase()) > -1)
      .filter(c => c.customer?.displayName.toLowerCase().indexOf(qcustomer.toLowerCase()) > -1);

    newData = newData.filter(fd => fd?.creditDate >= qdatefrom);
    if(qdateto !== ""){
      newData = newData.filter(fd => fd?.creditDate.split("T")[0] <= qdateto);
    }
      
    return newData;
  }

  const columns = [
    {
      title: 'Date',
      dataIndex: 'creditDate',
      render: (text, record) => (
        <span>{record?.creditDate?.split('T')[0]}</span>
      ),
      sorter: (a, b) => a.creditDate.length - b.creditDate.length,
    },
    {
      title: 'Credit Note',
      dataIndex: 'creditNote',
      render: (text, record) => (
        <Link to={`/app/sales/creditnotesinfo/${record._id}`}># {text}</Link>
      ),
      sorter: (a, b) => a.creditNote.length - b.creditNote.length,
    },
    {
      title: 'Reference Number',
      dataIndex: 'reference',
      sorter: (a, b) => a.reference.length - b.reference.length,
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
      title: 'Invoice#',
      dataIndex: 'invoiceDetails',
      render: (text, record) => {
        let str = ''
        text.forEach(inv => {
          str += `${inv.id?.invoice || ''}, `
        })
        return (
          <span>{str}</span>
        )
      },
      sorter: (a, b) => a.invoices?.length - b.invoices?.length,
    },
    {
      title: 'Amount',
      dataIndex: 'grandTotal',
      render: (text, record) => <span>₹ {text}</span>,
      sorter: (a, b) => a.grandTotal.length - b.grandTotal.length,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text, record) => (
        <span
          className={
            text === 'CLOSED'
              ? 'badge bg-inverse-secondary'
              : text === 'PARTIAL' ?
              'badge bg-inverse-warning' : 'badge bg-inverse-success'
          }
        >
          {text}
        </span>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
    },
    // {
    //   title: 'Action',
    //   render: (text, record) => (
    //     <a
    //           className="dropdown-item"
    //           href="#"
    //           data-toggle="modal"
    //           data-target="#delete_estimate"
    //           onClick={(e) => {
    //             setCreditNoteToEdit(record);
    //           }}
    //         >
    //           <DeleteForever />
    //         </a>
    //     // <div className="dropdown dropdown-action text-right">
    //     //   <a
    //     //     href="#"
    //     //     className="action-icon dropdown-toggle"
    //     //     data-toggle="dropdown"
    //     //     aria-expanded="false"
    //     //   >
    //     //     <i className="material-icons">more_vert</i>
    //     //   </a>
    //     //   <div className="dropdown-menu dropdown-menu-right">
    //     //     <Link className="dropdown-item" 
    //     //       to={{pathname: "/app/sales/create-credit-note", state: { ...record, edit: true}}}
    //     //     >
    //     //       <i className="fa fa-pencil m-r-5" /> Edit
    //     //     </Link>
    //     //     <a
    //     //       className="dropdown-item"
    //     //       href="#"
    //     //       data-toggle="modal"
    //     //       data-target="#delete_estimate"
    //     //       onClick={(e) => {
    //     //         setCreditNoteToEdit(record);
    //     //       }}
    //     //     >
    //     //       <i className="fa fa-trash-o m-r-5" /> Delete
    //     //     </a>
    //     //   </div>
    //     // </div>
    //   ),
    // },
  ];
  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Credit Notes </title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Credit Notes</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Credit notes</li>
              </ul>
            </div>
            <div className="col-auto float-right ml-auto">
            <Link to="/app/sales/create-credit-note" className="btn add-btn">
                <i className="fa fa-plus" /> Add Credit Note
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
                value={qcn}
                onChange={(e) => setqcn(e.target.value)}
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
                  <h3>Delete Credit Note</h3>
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
      {/* /Page Content */}
    </div>
  );
};

export default CreditNotes;
