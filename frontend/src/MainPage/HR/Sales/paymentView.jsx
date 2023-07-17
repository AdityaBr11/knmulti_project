import { Delete, Download, Edit, Email, Upload } from '@mui/icons-material';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useParams, useHistory } from 'react-router-dom'
import { toast } from 'react-toastify';
import httpService from '../../../lib/httpService';

const PaymentView = () => {
  const { id } = useParams();

  const [rPData, setRPData] = useState("");
  const [viewPDF, setViewPDF] = useState(false);
  const history = useHistory()

  const fetchPayment = async () => {
    toast
      .promise(
        httpService.get(`/sale-payment/${id}`),
        {
          error: 'Failed to fetch Payment Record',
          success: 'Payment Record fetched successfully',
          pending: 'fetching Payment record...',
        }
      )
      .then((res) => {
        console.log(res.data)
        setRPData(res.data)
      });
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

  useEffect(async () => {
    await fetchPayment()
  }, []);

  const handleDelete = () => {
    toast
      .promise(
        httpService.delete(`/sale-payment/${id}`),
        {
          error: 'Failed to delete Payment Record',
          success: 'Payment Record Deleted Successfully',
          pending: 'deleting Payment Record...'
        }
      ).then((res) => {
        document.querySelectorAll('.cancel-btn')?.forEach((e) => e.click());
        history.goBack();
        history.goBack();
      });
  }

  // const handleConfirmStatus = () => {
  //   toast
  //     .promise(
  //       httpService.put(`/sale-order/${id}`, { status: 'CONFIRMED' }),
  //       {
  //         error: 'Failed to update status',
  //         success: `${sOData?.salesOrder || ''} status updated successfully`,
  //         pending: 'updating'
  //       }
  //     ).then((res) => {
  //       document.querySelectorAll('.cancel-btn')?.forEach((e) => e.click());
  //       history.push("/app/sales/salesorder");
  //     });
  // }

  const Payments = () => {
    return (
      <>
        <div className="d-flex">
          <div className="p-2 mr-2 flex-fill">
            {/* <p className="h2">PAYMENT RECEIVED</p>
            <p className="h3">Payment# {rPData?.paymentNumber}</p> */}
            <table className="table table-borderless">
              <tbody>
                <tr>
                  <td>PAYMENT DATE</td>
                  <td>{rPData?.paymentDate?.split("T")[0]}</td>
                </tr>
                <tr>
                  <td>REFERENCE#</td>
                  <td>{rPData?.reference}</td>
                </tr>
                <tr>
                  <td>PAYMENT MODE</td>
                  <td>{rPData?.paymentMode}</td>
                </tr>
                <tr>
                  <td>DEPOSIT TO</td>
                  <td>{rPData?.depositTo}</td>
                </tr>
                <tr>
                  <td>PAYMENT AMOUNT</td>
                  <td>{rPData?.paymentAmount}</td>
                </tr>
                <tr>
                  <td>EXCESS AMOUNT</td>
                  <td>{rPData?.excessAmount || 0}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-2 ml-2 flex-fill">
            <div>
              <p className="h5">BILL TO</p>
              <div className='ml-3'>
                <Link to={`/app/profile/customer-profile/${rPData?.customer?._id}`}>
                  <div>{rPData?.customer?.displayName}</div>
                </Link>
                <div>{rPData?.customer?.billingAddress?.attention}</div>
                <div>{rPData?.customer?.billingAddress?.addressLine1}</div>
                <div>{rPData?.customer?.billingAddress?.addressLine2}</div>
                <div>{rPData?.customer?.billingAddress?.city} - {rPData?.customer?.billingAddress?.state}</div>
                <div>INDIA - {rPData?.customer?.billingAddress?.zipcode}</div>
              </div>
            </div>
            <hr />
          </div>
        </div>

        {rPData?.invoice?.length > 0 &&
          <div>
            <table className="table table-striped">
              <thead>
                <tr className='bg-primary'>
                  <th>Invoice Number</th>
                  <th>Invoice Date</th>
                  <th>Invoice Amount</th>
                  <th>Withhloding Tax</th>
                  <th>Payment Amount</th>
                </tr>
              </thead>
              <tbody>
                {rPData?.invoice?.length > 0 && rPData?.invoice?.map((inv) => <tr>
                  <Link to={`/app/sales/invoice-view/${inv?.id}`}>
                    <td className="text-blue">{inv?.invoiceNumber}</td>
                  </Link>
                  <td>{inv?.invoiceDate.split('T')[0]}</td>
                  <td>{inv?.invoiceAmount}</td>
                  <td>{inv?.withholdingTax}</td>
                  <td>{inv?.paidAmount}</td>
                </tr>)}
              </tbody>
            </table>
          </div>
        }
        <hr />

        {rPData?.notes &&
          <div>
            <div className="h4">More Information</div>
            <div>
              <p className="h5 text-muted">NOTES</p>
              <p className="text-muted ml-3">{rPData?.notes}</p>
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
          <object data={rPData?.pdf_url} type="application/pdf" width={"80%"} height="100%">
            <p>PDF Not Available</p>
          </object>
        </div>
      </>
    )
  }

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>PAYMENT RECEIPT</title>
        <meta name="description" content="vendor bill" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col">
              <h3 className="page-title">Payment#  {rPData?.paymentNumber}</h3>
            </div>
            <div className="col">
              <div className='rounded-circle bg-primary p-2 float-right'>
                <a href={rPData?.pdf_url} target="_blank" className="text-light" download>
                  <Download />
                </a>
              </div>
              <div className='rounded-circle bg-primary p-2 float-right mr-2'>
                <Link
                  to={"#"}
                  className="text-light"
                  data-toggle="modal"
                  data-target="#delete_payment"
                >
                  <Delete />
                </Link>
              </div>
              <div className='rounded-circle bg-primary p-2 float-right mr-2'>
                <Link
                  className="text-light"
                  to={{
                    pathname: "/app/apps/email", state: {
                      id: rPData?._id,
                      subject: `Details of Payment for: ${rPData?.paymentNumber}`,
                      pdf: rPData?.pdf_url,
                      index: rPData?.paymentNumber,
                      type: 'sale-payment',
                      emailId: rPData?.customer?.email,
                      backTo: -2
                    }
                  }}
                >
                  <Email />
                </Link>
              </div>
              {/* <div className="btn btn-primary float-right mr-2">
                <Link
                  className='text-light'
                  data-toggle="modal"
                  data-target="#apply_invoice"
                >Apply To Invoice</Link>
              </div> */}
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
            Payments()
        }

        {/* Delete Sales Order Modal */}
        <div
          className="modal custom-modal fade"
          id="delete_payment"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <div className="form-header">
                  <h3>Delete Payment Record</h3>
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

export default PaymentView;