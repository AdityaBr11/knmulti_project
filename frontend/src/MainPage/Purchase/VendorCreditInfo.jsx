import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useParams, Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import httpService from '../../lib/httpService';
import { Delete, Download, Edit, Email, Upload } from '@mui/icons-material';
import DeleteModel from './DeleteModel';
import FileUploadModel from './FileUploadModel';

const VendorCreditInfo = () => {

  const { id } = useParams();
  const history = useHistory();

  const [ creditData, setCreditData ] = useState("");
  const [ viewPDF, setViewPDF ] = useState(false);

  const fetchVendorCreditInfo = () => {
    toast
      .promise(
        httpService.get(`/vendortrx/getvendorcredit?_id=${id}`),
        {
          error: 'Failed to fetch vendor credit',
          success: 'credit fetch successfully',
          pending: 'fetching vendor credit...',
        }
      )
      .then((res) => setCreditData(res.data[0]));
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

  const deleteVendorCredit = () => {
    toast
      .promise(
        httpService.delete(`/vendortrx/removevendorcredit/${id}`),
        {
          error: 'Failed to delete vendor credit',
          success: 'credit deleted successfully',
          pending: 'deleting vendor credit...',
        }
      )
      .then((res) => { history.goBack();
        history.goBack();
      });
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

 

  useEffect(() => {
    fetchVendorCreditInfo();
  }, []);

  const CreditView = () => {
    return(
      <>
      <div className="d-flex">
          <div class="p-2 mr-2 flex-fill">
            {/* <p class="h2">Vendor Credit</p>
            <p class="h3">Vendor Credit# {creditData?.creditOrder}</p>
            <span class="badge bg-warning p-2 h5">{creditData?.status}</span> */}
            <table class="table table-borderless"> 
              <tbody>
                <tr>
                  <td>ORDER DATE</td>
                  <td>{creditData?.vendorCreditDate?.split("T")[0]}</td>
                </tr>
                <tr>
                  <td>REFERENCE#</td>
                  <td>{creditData?.orderNo}</td>
                </tr>
                
              </tbody>
            </table>
          </div>
          <div class="p-2 ml-2 flex-fill">
            <div>
              <p class="h5">VENDOR ADDRESS</p> 
              <div className='ml-3'>
              <Link to={`/app/profile/vendor-profile/${creditData?.vendorId?._id}`}>
                <div>{creditData?.vendorId?.name}</div>
              </Link>
                <div>{creditData?.vendorId?.billAddress?.attention}</div>
                <div>{creditData?.vendorId?.billAddress?.address}</div>
                <div>{creditData?.vendorId?.billAddress?.city} - {creditData?.vendorId?.billAddress?.state}</div>
                <div>{creditData?.vendorId?.billAddress?.country} - {creditData?.vendorId?.billAddress?.pincode}</div>
              </div>
            </div>
            <hr />
            {/* <div>
              <p class="h5">Delivery ADDRESS</p>
              <div className="ml-3">
              <Link to={`/app/profile/customer-profile/${creditData?.customerId?._id}`}>
                <div>{creditData?.customerId?.displayName}</div>
              </Link>
                
                <div>{creditData?.customerId?.shippingAddress?.attention}</div>
                <div>{creditData?.customerId?.shippingAddress?.addressLine1}, {creditData?.customerId?.shippingAddress?.addressLine2}</div>
                <div>{creditData?.customerId?.shippingAddress?.city} - {creditData?.customerId?.shippingAddress?.state}</div>
                <div>{creditData?.customerId?.shippingAddress?.country} - {creditData?.customerId?.shippingAddress?.zipcode}</div>
              </div>
            </div> */}
          </div>
        </div>

        <div>
          <table class="table table-striped">
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
              { creditData?.transaction?.length > 0 && creditData?.transaction.map((trx) => <tr>
                <td>{trx?.itemDetails}</td>
                <td>{trx?.quantity}</td>
                <td>{trx?.unit}</td>
                <td>{trx?.rate}</td>
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
              <p className="h4">₹{creditData?.subTotal}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p className="h4 text-muted">Discount</p>
              <p className="h4 text-muted">(-)₹{creditData?.discountAmount}</p>
            </div>
            {/* <div className="d-flex justify-content-between">
              <p className="h4 text-muted">TDS</p>
              <p className="h4 text-muted">₹{creditData?.taxAmount}</p>
            </div>  */}
            {
              creditData?.adjustment?.adjustmentValue !== 0 &&
              <div className="d-flex justify-content-between">
                <p className="h4 text-muted">{creditData?.adjustment?.adjustmentName}</p>
                <p className="h4 text-muted">₹{creditData?.adjustment?.adjustmentValue}</p>
              </div>
            }
            <hr />
            <div className="d-flex justify-content-between">
              <p className="h4">Total</p>
              <p className="h4">₹{creditData?.total}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p className="h4 text-muted">Credit Used</p>
              <p className="h4 text-muted">(-)₹{creditData?.total - creditData?.balance}</p>
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
        <title>Vendor Credit Info</title>
        <meta name="description" content="Vendor Credit Info" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col d-flex">
              <h3 className="page-title mr-2">Vendor Credit# {creditData?.creditOrder}</h3>
              <div>
                <span 
                  className={ creditData?.status === 'OPEN' ? 'badge bg-success p-2 h5 ml-2' : creditData?.status == 'PARTIAL' ? 'badge bg-warning p-2 h5 ml-2' : 'badgebg-danger p-2 h5 ml-2' } >
                  {creditData?.status}
                </span>
              </div>
            </div>
            
            <div className="col">
              <div className='rounded-circle bg-primary p-2 float-right'>
                <a href={creditData?.pdf_url} target="_blank" className="text-light" download>
                  <Download />
                </a>
              </div>
              <div className='rounded-circle bg-primary p-2 float-right mr-2'>
                <Link
                  to={{pathname : "/app/apps/email", state: {
                    id: creditData?._id,
                    subject: `Details for Vendor Credit ${creditData?.creditOrder}`,
                    pdf: creditData?.pdf_url,
                    index: creditData?.creditOrder,
                    type: 'vendor-credit',
                    emailId: `${creditData?.vendorId?.email}`,
                    backTo: -2
                  } }}
                  className="text-light"
                >
                  <Email />
                </Link>
              </div>
              { creditData?.status == "OPEN" && 
              <div className='rounded-circle bg-primary p-2 float-right mr-2'>
                <Link
                  to={{pathname : "/app/purchase/addvendorcredit", state: {creditData, edit: true} }}
                  className="text-light"
                >
                  <Edit />
                </Link>
              </div>
              }
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
              { creditData?.status != "CLOSED" && 
              
                <div className="btn btn-primary float-right mr-2">
                  <Link
                    className='text-light'
                    to={{ pathname:`/app/purchase/creditvbill`, state: {creditData: creditData, vendorId: creditData?.vendorId?._id} }}
                  >Apply to Bills</Link>
                </div>
              }
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

        { viewPDF ?
        pdfView()
        :
        CreditView()
        }

        <DeleteModel title="Vendor Credit" fn={deleteVendorCredit} />
        <FileUploadModel modLink={`/vendortrx/updatevendorcredit/${creditData?._id}`} filesInfo={creditData?.fileInfos} />
        
      </div>
    </div>
  )
}

export default VendorCreditInfo