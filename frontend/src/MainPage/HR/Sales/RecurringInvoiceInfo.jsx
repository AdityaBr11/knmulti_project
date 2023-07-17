import { Delete, Edit } from '@mui/icons-material';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import httpService from '../../../lib/httpService';
import DeleteModel from '../../Purchase/DeleteModel';

const RecurringInvoiceInfo = () => {

  const { id } = useParams();

  const history = useHistory();

  const [ recurringinvoiceData, setRecurringinvoiceData ] = useState("");

  const fetchRecurringInvInfo = () => {
    toast
      .promise(
        httpService.get(`/recurring-invoice/${id}`),
        {
          error: 'Failed to fetch vendor recurring Invoice',
          success: 'recurring Invoice fetch successfully',
          pending: 'fetching vendor recurring Invoice...',
        }
      )
      .then((res) => setRecurringinvoiceData(res.data));

    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

  const deleteRecurringInvoice = () => {
    toast
      .promise(
        httpService.delete(`/recurring-invoice/${id}`),
        {
          error: 'Failed to delete Recurring invoice',
          success: 'Recurring invoice deleted successfully',
          pending: 'deleting Recurring invoice...',
        }
      )
      .then((res) => { history.goBack();
        history.goBack();
      });
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

  const stopInvoiceRecur = () => {
    toast
      .promise(
        httpService.put(`/recurring-invoice/${id}`, { status: "INACTIVE"}),
        {
          error: 'Failed to update recurring Invoice',
          success: 'recurring Invoice updated successfully',
          pending: 'Updating vendor recurring Invoice...',
        }
      )
    .then((res) => {
      setRecurringinvoiceData(res?.data);
      // history.goBack();
      // history.goBack();
      document.querySelectorAll('.close')?.forEach((e) => e.click());
    });
  }

  useEffect(() => {
    fetchRecurringInvInfo()
  }, []);

  console.log({ recurringinvoiceData });

  const RecurringInvInfoView = () => {
    return(
      <div>
        <div className="d-flex">
          <div className="p-2 mr-2 flex-fill">
            <span className="badge bg-warning p-2 h5">{recurringinvoiceData?.status}</span>
            <table className="table table-borderless"> 
              <tbody>
                <tr>
                  <td>Repeats</td>
                  <td>{recurringinvoiceData?.frequency} times a {recurringinvoiceData?.frequencyUnit}</td>
                </tr>
                <tr>
                  <td>Starts On </td>
                  <td>{recurringinvoiceData?.startDate?.split("T")[0]}</td>
                </tr>
                <tr>
                  <td>Ends On</td>
                  <td>{recurringinvoiceData?.neverExpires === true ? "Goes on forever" : recurringinvoiceData?.endDate?.split("T")[0]}</td>
                </tr>
                <tr>
                  <td>PAYMENT TERMS</td>
                  <td>{recurringinvoiceData?.terms}</td>
                </tr>
                <tr>
                  <td>Next Invoice Date</td>
                  <td>{recurringinvoiceData?.nextDate?.split("T")[0]}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-2 ml-2 flex-fill">
            <p className="h5">Customer Address</p> 
            <Link to={`/app/profile/customer-profile/${recurringinvoiceData?.customer?._id}`}>
              <p>{recurringinvoiceData?.customer?.displayName}</p>
            </Link>
            <div>{recurringinvoiceData?.customer?.billingAddress?.attention}</div>
            <div>{recurringinvoiceData?.customer?.billingAddress?.addressLine1}</div>
            <div>{recurringinvoiceData?.customer?.billingAddress?.addressLine2}</div>
            <div>{recurringinvoiceData?.customer?.billingAddress?.city} - {recurringinvoiceData?.customer?.billingAddress?.state} - {recurringinvoiceData?.customer?.billingAddress?.zipcode}</div>
            <div>{recurringinvoiceData?.customer?.billingAddress?.phone}</div>
            <div>{recurringinvoiceData?.customer?.billingAddress?.fax}</div>
          </div>
        </div>

        <div>
          <table className="table table-striped">
            <thead>
              <tr className='bg-primary'>
                <th>Item and Description</th>
                {/* <th>Account</th> */}
                <th>Qty</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              { recurringinvoiceData?.items?.length > 0 && recurringinvoiceData?.items.map((trx, index) => <tr key={index}>
                <td>{trx?.item} - {trx?.description}</td>
                {/* <td>{trx?.account}</td> */}
                <td>{trx?.quantity}</td>
                <td>{trx?.unitCost}</td>
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
              <p className="h4">₹ {recurringinvoiceData?.amount}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p className="h4 text-muted">Discount</p>
              <p className="h4 text-muted">(-)₹{recurringinvoiceData?.discount}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p className="h4 text-muted">Tax</p>
              <p className="h4 text-muted">₹{recurringinvoiceData?.withholdingTax}</p>
            </div>
            {
              recurringinvoiceData?.adjustment?.adjustmentValue !== 0 &&
              <div className="d-flex justify-content-between">
                <p className="h4 text-muted">Adjustment</p>
                <p className="h4 text-muted">₹{recurringinvoiceData?.adjustments}</p>
              </div>
            }
            <hr />
            <div className="d-flex justify-content-between">
              <p className="h4">₹ Total</p>
              <p className="h4">{recurringinvoiceData?.grandTotal}</p>
            </div>
          </div>
        </div>

        <hr />
        {/* { recurringinvoiceData?.termsAndConditions &&  */}
          <div>
            <div className="h4">More Information</div>
            <p className="text-muted">Customer Notes: {recurringinvoiceData?.customerNotes}</p>
            <p className="text-muted">Terms And Conditions: {recurringinvoiceData?.termsAndConditions}</p>
          </div>
        {/* } */}

      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Recurring Invoice Info</title>
        <meta name="description" content="vendor Recurring Invoice" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col">
              <h3 className="page-title">Recurring Invoice :- {recurringinvoiceData?.profileName}
              </h3>
            </div>
            <div className="col">
              <div className='rounded-circle bg-primary p-2 float-right mr-2'>
                <Link
                  to={{pathname : "/app/sales/recurring-invoices-create", state: {recurringinvoiceData, edit: true} }}
                  className="text-light"
                >
                  <Edit />
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
              { recurringinvoiceData?.status == "ACTIVE"
                &&

                <div className='rounded-circle bg-primary p-2 float-right mr-2'>
                  <Link
                    to={"#"}
                    className="text-light"
                    data-toggle="modal"
                    data-target="#stop"
                  >
                    Stop
                  </Link>
                </div>
              }
              {/* <div className="btn btn-primary float-right mr-2">
                <Link
                  className='text-light'
                  to="#"
                >Show invoice History</Link>
              </div> */}
              <div className="btn btn-primary float-right mr-2">
                <Link
                  className='text-light'
                  to={{ pathname:`/app/sales/createinvoice`, state: { recurringinvoiceData, convertRecurring: true } }}
                >Create invoice</Link>
              </div>
              {/* <div className="btn btn-primary float-right mr-2">
                <Link
                  className='text-light'
                  to={`/app/purchase/invoices?recurrinvoice=${recurringinvoiceData?._id}`}
                >View invoices</Link>
              </div> */}
              {/* <div className="btn btn-primary float-right mr-2">
                <Link
                  className='text-light'
                  to="#"
                >Stop</Link>
              </div> */}
            </div>
          </div>
        </div>

        { RecurringInvInfoView() }

        <DeleteModel title="Recurring Invoive" fn={deleteRecurringInvoice} />

        <div className="modal custom-modal fade close" id="stop" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Stop</h3>
                <p>Are you sure want to Stop?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <a
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        stopInvoiceRecur();
                      }}
                      className="btn btn-primary continue-btn"
                      
                    >
                      Stop
                    </a>
                  </div>
                  <div className="col-6">
                    <a
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

      </div>
    </div>
  )
}

export default RecurringInvoiceInfo