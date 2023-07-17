import React, { useEffect, useState } from 'react';
import { Delete, Edit } from '@material-ui/icons';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import httpService from '../../lib/httpService';
import DeleteModel from './DeleteModel';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LoopIcon from '@mui/icons-material/Loop';
import { CalendarToday } from '@mui/icons-material';

const RecurringExpenseInfo = () => {

  const { id } = useParams();

  const history = useHistory();

  const [ recurringExpenseData, setRecurringExpenseData ] = useState("");

  const fetchRecurringExpenseInfo = () => {
    toast
      .promise(
        httpService.get(`/vendortrx/getrecurringexpense?_id=${id}`),
        {
          error: 'Failed to fetch vendor recurring expense',
          success: 'recurring expenses fetch successfully',
          pending: 'fetching vendor recurring expense...',
        }
      )
      .then((res) => setRecurringExpenseData(res.data[0]));
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

  const deleteRecurringExpense = () => {
    toast
      .promise(
        httpService.delete(`/vendortrx/removerecurringexpense/${id}`),
        {
          error: 'Failed to delete vendor recurring expense',
          success: 'recurring expense deleted successfully',
          pending: 'deleting vendor recurring expense...',
        }
      )
      .then((res) => { history.goBack();
        history.goBack();
      }
      );
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

  const stopExpenseRecur = () => {
    toast
      .promise(
        httpService.put(`/vendortrx/updaterecurringexpense/${recurringExpenseData?._id}`, { status: "INACTIVE" }),
        {
          error: 'Failed to update vendor recurring expenses',
          success: 'recurring expenses update successfully',
          pending: 'updating vendor recurring expense...',
        }
      )
      .then((res) => {setRecurringExpenseData(res?.data);
        history.goBack();
      });
  }

  useEffect(() => {
    fetchRecurringExpenseInfo();
  }, []);

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Recurring Expense Info</title>
        <meta name="description" content="Expense Info" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col">
              <h3 className="page-title">{recurringExpenseData?.profileName} <span className="badge bg-warning p-2 h5">{recurringExpenseData?.status}</span></h3>
            </div>
            <div className="col">
            { recurringExpenseData?.status == "ACTIVE"
                &&
              <div className='rounded-circle bg-primary p-2 float-right mr-2'>
                <Link
                  to={{pathname : "/app/purchase/addrecurringexpense" , state: {recurringExpenseData, edit: true} }}
                  className="text-light"
                >
                  <Edit />
                </Link>
              </div>
            }
            { recurringExpenseData?.status == "INACTIVE"
                &&
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
              { recurringExpenseData?.status == "ACTIVE"
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

                <div className="btn btn-primary float-right mr-2">
                  <Link
                    className='text-light'
                    to={{ pathname:`/app/purchase/addexpense`, state: {recurringExpenseData, convertRecurring: true} }}
                  >Create Expense</Link>
                </div>
                <div className="btn btn-primary float-right mr-2">
                <Link
                  className='text-light'
                  to={`/app/purchase/expenses?recurrExp=${recurringExpenseData?._id}`}
                >View Expenses</Link>
              </div>
                
            </div>
          </div>
        </div>
        <div className="row d-flex justify-content-evenly">
            <div className='d-flex align-items-center'>
              <AccountBalanceWalletIcon fontSize='large' />
              <div className='mx-3'>
                <span className="h3 text-primary">₹ {recurringExpenseData?.expenseAmount}</span>
                <p className="h5 text-muted">Expense Amount</p>
              </div>
            </div>
            <div className='ml-5 d-flex align-items-center'>
              <LoopIcon fontSize='large' />
              <div className='mx-3'>
                <span className="h3 text-primary">In {recurringExpenseData?.repeatEvery?.repeatNumber} {recurringExpenseData?.repeatEvery?.repeatUnit} Intervals</span>
                <p className="h5 text-muted">Repeats</p>
              </div>
            </div>
            <div className='ml-5 d-flex align-items-center'>
              <CalendarToday fontSize='large' />
              <div className='mx-3'>
                <span className="h3 text-primary">{recurringExpenseData?.expenseNextDate?.split("T")[0]}</span>
                <p className="h5 text-muted">Next Expense Date</p>
              </div>
            </div>
        </div>
        <br />
        <div className="row d-flex my-3">
            <div className='mr-5'>
                <p className="h5 text-muted">Expense Account</p>
                <p className="h4">{recurringExpenseData?.expenseAccount}</p>
            </div>
            <div className='mr-5'>
                <p className="h5 text-muted">Paid Through</p>
                <p className="h4">{recurringExpenseData?.paymentThrough}</p>
            </div>

            <div className='bg-primary mr-2'>{". "}</div>
            <div>
                <p className="h5 text-muted mt-1">Starts On <span className="h5 text-dark">{recurringExpenseData?.expenseStartDate?.split("T")[0]}</span></p>
                <p className="h5 text-muted">Ends On { recurringExpenseData?.expenseEndDate ?
                  <span className="h5 text-dark">{recurringExpenseData?.expenseEndDate?.split("T")[0]}</span>
                  :
                  <span className="h5 text-dark">Goes Forever</span>
                }</p>
                
            </div>
            
        </div>
        <div className="row">
            <div className='my-3'>
              <h3>Other Details</h3>
              <div className='my-3'>
                <p className="h5 text-muted">Customer</p>
                <Link to={`/app/profile/customer-profile/${recurringExpenseData?.customerId?._id}`}>
                  <p className="h4">{recurringExpenseData?.customerId?.displayName}</p>
                </Link>
                
              </div>
              <div className='my-3'>
                <p className="h5 text-muted">Payable To</p>
                <Link to={`/app/profile/vendor-profile/${recurringExpenseData?.vendorId?._id}`}>
                  <p className="h4">{recurringExpenseData?.vendorId?.name}</p>
                </Link>
              </div>
              <div className='my-3'>
                <p className="h4 mt-3 text-muted">Note : {recurringExpenseData?.notes}</p>
              </div>
            </div>
        </div>
        <DeleteModel title="Recurring Expense" fn={deleteRecurringExpense} />

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
                        stopExpenseRecur();
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

export default RecurringExpenseInfo