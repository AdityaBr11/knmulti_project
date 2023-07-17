import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useHistory, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import httpService from '../../lib/httpService';
import { Link } from 'react-router-dom';
import { Delete, Download, Edit, Email, Upload } from '@mui/icons-material';
import DeleteModel from './DeleteModel';
import FileUploadModel from './FileUploadModel';

const BillInfo = () => {

  const { id } = useParams();

  const history = useHistory();

  const [ BillData, setBillData ] = useState("");

  const [ vendorPayCreditInfo, setVendorPayCreditInfo ] = useState([]);
  const [ vendorPayCreditAmount, setVendorPayCreditAmount ] = useState(0);

  const [ viewPDF, setViewPDF ] = useState(false);

  const fetchVendorBillInfo = () => {
    toast
      .promise(
        httpService.get(`/vendortrx/getvendorbills?_id=${id}`),
        {
          error: 'Failed to fetch vendor bills',
          success: 'Bills fetch successfully',
          pending: 'fetching vendor bill...',
        }
      )
      .then((res) => {
        setBillData(res.data[0]);
        fetchCredits(res.data[0]?.vendorId?._id);
      })
      // .then((res) => fetchPaymentOfBill());
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

  const deleteVendorBill = () => {
    toast
      .promise(
        httpService.delete(`/vendortrx/removevendorbill/${id}`),
        {
          error: 'Failed to delete vendor bills',
          success: 'Bill deleted successfully',
          pending: 'deleting vendor bill...',
        }
      )
      .then((res) => { history.goBack();
        history.goBack();
      });
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

  const fetchCredits = async (vendorId) => {
    toast
      .promise(
        httpService.get(`/vendortrx/getvendorbillpayment?vendorId=${vendorId}`),
        {
          error: 'Failed to fetch Advance Payment',
          success: 'Advance Payment fetched successfully',
          pending: 'fetching Advance Payments...',
        }
      )
      .then((res) => {
        
        const payData = res.data.filter(pay => pay?.amountExcess > 0);
        console.log({payData})
        setVendorPayCreditInfo(payData);
        const advPayAmt = payData.reduce((acc, curr) => {
          return acc + +curr?.amountExcess
        }, 0);
        setVendorPayCreditAmount(advPayAmt);
      });
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

  // const fetchPaymentOfBill = () => {
  //   toast 
  //     .promise( httpService.get(`/vendortrx/getpaymentofbill?vendorId=${"627cedaa1a336f055fe0faf4"}&vendorBill=${"628250f61bd60756ba9766bc"}`),
  //       { error: 'Failed to fetch payment of bill', 
  //         success: 'Payment of bill fetched successfully', 
  //         pending: 'fetching payment of bill...' } 
  //     ) 
  //     .then( (res) => { console.log(res.data); } ); 
  //     document.querySelectorAll('.close')?.forEach((e) => e.click()); 
  // }


  useEffect(() => {
    fetchVendorBillInfo()
  }, []);

  // return(

  //   <div className="page-wrapper">
  //     {/* <div className="content container-fluid"> */}
  //       <div style={{ height: "100vh" }} className="bg-primary">
  //         {/* <object data={BillData?.pdf_url} type="application/pdf" width={"80%"} height="100%">
  //           <p>Alter</p>
  //         </object> */}
  //       <embed src={BillData?.pdf_url} type="application/pdf" width={"80%"} height="100%" />

  //       </div>
  //         {/* <iframe src={`BillData?.pdf_url`} width="100%" height={"100%"}></iframe> */}
  //     {/* </div> */}
  //   </div>
  // )

  const BillInfoView = () => {
    return(
      <div>

        <div className="d-flex">
          <div className="p-2 mr-2 flex-fill">
            {/* <p className="h2">Bill</p> */}
            {/* <p className="h3">Bill# {BillData?.billNo}</p>
            <span className="badge bg-warning p-2 h5">{BillData?.status}</span> */}
            <table className="table table-borderless"> 
              <tbody>
                <tr>
                  <td>ORDER NUMBER</td>
                  <td>{BillData?.orderNo}</td>
                </tr>
                <tr>
                  <td>BILL DATE</td>
                  <td>{BillData?.billDate?.split("T")[0]}</td>
                </tr>
                <tr>
                  <td>DUE DATE</td>
                  <td>{BillData?.dueDate?.split("T")[0]}</td>
                </tr>
                <tr>
                  <td>PAYMENT TERMS</td>
                  <td>{BillData?.paymentTerms}</td>
                </tr>
                <tr>
                  <td>BALANCE DUE</td>
                  <td>₹ {BillData?.balanceDue}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-2 ml-2 flex-fill">
            <p className="h5">VENDOR ADDRESS</p> 
            <Link to={`/app/profile/vendor-profile/${BillData?.vendorId?._id}`}>
              <p>{BillData?.vendorId?.name}</p>
            </Link>
            <div>{BillData?.vendorId?.billAddress?.attention}</div>
            <div>{BillData?.vendorId?.billAddress?.address}</div>
            <div>{BillData?.vendorId?.billAddress?.city} - {BillData?.vendorId?.billAddress?.state}</div>
            <div>{BillData?.vendorId?.billAddress?.country} - {BillData?.vendorId?.billAddress?.pincode}</div>
            <div>{BillData?.vendorId?.billAddress?.phone}</div>
            <hr />
            <p className="h5">PROJECT NAME</p> 
            <Link to={`/app/projects/projects-view/${BillData?.projectId?._id}`}>
              <p>{BillData?.projectId?.name}</p>
            </Link>
          </div>

          
        </div>

        <div>
          <table className="table table-striped">
            <thead>
              <tr className='bg-primary'>
                <th>Item and Description</th>
                <th>Account</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>

              { BillData?.transaction?.length > 0 && BillData?.transaction.map((trx) => <tr>
                <td>{trx?.itemDetails}</td>
                <td>{trx?.account}</td>
                <td>{trx?.quantity}</td>
                <td>{trx?.unit}</td>
                <td>{trx?.rate}</td>
                <td>₹ {trx?.amount}</td>
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
              <p className="h4">₹ {BillData?.subTotal}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p className="h4 text-muted">Discount</p>
              <p className="h4 text-muted">(-)₹{BillData?.discountAmount}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p className="h4 text-muted">Tax</p>
              <p className="h4 text-muted">₹{BillData?.taxAmount}</p>
            </div>
            {
              BillData?.adjustment?.adjustmentValue !== 0 &&
              <div className="d-flex justify-content-between">
                <p className="h4 text-muted">{BillData?.adjustment?.adjustmentName}</p>
                <p className="h4 text-muted">₹{BillData?.adjustment?.adjustmentValue}</p>
              </div>
            }
            <hr />
            <div className="d-flex justify-content-between">
              <p className="h4">Total</p>
              <p className="h4">₹ {BillData?.total}</p>
            </div>
            {
              BillData?.payments !== 0 &&
              <div className="d-flex justify-content-between">
                <p className="h4 text-muted">Payments Made</p>
                <p className="h4 text-primary">₹{BillData?.payments}</p>
              </div>
            }
            {
              BillData?.credit !== 0 &&
              <div className="d-flex justify-content-between">
                <p className="h4 text-muted">Credits </p>
                <p className="h4 text-primary">₹{BillData?.credit}</p>
              </div>
            }
              <div className="d-flex justify-content-between">
                <p className="h4">Balance Due</p>
                <p className="h4">₹{BillData?.balanceDue}</p>
              </div>
          </div>
        </div>

        <hr />
        { BillData?.notes && 
          <div>
            <div className="h4">More Information</div>
            <p className="text-muted">Notes: {BillData?.notes}</p>
          </div>
        }

        </div>
    )
  }

  const pdfView = () => {
    return(
      <div style={{ height: "100vh" }} className="d-flex justify-content-center">
        <object data={BillData?.pdf_url} type="application/pdf" width={"80%"} height="100%">
          <p>PDF Not Available</p>
        </object> 
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Bill Info</title>
        <meta name="description" content="vendor bill" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
          <div className="col d-flex">
              <h3 className="page-title mr-2">Bill# {BillData?.billNo}
              </h3>
              <div>
              <span 
                className={ BillData?.status === 'PAID' ? 'badge bg-success p-2 h5 ml-2' : BillData?.status == 'PARTIAL' ? 'badge bg-warning p-2 h5 ml-2' : 'badge bg-danger p-2 h5 ml-2' } >
                {BillData?.status}
              </span>
              </div>
            </div>
            <div className="col-md-8">
              <div className='rounded-circle bg-primary p-2 float-right'>
                <a href={BillData?.pdf_url} target="_blank" className="text-light" download>
                  <Download />
                </a>
              </div>
              <div className='rounded-circle bg-primary p-2 float-right mr-2'>
                <Link
                  to={{pathname : "/app/apps/email", state: {
                    id: BillData?._id,
                    subject: `Details for Bill ${BillData?.billNo}`,
                    pdf: BillData?.pdf_url,
                    index: BillData?.billNo,
                    type: 'purchase-bill',
                    emailId: `${BillData?.vendorId?.email}`,
                    backTo: -2
                  } }}
                  className="text-light"
                >
                  <Email />
                </Link>
              </div>

              {/* { BillData?.status == "OPEN" && 
                <div className='rounded-circle bg-primary p-2 float-right mr-2'>
                  <Link
                    to={{pathname : "/app/purchase/createbill", state: {BillData, edit: true} }}
                    className="text-light"
                  >
                    <Edit />
                  </Link>
                </div>
              } */}

              { BillData?.status == "OPEN" && 
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
              }
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
              { BillData?.status != "PAID" && 
              <div className="btn btn-primary float-right mr-2">
                <Link
                  className='text-light'
                  to={{ pathname:`/app/purchase/billpayment`, state: {vendorId: `${BillData?.vendorId?._id}`, billId: `${BillData?._id}`} }}
                >Record Payment</Link>
              </div>
              }
              <div className="btn btn-primary float-right mr-2">
                <Link
                  className='text-light'
                  to={{ pathname:`/app/purchase/paymentsmade`, state: {vendorId: `${BillData?.vendorId?._id}`, billId: `${BillData?._id}`} }}
                >View Payments</Link>
              </div>
              <div className="btn btn-primary float-right mr-2">
                <Link
                  className='text-light'
                  to={{ pathname:`/app/purchase/vendorcredit`, state: {vendorId: `${BillData?.vendorId?._id}`, billId: `${BillData?._id}`} }}
                >View Credits</Link>
              </div>
              <div className="btn btn-primary float-right mr-2">
                <Link
                  className='text-light'
                  to={{ pathname:`/app/purchase/addrecurringbill`, state: {billData : BillData, convertBill : true} }}
                >Make a Recurring</Link>
              </div>
            </div>
          </div>
          { BillData?.status !== "PAID" && vendorPayCreditAmount != 0 &&
          <div className="row mt-2">
            <div className="col">
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
            Advance Payment Available!: <strong>₹ {vendorPayCreditAmount}</strong>  
                    {/* <Link
                      className='text-gray ml-2'
                      to={{ pathname:`/app/sales/apply-credits`, state: { customerPayCreditInfo, invID: BillData?._id, invNo: BillData?.invoice, invBalDue: BillData?.balance, BillData } }}
                    >Apply Now</Link> */}
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

        { viewPDF ?
        pdfView()
        :
        BillInfoView()
        }
        
        <DeleteModel title="Vendor Bill" fn={deleteVendorBill} />
        <FileUploadModel modLink={`/vendortrx/updatevendorbill/${BillData?._id}`} filesInfo={BillData?.fileInfos} />
      </div>
    </div>
  )
}

export default BillInfo