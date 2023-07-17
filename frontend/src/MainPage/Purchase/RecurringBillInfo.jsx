import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useHistory, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import httpService from '../../lib/httpService';
import { Link } from 'react-router-dom';
import { Delete, Edit } from '@mui/icons-material';
import DeleteModel from './DeleteModel';

const RecurringBillInfo = () => {
  const { id } = useParams();

  const history = useHistory();

  const [ recurringBillData, setRecurringBillData ] = useState("");

  const fetchVendorRecurringBillInfo = () => {
    toast
      .promise(
        httpService.get(`/vendortrx/getrecurringbill?_id=${id}`),
        {
          error: 'Failed to fetch vendor recurring bills',
          success: 'recurring bills fetch successfully',
          pending: 'fetching vendor recurring bill...',
        }
      )
      .then((res) => setRecurringBillData(res.data[0]));
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

  const deleteVendorRecurringBill = () => {
    toast
      .promise(
        httpService.delete(`/vendortrx/removerecurringbill/${id}`),
        {
          error: 'Failed to delete vendor Recurring bills',
          success: 'Recurring bill deleted successfully',
          pending: 'deleting vendor Recurring bill...',
        }
      )
      .then((res) => { history.goBack();
        history.goBack();
      });
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

  const stopBillRecur = () => {
    toast
      .promise(
        httpService.put(`/vendortrx/updaterecurringbill/${recurringBillData?._id}`, { status: "INACTIVE"}),
        {
          error: 'Failed to update recurring Bill',
          success: 'recurring Bill updated successfully',
          pending: 'Updating vendor recurring Bill...',
        }
      )
    .then((res) => {
      recurringBillData(res?.data);
      history.goBack();
      history.goBack();
    });
  }


  useEffect(() => {
    fetchVendorRecurringBillInfo()
  }, []);


  const RecurringBillInfoView = () => {
    return(
      <div>

        <div className="d-flex">
          <div className="p-2 mr-2 flex-fill">
            {/* <p className="h2">Bill</p> */}
            {/* <p className="h3">{recurringBillData?.profileName}</p> */}
            <span className="badge bg-warning p-2 h5">{recurringBillData?.status}</span>
            <table className="table table-borderless"> 
              <tbody>
                <tr>
                  <td>Repeats</td>
                  <td>In {recurringBillData?.repeatEvery?.repeatNumber} {recurringBillData?.repeatEvery?.repeatUnit} intervals</td>
                </tr>
                <tr>
                  <td>Starts On </td>
                  <td>{recurringBillData?.billStartDate?.split("T")[0]}</td>
                </tr>
                <tr>
                  <td>Ends On</td>
                  <td>{recurringBillData?.neverExpire === true ? "Goes on forever" : recurringBillData?.billEndDate?.split("T")[0]}</td>
                </tr>
                <tr>
                  <td>PAYMENT TERMS</td>
                  <td>{recurringBillData?.paymentTerms}</td>
                </tr>
                <tr>
                  <td>Next Bill Date</td>
                  <td>{recurringBillData?.billNextDate?.split("T")[0]}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-2 ml-2 flex-fill">
            <p className="h5">Vendor</p> 
            <Link to={`/app/profile/vendor-profile/${recurringBillData?.vendorId?._id}`}>
              <p>{recurringBillData?.vendorId?.name}</p>
            </Link>
            <div>{recurringBillData?.vendorId?.billAddress?.attention}</div>
            <div>{recurringBillData?.vendorId?.billAddress?.address}</div>
            <div>{recurringBillData?.vendorId?.billAddress?.city} - {recurringBillData?.vendorId?.billAddress?.state}</div>
            <div>{recurringBillData?.vendorId?.billAddress?.country} - {recurringBillData?.vendorId?.billAddress?.pincode}</div>
            <div>{recurringBillData?.vendorId?.billAddress?.phone}</div>
          </div>
        </div>

        <div>
          <table className="table table-striped">
            <thead>
              <tr className='bg-primary'>
                <th>Item and Description</th>
                <th>Account</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              { recurringBillData?.transaction?.length > 0 && recurringBillData?.transaction.map((trx, index) => <tr  key={index}>
                <td>{trx?.itemDetails}</td>
                <td>{trx?.account}</td>
                <td>{trx?.quantity}</td>
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
              <p className="h4">₹ {recurringBillData?.subTotal}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p className="h4 text-muted">Discount</p>
              <p className="h4 text-muted">(-)₹{recurringBillData?.discountAmount}</p>
            </div>
            <div className="d-flex justify-content-between">
              <p className="h4 text-muted">TDS</p>
              <p className="h4 text-muted">₹{recurringBillData?.taxAmount}</p>
            </div>
            {
              recurringBillData?.adjustment?.adjustmentValue !== 0 &&
              <div className="d-flex justify-content-between">
                <p className="h4 text-muted">{recurringBillData?.adjustment?.adjustmentName}</p>
                <p className="h4 text-muted">₹{recurringBillData?.adjustment?.adjustmentValue}</p>
              </div>
            }
            <hr />
            <div className="d-flex justify-content-between">
              <p className="h4">₹ Total</p>
              <p className="h4">{recurringBillData?.total}</p>
            </div>
          </div>
        </div>

        <hr />
        { recurringBillData?.notes && 
          <div>
            <div className="h4">More Information</div>
            <p className="text-muted">Notes: {recurringBillData?.notes}</p>
          </div>
        }

        </div>
    )
  }

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Recurring Bill Info</title>
        <meta name="description" content="vendor Recurring Bill" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col">
              <h3 className="page-title">Recurring Bill :- {recurringBillData?.profileName}
              </h3>
            </div>
            <div className="col">
              <div className='rounded-circle bg-primary p-2 float-right mr-2'>
                <Link
                  to={{pathname : "/app/purchase/addrecurringbill", state: {recurringBillData, edit: true} }}
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
              { recurringBillData?.status == "ACTIVE"
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
                >Show Bill History</Link>
              </div> */}
              <div className="btn btn-primary float-right mr-2">
                <Link
                  className='text-light'
                  to={{ pathname:`/app/purchase/createbill`, state: { recurringBillData, convertRecurring: true } }}
                >Create Bill</Link>
              </div>
              <div className="btn btn-primary float-right mr-2">
                <Link
                  className='text-light'
                  to={`/app/purchase/bills?recurrBill=${recurringBillData?._id}`}
                >View Bills</Link>
              </div>
              {/* <div className="btn btn-primary float-right mr-2">
                <Link
                  className='text-light'
                  to="#"
                >Stop</Link>
              </div> */}
            </div>
          </div>
        </div>

        { RecurringBillInfoView() }
        
        <DeleteModel title="Recurring Bill" fn={deleteVendorRecurringBill} />

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
                        stopBillRecur();
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

export default RecurringBillInfo