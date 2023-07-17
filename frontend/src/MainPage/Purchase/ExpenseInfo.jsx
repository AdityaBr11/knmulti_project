import { Delete, Edit } from '@material-ui/icons';
import { Download } from '@mui/icons-material';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import httpService from '../../lib/httpService';
import DeleteModel from './DeleteModel';
import UploadFileComponent from './UploadFileComponent';

const ExpenseInfo = () => {

  const { id } = useParams();

  const history = useHistory();

  const [ expenseData, setExpenseData ] = useState("");

  const fetchExpenseInfo = () => {
    toast
      .promise(
        httpService.get(`/vendortrx/getvendorexpense?_id=${id}`),
        {
          error: 'Failed to fetch vendor expense',
          success: 'expenses fetch successfully',
          pending: 'fetching vendor expense...',
        }
      )
      .then((res) => setExpenseData(res.data[0]));
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

  const deleteVendorExpense = () => {
    toast
      .promise(
        httpService.delete(`/vendortrx/removevendorexpense/${id}`),
        {
          error: 'Failed to delete vendor expense',
          success: 'expense deleted successfully',
          pending: 'deleting vendor expense...',
        }
      )
      .then((res) => { history.goBack();
        history.goBack();
      });
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

  // console.log({ expenseData });

  useEffect(() => {
    fetchExpenseInfo();
  }, []);

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Expense Info</title>
        <meta name="description" content="Expense Info" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col d-flex">
              <h3 className="page-title mr-2">Expense Details</h3>
              <div>
                <span 
                  className={ expenseData?.status === 'INVOICED' ? 'badge bg-success p-2 h5 ml-2' : expenseData?.status == 'UNBILLED' ? 'badge bg-danger p-2 h5 ml-2' : 'badge bg-warning p-2 h5 ml-2' } >
                  {expenseData?.status}
                </span>
              </div>
            </div>
            <div className="col">
              {/* <div className='rounded-circle bg-primary p-2 float-right'>
                <Link to={expenseData?.pdf_url} target="_blank" className="text-light" download>
                  <Download />
                </Link>
              </div> */}
              { expenseData?.status != "INVOICED" && 
              <div className='rounded-circle bg-primary p-2 float-right mr-2'>
                <Link
                  to={{pathname : expenseData?.expenseAccount == "Fuel/Mileage Expenses" ? "/app/purchase/addmileageexpense" : "/app/purchase/addexpense" , state: {expenseData, edit: true} }}
                  className="text-light"
                >
                  <Edit />
                </Link>
              </div> }
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
              { expenseData?.isBillable && ( expenseData?.status != "INVOICED" ?
              
                <div className="btn btn-primary float-right mr-2">
                  <Link
                    className='text-light'
                    to={{ pathname:`/app/sales/createinvoice`, state: {expenseData} }}
                  >Convert to Invoice</Link>
                </div>
                : 
                
                <div className="btn btn-primary float-right mr-2">
                  <Link
                    className='text-light'
                    to={{ pathname:`/app/sales/invoice-view/${expenseData?.invoiceRef}`}}
                  >View Invoice</Link>
                </div>
                )
              }
              { expenseData?.isBillable && expenseData?.expenseAccount != "Fuel/Mileage Expenses" && 
              
                <div className="btn btn-primary float-right mr-2">
                  <Link
                    className='text-light'
                    to={{ pathname:`/app/purchase/addrecurringexpense`, state: {expenseData, convertExpense : true} }}
                  >Make a Recurring</Link>
                </div>
              }
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6 col-md-6">
            <div>
              <p className="h4 text-muted">Expense Amount</p>
              <p>
                <span className="h3 text-primary">₹ {expenseData?.expenseAmount}</span>
                <span className="h5 text-muted"> on {expenseData?.expenseDate?.split("T")[0]}</span>
              </p>
              <p className="h4 text-muted">{expenseData?.status}</p>
              <div class="badge bg-primary p-2 h5">{expenseData?.expenseAccount}</div>
            </div>
            <div className='my-5'>
              { expenseData?.distance && 
                <div className='my-3'>
                  <p className="h5 text-muted">Distance</p>
                  <span className="h4">{expenseData?.distance} Kilometer(s)</span>
                  <span className="h5 text-muted"> Rate per km = ₹ {expenseData?.ratePerKM}</span>
                </div>
              }
              <div className='my-3'>
                <p className="h5 text-muted">Paid Through</p>
                <p className="h4">{expenseData?.paymentThrough}</p>
              </div>
              <div className='my-3'>
                <p className="h5 text-muted">Ref #</p>
                <p className="h4">{expenseData?.invoiceId}</p>
              </div>
              <div className='my-3'>
                <p className="h5 text-muted">Customer</p>
                <Link to={`/app/profile/customer-profile/${expenseData?.customerId?._id}`}>
                  <p className="h4">{expenseData?.customerId?.displayName}</p>
                </Link>
                
              </div>
              <div className='my-3'>
                <p className="h5 text-muted">Paid To</p>
                <Link to={`/app/profile/vendor-profile/${expenseData?.vendorId?._id}`}>
                  <p className="h4">{expenseData?.vendorId?.name}</p>
                </Link>
              </div>
              <div className='my-3'>
                <p className="h4 mt-3 text-muted">Note : {expenseData?.notes}</p>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-md-6">
            <UploadFileComponent modLink={`/vendortrx/updatevendorexpense/${expenseData?._id}`} filesInfo={expenseData?.fileInfos} />
          </div>
        </div>
        
        <DeleteModel title="Vendor Expense" fn={deleteVendorExpense} />
      </div>
    </div>
  )
}

export default ExpenseInfo