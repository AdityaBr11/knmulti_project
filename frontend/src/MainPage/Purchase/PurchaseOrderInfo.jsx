import { Delete, Download, Edit, Email, Upload } from '@mui/icons-material';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useHistory, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import httpService from '../../lib/httpService';
import DeleteModel from './DeleteModel';
import FileUploadModel from './FileUploadModel';

const PurchaseOrderInfo = () => {
  const { id } = useParams();
  const history = useHistory();

  const [pOData, setPOData] = useState("");
  const [viewPDF, setViewPDF] = useState(false);

  console.log({ pOData }, 'viewPDF');

  const fetchVendorBillInfo = () => {
    toast
      .promise(
        httpService.get(`/vendortrx/getvendorpurchaseorder?_id=${id}`),
        {
          error: 'Failed to fetch vendor Purchase Order',
          success: 'Purchase Order fetch successfully',
          pending: 'fetching vendor Purchase Order...',
        }
      )
      .then((res) => setPOData(res.data[0]));
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

  const deletepurchaseOrder = () => {
    toast
      .promise(
        httpService.delete(`/vendortrx/removepurchaseorder/${id}`),
        {
          error: 'Failed to delete vendor purchase order',
          success: 'purchase order deleted successfully',
          pending: 'deleting vendor purchase order...',
        }
      )
      .then((res) => { history.goBack(); history.goBack(); });
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

  const markCancel = () => {
    toast
      .promise(
        httpService.put(`/vendortrx/updatepurchaseorder/${id}`, { status: "CANCELLED" }),
        {
          error: 'Failed to update purchase order',
          success: 'Purchase Order updated successfully',
          pending: 'Updating vendor Purchase Order...',
        }
      )
      .then((res) => fetchVendorBillInfo());
  }

  useEffect(() => {
    fetchVendorBillInfo()
  }, []);

  const PurchaseOrderView = () => {
    return (
      <>
        <div className="d-flex">
          <div className="p-2 mr-2 flex-fill">
            {/* <p className="h2">PURCHASE ORDER</p>
            <p className="h3">Purchase Order# {pOData?.purchaseOrderNo}</p>
            <span className="badge bg-warning p-2 h5">{pOData?.status}</span> */}
            <table className="table table-borderless">
              <tbody>
                <tr>
                  <td>REFERENCE#</td>
                  <td>{pOData?.referenceId}</td>
                </tr>
                <tr>
                  <td>ORDER DATE</td>
                  <td>{pOData?.purchareOrderDate?.split("T")[0]}</td>
                </tr>
                <tr>
                  <td>DELIVERY DATE</td>
                  <td>{pOData?.expentedDeliveryDate?.split("T")[0]}</td>
                </tr>
                <tr>
                  <td>PAYMENT TERMS</td>
                  <td>{pOData?.paymentTerms}</td>
                </tr>
                <tr>
                  <td>Poject Name</td>
                  <td>
                    <Link to={`/app/projects/projects-view/${pOData?.projectId?._id}`}>
                      {pOData?.projectId?.name}
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-2 ml-2 flex-fill">
            <div>
              <p className="h5">Vendor</p>
              <div className='ml-3'>
                <Link to={`/app/profile/vendor-profile/${pOData?.vendorId?._id}`}>
                  <div>{pOData?.vendorId?.name}</div>
                </Link>
                <div>{pOData?.vendorId?.billAddress?.attention}</div>
                <div>{pOData?.vendorId?.billAddress?.address}</div>
                <div>{pOData?.vendorId?.billAddress?.city} - {pOData?.vendorId?.billAddress?.state}</div>
                <div>{pOData?.vendorId?.billAddress?.country} - {pOData?.vendorId?.billAddress?.pincode}</div>
              </div>
            </div>
            <hr />
            <div>
              {/* <p className="h5">Delivery ADDRESS</p> */}
              {pOData?.deliveryTo == "Customer" &&
                <>
                  <p className="h5">Customer</p>
                  <div className="ml-3">
                    <Link to={`/app/profile/customer-profile/${pOData?.customerId?._id}`}>
                      <div>{pOData?.customerId?.displayName}</div>
                    </Link>

                    <div>{pOData?.customerId?.billingAddress?.attention}</div>
                    <div>{pOData?.customerId?.billingAddress?.addressLine1}, {pOData?.customerId?.billingAddress?.addressLine2}</div>
                    <div>{pOData?.customerId?.billingAddress?.city} - {pOData?.customerId?.billingAddress?.state}</div>
                    <div>{pOData?.customerId?.billingAddress?.country} - {pOData?.customerId?.billingAddress?.zipcode}</div>
                  </div>
                </>
              }
              {pOData?.deliveryTo == "Organisation" &&
                <>
                  <p className="h5">Organisation</p>
                  <div className="ml-3">
                    <div>{pOData?.organisationData?.name}</div>
                    <pre style={{ fontFamily: "Lato", fontSize: "1rem" }}>{pOData?.organisationData?.address}</pre>
                  </div>
                </>
              }
            </div>
          </div>
        </div>

        <div>
          <table className="table table-striped">
            <thead>
              <tr className='bg-primary'>
                <th>Item and Description</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {pOData?.transaction?.length > 0 && pOData?.transaction.map((trx) => <tr>
                <td>{trx?.itemDetails}</td>
                <td>{trx?.quantity}</td>
                <td>{trx?.unit}</td>
                <td>{trx?.rate}</td>
                <td>₹ {trx?.amount}</td>
              </tr>)}

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
              <p className="h4">₹{pOData?.subTotal}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p className="h4 text-muted">Discount</p>
              <p className="h4 text-muted">(-)₹{pOData?.discountAmount}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p className="h4 text-muted">Tax</p>
              <p className="h4 text-muted">₹{pOData?.taxAmount}</p>
            </div>
            {
              pOData?.adjustment?.adjustmentValue !== 0 &&
              <div className="d-flex justify-content-between">
                <p className="h4 text-muted">{pOData?.adjustment?.adjustmentName}</p>
                <p className="h4 text-muted">₹{pOData?.adjustment?.adjustmentValue}</p>
              </div>
            }
            <hr />
            <div className="d-flex justify-content-between">
              <p className="h4">Total</p>
              <p className="h4">₹{pOData?.total}</p>
            </div>
          </div>
        </div>

        <hr />
        {pOData?.notes &&
          <div>
            <div className="h4">More Information</div>
            <div>
              <p className="h5 text-muted">NOTES</p>
              <p className="text-muted ml-3">{pOData?.notes}</p>
            </div>
            <div>
              <p className="h5 text-muted">TERMS AND CONDITIONS</p>
              <p className="text-muted ml-3">{pOData?.termsAndConditions}</p>
            </div>
          </div>
        }

        <hr />
      </>
    )
  }

  const pdfView = () => {
    return (
      <>
        <div style={{ height: "100vh" }} className="d-flex justify-content-center">
          <object data={pOData?.pdf_url} type="application/pdf" width={"80%"} height="100%">
            <p>PDF Not Available</p>
          </object>
        </div>
      </>
    )
  }

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>PURCHASE ORDER</title>
        <meta name="description" content="vendor bill" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col d-flex">
              <h3 className="page-title mr-2">Purchase Order# {pOData?.purchaseOrderNo}</h3>
              <div>
                <span
                  className={pOData?.status === 'ISSUED' ? 'badge bg-success p-2 h5 ml-2' : pOData?.status == 'CANCELLED' ? 'badge bg-danger p-2 h5 ml-2' : 'badge bg-warning p-2 h5 ml-2'} >
                  {pOData?.status}
                </span>
              </div>
            </div>
            <div className="col">
              <div className='rounded-circle bg-primary p-2 float-right'>
                <a href={pOData?.pdf_url} target="_blank" className="text-light" download>
                  <Download />
                </a>
              </div>
              <div className='rounded-circle bg-primary p-2 float-right mr-2'>
                <Link
                  to={{
                    pathname: "/app/apps/email", state: {
                      id: pOData?._id,
                      subject: `Details for Purchase Order ${pOData?.purchaseOrderNo}`,
                      pdf: pOData?.pdf_url,
                      index: pOData?.purchaseOrderNo,
                      type: 'purchase-order',
                      emailId: `${pOData?.vendorId?.email} ${pOData?.customerId?.email}`,
                      backTo: -2
                    }
                  }}
                  className="text-light"
                >
                  <Email />
                </Link>
              </div>
              <div className='rounded-circle bg-primary p-2 float-right mr-2'>
                <Link
                  to={"#"}
                  className="text-light"
                  data-toggle="modal"
                  data-target="#delete_client"
                >
                  <Delete />
                </Link>
              </div>
              <div className='rounded-circle bg-primary p-2 float-right mr-2'>
                <Link
                  to={"#"}
                  className="text-light"
                  data-toggle="modal"
                  data-target="#upload_file"
                >
                  <Upload />
                </Link>
              </div>
              {
                pOData?.status !== "CANCELLED" &&
                <>

                  {
                    pOData?.billedStatus == "BILLED" ?
                      <div className="btn btn-primary float-right mr-2">
                        <Link
                          className='text-light'
                          to={{ pathname: `/app/purchase/billinfo/${pOData?.billInfo}` }}
                        >View Bill</Link>
                      </div>
                      :

                      <>
                        <div className='rounded-circle bg-primary p-2 float-right mr-2'>
                          <Link
                            to={{ pathname: "/app/purchase/addpurchaseorder", state: { pOData, edit: true } }}
                            className="text-light"
                          >
                            <Edit />
                          </Link>
                        </div>
                        <div className="btn btn-primary float-right mr-2">
                          <Link
                            className='text-light'
                            to={{ pathname: `/app/purchase/createbill`, state: { pOData: pOData, pOConversion: true } }}
                          >Convert to Bill</Link>
                        </div>
                        <div className="btn btn-primary float-right mr-2">
                          <Link
                            to={"#"}
                            className="text-light"
                            data-toggle="modal"
                            data-target="#mark_cancel"
                          >
                            Mark as Cancelled</Link>
                        </div>
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

        {viewPDF ?
          pdfView()
          :
          PurchaseOrderView()
        }

        <DeleteModel title="Purchase Order" fn={deletepurchaseOrder} />
        <FileUploadModel modLink={`/vendortrx/updatepurchaseorder/${pOData?._id}`} filesInfo={pOData?.fileInfos} />
        <>
          <div className="modal custom-modal fade close" id="mark_cancel" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-body">
                  <div className="form-header">
                    <h3>Mark as Cancelled</h3>
                    <p>Are you sure want to cancel?</p>
                  </div>
                  <div className="modal-btn delete-action">
                    <div className="row">
                      <div className="col-6">
                        <a
                          href=""
                          onClick={(e) => {
                            e.preventDefault();
                            markCancel();
                          }}
                          className="btn btn-primary continue-btn"

                        >
                          Yes
                        </a>
                      </div>
                      <div className="col-6">
                        <a
                          data-dismiss="modal"
                          className="btn btn-primary cancel-btn"
                        >
                          No
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  )
}

export default PurchaseOrderInfo