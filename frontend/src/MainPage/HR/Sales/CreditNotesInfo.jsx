import { Delete, Download, Edit, Email, Upload } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import httpService from '../../../lib/httpService';

const CreditNotesInfo = () => {

  const [creditData, setCreditData] = useState();
  const [ viewPDF, setViewPDF ] = useState(false);
  // const [invoices, setInvoices] = useState([]);
  const history  = useHistory();
  
  const fetchCreditNote = async (id) => {
    toast
      .promise(
        httpService.get(`/credit-note/${id}`),
        {
          error: 'Failed to fetch Credit Note',
          success: 'Credit Note Fetched Successfully',
          pending: 'fetching Credit Note...'
        }
      ).then(async (res) => {
        setCreditData(res.data);
        // console.log(res.data);
        await fetchInvoices(res.data.customer?._id);
      });
    
  }
  
  const [invoices, setInvoices] = useState([]);

  const fetchInvoices = async (id) => {
    const res = await toast.promise(
      httpService.get(`/customer/invoices/${id}`),
      {
        error: 'Failed to fetch Invoice',
        success: 'Invoices Fetched Successfully',
        pending: 'fetching Invoces...'
      }
    );
    setInvoices(res.data);
  }

  const { id } = useParams();
  useEffect(async () => {
    await fetchCreditNote(id);
  }, [])

  const CreditView = () => {
    return(
      <>
      <div className="d-flex">
          <div class="p-2 mr-2 flex-fill">
            <table class="table table-borderless"> 
              <tbody>
                <tr>
                  <td>ORDER DATE</td>
                  <td>{creditData?.creditDate?.split("T")[0]}</td>
                </tr>
                <tr>
                  <td>REFERENCE#</td>
                  <td>{creditData?.reference}</td>
                </tr>
                <tr>
                  <td>Subject</td>
                  <td>{creditData?.subject}</td>
                </tr>
                
              </tbody>
            </table>
          </div>
          <div class="p-2 ml-2 flex-fill">
            <div>
              <p class="h5">Customer ADDRESS</p> 
              <div className='ml-3'>
              <Link to={`/app/profile/customer-profile/${creditData?.customer?._id}`}>
                <div>{creditData?.customer?.displayName}</div>
              </Link>
                <div>{creditData?.customer?.billingAddress?.attention}</div>
                <div>{creditData?.customer?.billingAddress?.addressLine1}</div>
                <div>{creditData?.customer?.billingAddress?.addressLine2}</div>
                <div>{creditData?.customer?.billingAddress?.city} - {creditData?.customer?.billingAddress?.state}</div>
                <div>{creditData?.customer?.billingAddress?.zipcode}</div>
              </div>
            </div>
            <hr />
            
          </div>
        </div>

        <div>
          <table class="table table-striped">
            <thead>
              <tr className='bg-primary'>
                <th>Item and Description</th>
                <th>Qty</th>
                {/* <th>Unit</th> */}
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              { creditData?.items?.length > 0 && creditData?.items.map((trx) => <tr>
                <td>{trx?.item} - {trx?.description}</td>
                <td>{trx?.quantity}</td>
                <td>{trx?.unitCost}</td>
                <td>₹{trx?.amount}</td>
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
              <p className="h4">₹{creditData?.amount}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p className="h4">Tax Amount</p>
              <p className="h4">₹{creditData?.taxAmount}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p className="h4 text-muted">Discount</p>
              <p className="h4 text-muted">(-)₹{creditData?.discount}</p>
            </div>
            {/* <div className="d-flex justify-content-between">
              <p className="h4 text-muted">TDS</p>
              <p className="h4 text-muted">₹{creditData?.taxAmount}</p>
            </div>  */}
            {/* {
              creditData?.adjustment?.adjustmentValue !== 0 &&
              <div className="d-flex justify-content-between">
                <p className="h4 text-muted">{creditData?.adjustment?.adjustmentName}</p>
                <p className="h4 text-muted">₹{creditData?.adjustment?.adjustmentValue}</p>
              </div>
            } */}
            <hr />
            <div className="d-flex justify-content-between">
              <p className="h4">Total</p>
              <p className="h4">₹{creditData?.grandTotal}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p className="h4 text-danger">Credit Used</p>
              <p className="h4 text-danger">(-)₹{creditData?.creditUsed}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p className="h4">Credit Remaining</p>
              <p className="h4">₹{creditData?.balance}</p>
            </div>
          </div>
        </div>

        <hr />
        { creditData?.notes && 
          <div>
            <div className="h4">More Information</div>
            <div>
              <p className="h5 text-muted">NOTES</p>
              <p className="text-muted ml-3">{creditData?.notes}</p>
            </div>
            {/* <div>
              <p className="h5 text-muted">TERMS AND CONDITIONS</p>
              <p className="text-muted ml-3">{creditData?.termsAndConditions}</p>
            </div> */}
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
        <object data={creditData?.pdf_url} type="application/pdf" width={"80%"} height="100%">
          <p>PDF Not Available</p>
        </object> 
      </div>
      </>
    )
  }

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>CREDIT NOTES</title>
        <meta name="description" content="vendor bill" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col d-flex">
              <h3 className="page-title">Credit Note# {creditData?.creditNote}</h3>
              <span class={creditData?.status == "CLOSED" ? 'badge bg-secondary p-2 h5 ml-2' : creditData?.status == "PARTIAL" ? 'badge bg-warning p-2 h5 ml-2' : 'badge bg-success p-2 h5 ml-2'}>{creditData?.status}</span>
            </div>
            <div className="col-md-8">
              <div className='rounded-circle bg-primary p-2 float-right'>
                <a href={creditData?.pdf_url} target="_blank" className="text-light" download>
                  <Download />
                </a>
              </div>
                <>
                  <div className='rounded-circle bg-primary p-2 float-right mr-2'>
                    <Link
                      to={{ pathname : "/app/apps/email", state: {
                        id: creditData?._id,
                        subject: `Details for Credit Note: ${creditData?.creditNote}`,
                        pdf: creditData?.pdf_url,
                        index: creditData?.creditNote,
                        type: 'credit-note',
                        emailId: creditData?.customer?.email,
                        backTo: -2
                      }}}
                      className="text-light"
                    >
                      <Email />
                    </Link>
                  </div>

                  {
                    creditData?.status === 'OPEN' && (
                      <>
                        <div className='rounded-circle bg-primary p-2 float-right mr-2'>
                          <Link
                            to={{ pathname : "/app/sales/create-credit-note", state: { ...creditData, edit: true }}}
                            className="text-light"
                          >
                            <Edit />
                          </Link>
                        </div>
                      </> 
                      )
                  }
                  {
                    creditData?.status !== 'CLOSED' && (
                      <>
                        <div className="btn btn-primary float-right mr-2">
                          <Link
                            className='text-light'
                            data-toggle="modal"
                            data-target="#apply_invoice"
                          >Apply To Invoice</Link>
                        </div>
                        {/* <div className="btn btn-primary float-right mr-2">
                          <Link
                            className='text-light'
                          >Refund</Link>
                        </div> */}

                      </>
                    )
                  }                  
                </>
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
        
        {/* {pdfView()} */}

        { viewPDF ?
        pdfView()
        :
        CreditView()
        }

        <ApplyToInvoice 
          creditData={creditData} 
          invoices={invoices}
          fetchCreditNote={fetchCreditNote}
        />

      </div>
    </div>
  );
};

const ApplyToInvoice = ({ creditData, invoices, fetchCreditNote }) => {

  const [invoiceUpdate, setInvoiceUpdate] = useState([]);
  const [creditAmount, setCreditAmount] = useState(0);

  const handleAmountAddition = (e, index) => {
    let updateData = [...invoiceUpdate];
    let proceed = true
    updateData.forEach((ud) => {
      if (ud.id === invoices[index]._id) {
        ud.credited = parseInt(e.target.value);
        proceed = false;
      }
    })
    if (proceed) {
      updateData.push({
        id: invoices[index]._id,
        credited: parseInt(e.target.value),
      });
      setInvoiceUpdate(updateData);
      setCreditAmount(0)
    } else {
      setInvoiceUpdate(updateData);
      setCreditAmount(0)
    }
  }

  useEffect(() => {
    let total = 0;
    invoiceUpdate.forEach(inv => {
      total += inv.credited;
    })
    setCreditAmount(total)
  }, [invoiceUpdate])

  const handleSubmit = async () => {
    console.log(invoiceUpdate);
    await toast
      .promise(
        httpService.put(`/credit-note/invoice-update/${creditData?._id}`, invoiceUpdate),
        {
          error: 'Failed to apply to Invoice',
          success: 'Applied to Invoices Successfully',
          pending: 'Applying to Invoces...'
        }
      )
      setInvoiceUpdate([]);
      setCreditAmount(0);
      await fetchCreditNote(creditData._id);
      document.querySelectorAll('.tab')?.forEach((e) => e.click());
  }

  return (
    <div
      className="modal custom-modal fade tab"
      id="apply_invoice"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg mw-100 w-75">
        <div className="modal-content">
          <div className="modal-body">
            <div className="form-header">
              <h3>Apply Credits from {`${creditData?.creditNote}`}</h3>
            </div>
            <div className="col-md-12 col-sm-12">
              <div className="table-responsive">
                <table className="table table-hover table-white">
                  <thead>
                    <tr className="text-center">
                      <th>Invoice Number</th>
                      <th>Invoice Date</th>
                      <th>Invoice Amount</th>
                      <th>Invoice Balance</th>
                      <th>Amount To Credit</th>
                    </tr>
                  </thead>
                  <tbody> 
                    {
                      invoices?.map((p, index) => 
                        (
                          <tr className="text-center" 
                          key={index}
                          >
                            <td>
                              {p?.invoice}
                            </td>
                            <td>
                              {p?.invoiceDate.split('T')[0]}
                            </td>
                            <td>
                              {p?.grandTotal}
                            </td>
                            <td>
                              {p?.grandTotal - p?.paidAmount - p?.withholdingTax - p?.credits}
                            </td>
                            <td>
                              <input className="form-control" type="number"
                              onChange={(e) => handleAmountAddition(e, index)}
                              />
                            </td>
                          </tr>
                        )
                      )
                    }
                  </tbody>
                </table>
              </div>
              <div className="table-responsive">
                <table className="table table-hover table-white">
                  <tbody>
                    <tr>
                      <td />
                      <td />
                      <td />
                      <td />
                      <td className="text-right">Amount To Credit</td>
                      <td
                        style={{
                          textAlign: 'right',
                          paddingRight: '30px',
                          width: '230px',
                        }}
                      >
                        {creditAmount}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={5} className="text-right">
                        Remaining Credits
                      </td>
                      <td
                        style={{
                          textAlign: 'right',
                          paddingRight: '30px',
                          width: '230px',
                        }}
                      >
                        {creditData?.grandTotal - creditData?.creditUsed - creditAmount}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-btn delete-action">
              <div className="row">
                <div className="col-6">
                  <a onClick={(e) => {
                    e.preventDefault();
                    handleSubmit()
                  }}
                  href="" className="btn btn-primary continue-btn">
                    Save
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
  );
}

export default CreditNotesInfo;
