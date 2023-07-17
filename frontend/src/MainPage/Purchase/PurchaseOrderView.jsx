import { Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import httpService from '../../lib/httpService'
import { itemRender, onShowSizeChange } from '../paginationfunction'

const PurchaseOrderView = () => {

  const { search } = useLocation();
  

  const [ purchaseOrders, setPurchaseOrders ] = useState([]);

  useEffect(() => {
    toast
      .promise(
        httpService.get(`/vendortrx/getvendorpurchaseorder${search}`),
        {
          error: 'Failed to create purchase order',
          success: 'Purchase Order created successfully',
          pending: 'Building vendor Purchase Order...',
        }
      )
      .then((res) => setPurchaseOrders(res.data.reverse()));
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }, []);

  // Search 

  const [ qpo, setqpo ] = useState("");
  const [ qproject, setqproject ] = useState("");
  const [ qvendor, setqvendor ] = useState("");
  const [ qdatefrom, setqdatefrom ] = useState("");
  const [ qdateto, setqdateto ] = useState("");
  const [ qdateby, setqdateby ] = useState("podateby");

  function searchTable(data) {

    let newData = data
      .filter(row => row.purchaseOrderNo.toLowerCase().indexOf(qpo.toLowerCase()) > -1)
      .filter(r => r.projectId?.name.toLowerCase().indexOf(qproject.toLowerCase()) > -1)
      .filter(c => c.vendorId?.name.toLowerCase().indexOf(qvendor.toLowerCase()) > -1);

      if(qdateby == "edlydateby"){
        newData = newData.filter(fd => fd?.expentedDeliveryDate >= qdatefrom);
        if(qdateto !== ""){
          newData = newData.filter(fd => fd?.expentedDeliveryDate.split("T")[0] <= qdateto);
        }
      } 
      else{
        newData = newData.filter(fd => fd?.purchareOrderDate >= qdatefrom);
        if(qdateto !== ""){
          newData = newData.filter(fd => fd?.purchareOrderDate.split("T")[0] <= qdateto);
        }
      }
      
    return newData;
  }

  const columns = [
    {
      title: 'DATE',
      dataIndex: 'purchareOrderDate',
      align: 'center',
      render: (purchareOrderDate) => <span>{purchareOrderDate?.split("T")[0]}</span>,
    },
    {
      title: 'PURCHASE ORDER',
      dataIndex: 'purchaseOrderNo',
      align: 'center',
      render: (text, record) => <span><Link to={`/app/purchase/purchaseorderinfo/${record._id}`}>{text}</Link></span>
    },
    {
      title: 'REFERENCE#',
      dataIndex: 'referenceId',
      align: 'center',
    },
    {
      title: 'PROJECT',
      dataIndex: 'projectId',
      render: (projectId) => <span key={projectId?._id}><Link to={`/app/projects/projects-view/${projectId?._id}`}>{projectId?.name}</Link></span>,
    },
    {
      title: 'VENDOR NAME',
      dataIndex: 'vendorId',
      render: (vendorId) => <span key={vendorId?._id}> <Link to={`/app/profile/vendor-profile/${vendorId?._id}`}>{vendorId?.name}</Link></span>,
      align: 'center',
    },
    {
      title: 'AMOUNT',
      dataIndex: 'total',
      // align: 'center',
      render: (total) => <span>₹ {total}</span>,
      // render: (isBillable) => <span className={isBillable ? 'text-primary' : 'text-dark'}>{isBillable ? "BILLED": "UNBILLED"}</span>
    },
    {
      title: 'EXPECTED DELIVERY',
      dataIndex: 'expentedDeliveryDate',
      align: 'center',
      render: (expentedDeliveryDate) => <span>{expentedDeliveryDate?.split("T")[0]}</span>,
    },
    {
      title: 'BILLED STATUS',
      dataIndex: 'billedStatus',
      align: 'center',
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      align: 'center', 
      render: (status) => <span 
        className={ status === 'ISSUED' ? 'badge bg-inverse-success' : status == 'CANCELLED' ? 'badge bg-inverse-danger' : 'badge bg-inverse-warning' } >
        {status}
      </span>
      // render: (status) => <span className={status == "ISSUED" ? 'text-success' : 'text-primary'}>{status}</span>
    },
    
  ]

  return (
    <div className="page-wrapper"> 
      <Helmet>
        <title>Purchase Order List</title>
        <meta name="description" content="vendor all purchase order" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col">
              <h3 className="page-title">All Purchase Order</h3>
            </div>
            <div className="col-auto float-right ml-auto">
              <Link
                to={{pathname: "/app/purchase/addpurchaseorder", state: { purchaseOrderLength:  purchaseOrders?.length}}}
                className="btn add-btn"
              >
                <i className="fa fa-plus" /> Add purchase Order
              </Link>
            </div>
          </div>
        </div>
        
        {/* Search Filter */}
        <div className="row filter-row justify-content-between">
          <div className="col-sm-3 col-md-2">
            <div className="form-group form-focus focused">
              <input
                type="text"
                className="form-control floating"
                value={qpo}
                onChange={(e) => setqpo(e.target.value)}
              />
              <label className="focus-label">Purchase Order No</label>
            </div>
          </div>
          <div className="col-sm-3 col-md-2">
            <div className="form-group form-focus focused">
              <input
                type="text"
                className="form-control floating"
                value={qproject}
                onChange={(e) => setqproject(e.target.value)}
              />
              <label className="focus-label">Project</label>
            </div>
          </div>
          <div className="col-sm-3 col-md-2">
            <div className="form-group form-focus focused">
              <input
                type="text"
                className="form-control floating"
                value={qvendor}
                onChange={(e) => setqvendor(e.target.value)}
              />
              <label className="focus-label">Vendor</label>
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
                <option value="podateby">Purchase Date</option>
                <option value="edlydateby">Expected Date</option>
              </select>
              <label className="focus-label">Filter By</label>
            </div>
          </div>

        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive">
              <Table
                className="table-striped"
                pagination={{
                  total: purchaseOrders?.length,
                  showTotal: (total, range) =>
                    `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                  showSizeChanger: true,
                  onShowSizeChange: onShowSizeChange,
                  itemRender: itemRender,
                }}
                style={{ overflowX: 'auto' }}
                columns={columns}
                // bordered
                dataSource={searchTable(purchaseOrders)}
                rowKey={(record) => record._id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PurchaseOrderView