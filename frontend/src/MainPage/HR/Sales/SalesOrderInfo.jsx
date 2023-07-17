import { Delete, Download, Edit, Email, Upload } from '@mui/icons-material';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useParams, useHistory } from 'react-router-dom'
import { toast } from 'react-toastify';
import httpService from '../../../lib/httpService';

const SalesOrderInfo = () => {
  const { id } = useParams();

  const [ sOData, setSOData ] = useState("");
  const [ viewPDF, setViewPDF ] = useState(false);
  const [ render, setRender ] = useState(false);
  const history = useHistory()

  const fetchSalesOrder = () => {
    toast
      .promise(
        httpService.get(`/sale-order/${id}`),
        {
          error: 'Failed to fetch sales order',
          success: 'Sales Order fetch successfully',
          pending: 'fetching sale order...',
        }
      )
      .then((res) => {
        setSOData(res.data)
      });
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

  useEffect(() => {
    fetchSalesOrder()
  }, [render]);

  const handleDelete = () => {
    toast
      .promise(
        httpService.delete(`/sale-order/${id}`),
        {
          error: 'Failed to delete sales order',
          success: 'Sales Order Deleted Successfully',
          pending: 'deleting sales order...'
        }
      ).then((res) => {
        document.querySelectorAll('.cancel-btn')?.forEach((e) => e.click());
        history.push("/app/sales/salesorder");
      });
  }

  const handleConfirmStatus = () => {
    toast
      .promise(
        httpService.put(`/sale-order/${id}`, { status: 'CONFIRMED' }),
        {
          error: 'Failed to update status',
          success: `${sOData?.salesOrder || ''} status updated successfully`,
          pending: 'updating'
        }
      ).then((res) => {
        // document.querySelectorAll('.cancel-btn')?.forEach((e) => e.click());
        setSOData(res.data);
        // history.push(`/app/sales/salesorder-info/${res.data?._id}`);
      });
  }

  const SalesOrderView = () => {
    return(
      <>
      <div className="d-flex">
          <div className="p-2 mr-2 flex-fill">
            <p className="h2">SALES ORDER</p>
            <p className="h3">Sales Order# {sOData?.salesOrder}</p>
            <span className="badge bg-warning p-2 h5">{sOData?.status}</span>
            <table className="table table-borderless"> 
              <tbody>
                <tr>
                  <td>REFERENCE#</td>
                  <td>{sOData?.reference}</td>
                </tr>
                <tr>
                  <td>ORDER DATE</td>
                  <td>{sOData?.orderDate?.split("T")[0]}</td>
                </tr>
                <tr>
                  <td>SHIPMENT DATE</td>
                  <td>{sOData?.shipmentDate?.split("T")[0]}</td>
                </tr>
                <tr>
                  <td>PAYMENT TERMS</td>
                  <td>{sOData?.paymentTerms}</td>
                </tr>
                {/* <tr>
                  <td>DELIVERY METHOD</td>
                  <td>{sOData?.deliveryMethod}</td>
                </tr> */}
              </tbody>
            </table>
          </div>
          <div className="p-2 ml-2 flex-fill">
            <div>
              <p className="h5">BILLING ADDRESS</p> 
              <div className='ml-3'>
              <Link to={`/app/profile/customer-profile/${sOData?.customer?._id}`}>
                <div>{sOData?.customer?.displayName}</div>
              </Link>
                <div>{sOData?.customer?.billingAddress?.attention}</div>
                <div>{sOData?.customer?.billingAddress?.addressLine1}</div>
                <div>{sOData?.customer?.billingAddress?.addressLine2}</div>
                <div>{sOData?.customer?.billingAddress?.city} - {sOData?.customer?.billingAddress?.state}</div>
                <div>INDIA - {sOData?.customer?.billingAddress?.zipcode}</div>
              </div>
            </div>
            <hr />
            {/* <div>
              <p className="h5">SHIPPING ADDRESS</p>
              <div className="ml-3">
              <Link to={`/app/profile/customer-profile/${sOData?.customer?._id}`}>
                <div>{sOData?.customer?.displayName}</div>
              </Link>
                
              <div>{sOData?.customer?.shippingAddress?.attention}</div>
                <div>{sOData?.customer?.shippingAddress?.addressLine1}</div>
                <div>{sOData?.customer?.shippingAddress?.addressLine2}</div>
                <div>{sOData?.customer?.shippingAddress?.city} - {sOData?.customer?.shippingAddress?.state}</div>
                <div>INDIA - {sOData?.customer?.shippingAddress?.zipcode}</div>
              </div>
            </div> */}
          </div>
        </div>

        <div>
          <table className="table table-striped">
            <thead>
              <tr className='bg-primary'>
                <th>Item and Description</th>
                <th>ORDERED</th>
                {/* <th>STATUS</th>                 */}
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              { sOData?.items?.length > 0 && sOData?.items?.map((item) => <tr>
                <td>{item?.item}{item?.description}</td>
                <td>{item?.quantity}</td>
                {/* <td>{sOData?.isInvoiced ? 'Invoiced' : 'Not Invoiced'}</td> */}
                <td>{item?.unitCost}</td>
                <td>{item?.amount}</td>
              </tr>) }
              
            </tbody>
          </table>
        </div>

        <hr />

        <div className="d-flex justify-content-between">
          <div className="flex-grow-1"></div>
          <div className="flex-grow-1"></div>
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between">
              <p className="h4">Sub Total</p>
              <p className="h4">{sOData?.amount}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p className="h4 text-muted">Discount</p>
              <p className="h4 text-muted">(-)₹{sOData?.discount}</p>
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <p className="h4">Total</p>
              <p className="h4">{sOData?.grandTotal}</p>
            </div>
          </div>
        </div>

        <hr />
        { sOData?.customerNotes && 
          <div>
            <div className="h4">More Information</div>
            <div>
              <p className="h5 text-muted">NOTES</p>
              <p className="text-muted ml-3">{sOData?.customerNotes}</p>
            </div>
            <div>
              <p className="h5 text-muted">TERMS AND CONDITIONS</p>
              <p className="text-muted ml-3">{sOData?.termsAndConditions}</p>
            </div>
          </div>
        }

        <hr />
      </>
    )
  }

  const pdfView = () => {
    return(
      <>
        <div style={{ height: "100vh" }} className="d-flex justify-content-center">
        <object data={sOData?.pdf_url} type="application/pdf" width={"80%"} height="100%">
          <p>PDF Not Available</p>
        </object> 
      </div>
      </>
    )
  }

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>SALES ORDER</title>
        <meta name="description" content="vendor bill" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col">
              <h3 className="page-title">{sOData?.salesOrder}</h3>
            </div>
            <div className="col">
              <div className='rounded-circle bg-primary p-2 float-right'>
                <a href={sOData?.pdf_url} target="_blank" className="text-light" download>
                  <Download />
                </a>
              </div>
              <div className='rounded-circle bg-primary p-2 float-right mr-2'>
                <Link
                  to={"#"}
                  className="text-light"
                  data-toggle="modal"
                  data-target="#delete_salesorder"
                >
                  <Delete />
                </Link>
              </div>
              {
                sOData?.status !== "CLOSED" &&
                <>
              
              {

                <>
                  <div className='rounded-circle bg-primary p-2 float-right mr-2'>
                    <Link
                      to={{pathname : "/app/apps/email", state: {
                        id: sOData?._id,
                        subject: `Details for order ${sOData?.salesOrder}`,
                        pdf: sOData?.pdf_url,
                        index: sOData?.salesOrder,
                        type: 'sale-order',
                        emailId: sOData?.customer?.email,
                        backTo: -2
                      } }}
                      className="text-light"
                    >
                      <Email />
                    </Link>
                  </div>

                  { !sOData?.isInvoiced && 
                  <>
                    <div className='rounded-circle bg-primary p-2 float-right mr-2'>
                      <Link
                        to={{pathname : "/app/sales/createsalesorder", state: { ...sOData, edit: true} }}
                        className="text-light"
                      >
                        <Edit />
                      </Link>
                    </div>
                    <div className="btn btn-primary float-right mr-2">
                      <Link
                        className='text-light'
                        to={{ pathname:`/app/sales/createInvoice`, state: {...sOData, edit: true, sOConvert: true} }}
                      >Convert to Invoice</Link>
                    </div>
                  </>
                  }

                  {sOData?.status === 'OPEN' && (
                    <div className="btn btn-primary float-right mr-2">
                      <Link
                        to={"#"}
                        className="text-light"
                        onClick={() => {
                          handleConfirmStatus()
                        }}
                      >
                        Mark as Confirmed</Link>
                    </div>
                  )}
                </>
              }
              </>}
            </div>
          </div>
        </div>

        
        <div>
          <div className="custom-control custom-switch float-right">
            <input type="checkbox" className="custom-control-input" id="customSwitch1"
              onChange={() => setViewPDF(!viewPDF)}
            />
            <label className="custom-control-label" htmlFor="customSwitch1">Show PDF View</label>
          </div>
        </div>

        { 
        viewPDF ?
        pdfView()
        :
        SalesOrderView()
        }

        {/* Delete Sales Order Modal */}
        <div
          className="modal custom-modal fade"
          id="delete_salesorder"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <div className="form-header">
                  <h3>Delete Sales Order</h3>
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
    </div>
  )
}

export default SalesOrderInfo;