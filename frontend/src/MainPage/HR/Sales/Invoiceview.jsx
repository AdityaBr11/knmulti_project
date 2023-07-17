import { Delete, Download, Edit, Email, Upload } from '@mui/icons-material';
import { parseInt } from 'lodash';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useParams, useHistory } from 'react-router-dom'
import { toast } from 'react-toastify';
import httpService from '../../../lib/httpService';

const InvoiceView = () => {
  const { id } = useParams();

  const [ invData, setInvData ] = useState("");

  const [ customerPayCreditInfo, setCustomerPayCreditInfo ] = useState([]);
  const [ customerPayCreditAmount, setCustomerPayCreditAmount ] = useState(0);

  const [ isDelete, setisDelete ] = useState(false);

  const [ viewPDF, setViewPDF ] = useState(false);

  const history = useHistory()

  const fetchInvoices = async () => {
    toast
      .promise(
        httpService.get(`/sale-invoice/${id}`),
        {
          error: 'Failed to fetch Invoice',
          success: 'Invoice fetched successfully',
          pending: 'fetching Invoices...',
        }
      )
      .then((res) => {
        setInvData(res.data);
        fetchCredits(res.data.customer?._id)
        console.log(res.data);
        const pRData = res?.data?.paymentReceived.filter(pr => pr.id != null);
        console.log({pRData})
        if(!pRData.length){
          setisDelete(true);
        }
      });
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

  const fetchCredits = async (customerId) => {
    toast
      .promise(
        httpService.get(`/sale-payment?customer=${customerId}`),
        {
          error: 'Failed to fetch Advance Payment',
          success: 'Advance Payment fetched successfully',
          pending: 'fetching Advance Payments...',
        }
      )
      .then((res) => {
        // setInvData(res.data)
        const payData = res.data.filter(pay => pay?.excessAmount > 0);
        setCustomerPayCreditInfo(payData);
        const advPayAmt = payData.reduce((acc, curr) => {
          return acc + +curr?.excessAmount
        }, 0);
        setCustomerPayCreditAmount(advPayAmt);
      });
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

  useEffect(async () => {
    await fetchInvoices();
  }, []);

  const handleDelete = () => {
    toast
      .promise(
        httpService.delete(`/sale-invoice/${id}`),
        {
          error: 'Failed to delete Invoice',
          success: 'Invoice Deleted Successfully',
          pending: 'deleting Invoice...'
        }
      ).then((res) => {
        document.querySelectorAll('.cancel-btn')?.forEach((e) => e.click());
        history.goBack();
        history.goBack();
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
        document.querySelectorAll('.cancel-btn')?.forEach((e) => e.click());
        history.push("/app/sales/salesorder");
      });
  }

  const InvoiceInfoView = () => {
    return(
      <>
      <div className="d-flex">
          <div className="p-2 mr-2 flex-fill">
            {/* <p className="h2">INVOICE</p>
            <p className="h3">Invoice# {invData?.invoice}</p> */}
            {/* <span className="badge bg-warning p-2 h5">{invData?.status}</span> */}
            <table className="table table-borderless"> 
              <tbody>
                <tr>
                  <td>Order Number#</td>
                  <td>{invData?.orderNumber}</td>
                </tr>
                <tr>
                  <td>INVOICE DATE</td>
                  <td>{invData?.invoiceDate?.split("T")[0]}</td>
                </tr>
                <tr>
                  <td>TERMS</td>
                  <td>{invData?.terms}</td>
                </tr>
                <tr>
                  <td>DUE DATE</td>
                  <td>{invData?.dueDate?.split('T')[0]}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-2 ml-2 flex-fill">
            {
              invData?.customer?.billingAddress && (
                <div>
                  <p className="h5">BILL TO</p> 
                  <div className='ml-3'>
                  <Link to={`/app/profile/customer-profile/${invData?.customer?._id}`}>
                    <div>{invData?.customer?.displayName}</div>
                  </Link>
                    <div>{invData?.customer?.billingAddress?.attention}</div>
                    <div>{invData?.customer?.billingAddress?.addressLine1}</div>
                    <div>{invData?.customer?.billingAddress?.addressLine2}</div>
                    <div>{invData?.customer?.billingAddress?.city} - {invData?.customer?.billingAddress?.state}</div>
                    <div>INDIA - {invData?.customer?.billingAddress?.zipcode}</div>
                  </div>
                </div>
              )
            }
            <hr />
            {/* {
              invData?.customer?.shippingAddress && (
                <div>
                  <p className="h5">SHIPPING ADDRESS</p>
                  <div className="ml-3">
                  <Link to={`/app/profile/customer-profile/${invData?.customer?._id}`}>
                    <div>{invData?.customer?.displayName}</div>
                  </Link>
                    
                  <div>{invData?.customer?.shippingAddress?.attention}</div>
                    <div>{invData?.customer?.shippingAddress?.addressLine1}</div>
                    <div>{invData?.customer?.shippingAddress?.addressLine2}</div>
                    <div>{invData?.customer?.shippingAddress?.city} - {invData?.customer?.shippingAddress?.state}</div>
                    <div>INDIA - {invData?.customer?.shippingAddress?.zipcode}</div>
                  </div>
                </div>
              )
            } */}
          </div>
        </div>

        <div>
          <table className="table table-striped">
            <thead>
              <tr className='bg-primary'>
                <th>Item and Description</th>
                <th>QTY</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              { invData?.items?.length > 0 && invData?.items?.map((item) => <tr>
                <td>{item?.item} - {item?.description}</td>
                <td>{item?.quantity}</td>
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
              <p className="h4">{invData?.amount}</p>
            </div>
            {invData.discount && (<div className="d-flex justify-content-between">
              <p className="h4 text-muted">Discount</p>
              <p className="h4 text-muted">- ₹{invData?.discount}</p>
            </div>)}
            {invData?.taxType === 'tds' && (
              <div className="d-flex justify-content-between">
                <p className="h4 text-muted">Amount Withheld (Section 194 H)</p>
                <p className="h4 text-muted">- ₹{invData?.taxationAmount}</p>
              </div>
            )}
            {invData?.taxType === 'tcs' && (
              <div className="d-flex justify-content-between">
                <p className="h4 text-muted">Tax</p>
                <p className="h4 text-muted">₹{invData?.taxationAmount}</p>
              </div>
            )}
            {invData?.adjustments > 0 && (
              <div className="d-flex justify-content-between">
                <p className="h4 text-muted">Adjustment</p>
                <p className="h4 text-muted">₹{invData?.adjustments}</p>
              </div>
            )}
            {invData.taxType === 'tds' && (
              <div className="d-flex justify-content-between">
                <p className="h4 text-muted">Total</p>
                <p className="h4 text-muted">₹{invData?.amount - invData?.discount - invData.taxationAmount + invData?.adjustments}</p>
              </div>
            )}
            {invData.taxType === 'tcs' && (
              <div className="d-flex justify-content-between">
                <p className="h4 text-muted">Total</p>
                <p className="h4 text-muted">₹{invData?.amount - invData?.discount + invData.taxationAmount + invData?.adjustments}</p>
              </div>
            )}
            {invData?.paidAmount > 0 && (
              <div className="d-flex justify-content-between">
                <p className="h4 text-muted">Payment Made</p>
                <p className="h4 text-muted">- ₹{invData?.paidAmount}</p>
              </div>
            )}
            {invData?.withholdingTax > 0 && (
              <div className="d-flex justify-content-between">
                <p className="h4 text-muted">Amount Withheld</p>
                <p className="h4 text-muted">- ₹{invData?.withholdingTax}</p>
              </div>
            )}
            <hr />
            <div className="d-flex justify-content-between">
              <p className="h4">Balance Due</p>
              <p className="h4">{invData?.grandTotal - invData?.paidAmount - invData?.withholdingTax}</p>
            </div>
          </div>
        </div>

        <hr />
        { invData?.customerNotes && 
          <div>
            <div className="h4">More Information</div>
            <div>
              <p className="h5 text-muted">NOTES</p>
              <p className="text-muted ml-3">{invData?.customerNotes}</p>
            </div>
            <div>
              <p className="h5 text-muted">TERMS AND CONDITIONS</p>
              <p className="text-muted ml-3">{invData?.termsAndConditions}</p>
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
        <object data={invData?.pdf_url} type="application/pdf" width={"80%"} height="100%">
          <p>PDF Not Available</p>
        </object> 
      </div>
      </>
    )
  }

  const DeleteInvPopUp = () => {
    return(
      <div
          className="modal custom-modal fade"
          id="delete_invoice"
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
    )
  }

  const GoToPayPopUp = () => {
    return(
      <div
          className="modal custom-modal fade"
          id="delete_invoice"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <div className="form-header">
                  <h3>Delete Invoice</h3>
                  <p>Please Delete the Related Payments...</p>
                </div>
                <div className="modal-btn delete-action">
                  <div className="row">
                    <div className="col-6">
                      <Link
                        className="btn btn-primary continue-btn"
                        to={{ pathname:`/app/sales/payment-received`, state: { customerId: invData?.customer?._id, customerInv: invData?._id } }}
                        onClick={(e) => {
                          e.preventDefault();
                          document.querySelectorAll('.cancel-btn')?.forEach((e) => e.click());
                            history.push({ pathname:`/app/sales/payment-received`, state: { customerId: invData?.customer?._id, customerInv: invData?._id } });
                        }}
                      >Go to Payments</Link>

                  {/* <Link
                    className='text-light'
                    to={{ pathname:`/app/sales/payment-received`, state: { customerId: invData?.customer?._id, customerInv: invData?._id } }}
                  >View Payment</Link> */}
                
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
    )
  }

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>INVOICE</title>
        <meta name="description" content="vendor bill" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col d-flex">
              <h3 className="page-title">INVOICE :- {invData?.invoice} </h3> <span className={ invData?.status == 'PAID' ? 'badge bg-success p-2 h5 ml-2' : invData?.status == 'PARTIAL' ? 'badge bg-warning p-2 h5 ml-2' : 'badge bg-danger p-2 h5 ml-2' }>{invData?.status}</span>
            </div>
            <div className="col">
              <div className='rounded-circle bg-primary p-2 float-right'>
                <a href={invData?.pdf_url} target="_blank" className="text-light" download>
                  <Download />
                </a>
              </div>
              {/* { isDelete &&  */}
                <div className='rounded-circle bg-primary p-2 float-right mr-2'>
                  <Link
                    to={"#"}
                    className="text-light"
                    data-toggle="modal"
                    data-target="#delete_invoice"
                  >
                    <Delete />
                  </Link>
                </div>
              {/* } */}
              <div className='rounded-circle bg-primary p-2 float-right mr-2'>
                <Link 
                  className="text-light"
                  to={{ pathname: "/app/apps/email", state: {
                    id: invData?._id,
                    subject: `Details for Invoice ${invData?.invoice}`,
                    pdf: invData?.pdf_url,
                    index: invData?.invoice,
                    type: 'sale-invoice',
                    emailId: invData?.customer?.email,
                    backTo: -2
                  }}}
                >
                  <Email />
                </Link>
              </div>

              {
                invData?.status === "OPEN" && 

                <div className='rounded-circle bg-primary p-2 float-right mr-2'>
                  <Link 
                    className="text-light"
                    to={{ pathname: "/app/sales/createinvoice", state: { ...invData, edit: true }}}
                  >
                    <Edit />
                  </Link>
                </div>
              }

              {
                invData?.status !== "PAID" &&
                <>
                  <div className="btn btn-primary float-right mr-2">
                    <Link
                      className='text-light'
                      to={{ pathname:`/app/sales/record-payment`, state: {...invData, edit: true, sOConvert: true} }}
                    >Record Payment</Link>
                  </div>
                  {/* <div className="btn btn-primary float-right mr-2">
                    <Link
                      className='text-light'
                      to={{ pathname:`/app/sales/create-credit-note`, state: {...invData, sOConvert: true} }}
                    >Create Credit Note</Link>
                  </div> */}
                  {/* <div className="btn btn-primary float-right mr-2">
                    <Link
                      className='text-light'
                      to={{ pathname:`/app/sales/apply-credits`, state: { customerPayCreditInfo, invID: invData?._id, invNo: invData?.invoice, invBalDue: invData?.balance, invData } }}
                    >Advance Payment {customerPayCreditAmount}</Link>
                  </div> */}
                </>
              }
              { 
                invData?.paymentReceived?.length != 0 && !isDelete &&
                <div className="btn btn-primary float-right mr-2">
                  <Link
                    className='text-light'
                    to={{ pathname:`/app/sales/payment-received`, state: { customerId: invData?.customer?._id, customerInv: invData?._id } }}
                  >View Payment</Link>
                </div>
              }
            </div>
          </div>
          { invData?.status !== "PAID" && customerPayCreditAmount != 0 &&
          <div className="row mt-2">
            <div className="col">
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
            Advance Payment Available!: <strong>₹ {customerPayCreditAmount}</strong>  <Link
                      className='text-gray ml-2'
                      to={{ pathname:`/app/sales/apply-credits`, state: { customerPayCreditInfo, invID: invData?._id, invNo: invData?.invoice, invBalDue: invData?.balance, invData } }}
                    >Apply Now</Link>
              {/* <button type="button" class="btn btn-close" data-bs-dismiss="alert" aria-label="Close">x</button> */}
            </div>
            </div>
          </div>
          }
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
        InvoiceInfoView()
        }

        {
          isDelete ?
            DeleteInvPopUp()
          :
            GoToPayPopUp()
        }

      </div>
    </div>
  )
}


export default InvoiceView;