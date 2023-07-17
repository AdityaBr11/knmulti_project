import { Delete, Edit } from '@material-ui/icons';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet'
import { Link, useHistory, useParams } from 'react-router-dom'
import httpService from '../../lib/httpService';

const LedgerInfo = () => {

  const history = useHistory();
  const { ledgerId } = useParams();

  const [ ledgerData, setLedgerData ] = useState();

  const fetchLedger = async() => {
    const res = await httpService.get(`/generalledger?_id=${ledgerId}`);
    setLedgerData(res.data[0]);
  }

  useEffect(() => {
    fetchLedger();
  }, []);

  const deleteLedger = async () => {
    await httpService.delete(`/generalledger/${ledgerId}`);
    history.goBack();
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Payments </title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
      {/* Page Header */}
        <div className="page-header">
            <div className="row">
              <div className="col">
                <h3 className="page-title">Ledger Info: {ledgerData?.journalId}</h3>
              </div>
              <div className="col">
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
                    to={{pathname : "/app/accounts/add-general-ledger", state: {ledgerId: ledgerData?._id, ledgerData, edit: true} }}
                    className="text-light"
                  >
                    <Edit />
                  </Link>
                </div>
              </div>
            </div>
        </div>
        <div className="d-flex">
          <div className="p-2 mr-2 flex-fill">
            <span className="badge bg-warning p-2 h5">{ledgerData?.journalType}</span>
            <table className="table table-borderless"> 
              <tbody>
                <tr>
                  <td>DATE</td>
                  <td>{ledgerData?.date?.split("T")[0]}</td>
                </tr>
                <tr>
                  <td>REFERENCE#</td>
                  <td>{ledgerData?.referenceId}</td>
                </tr>
                <tr>
                  <td>Notes</td>
                  <td>{ledgerData?.notes}</td>
                </tr>
                <tr>
                  <td>Currency</td>
                  <td>{ledgerData?.currency}</td>
                </tr>
                <tr>
                  <td>Net Balance</td>
                  <td>₹ {ledgerData?.total}</td>
                </tr>
                
              </tbody>
            </table>
          </div>
          <div className="p-2 ml-2 flex-fill">
            <div>
              <p className="h5">{ledgerData?.category?.toUpperCase()}</p> 
              <div className='ml-3'>
                { ledgerData?.category == "vendor" && 
                  <Link to={`/app/profile/vendor-profile/${ledgerData?.vendor?._id}`}>
                    <div>{ledgerData?.vendor?.name}</div>
                  </Link>
                }
                { ledgerData?.category == "customer" && 
                  <Link to={`/app/profile/customer-profile/${ledgerData?.customer?._id}`}>
                    <div>{ledgerData?.customer?.displayName}</div>
                  </Link>
                }
                { ledgerData?.category == "employee" && 
                  <Link to={`/app/profile/employee-profile/${ledgerData?.employee?._id}`}>
                    <div>{ledgerData?.employee?.name}</div>
                  </Link>
                }
                
              </div>
            </div>
            <hr />
          </div>
        </div>
        <div>
          <table className="table table-striped">
            <thead>
              <tr className='bg-primary'>
                <th>Sr No.</th>
                <th>Date</th>
                <th>Patricular</th>
                <th>Debits</th>
                <th>Credits</th>
              </tr>
            </thead>
            <tbody>
              { ledgerData?.transaction?.length > 0 && ledgerData?.transaction.map((trx, i) => <tr>
                <td>{i+1}</td>
                <td>{trx?.date?.split("T")[0]}</td>
                <td>{trx?.description}</td>
                <td>₹ {trx?.debits}</td>
                <td>₹ {trx?.credits}</td>
              </tr>) }
              
            </tbody>
          </table>
          <hr />
        </div>
        <>
        <div className="modal custom-modal fade close" id="delete_client" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <div className="form-header">
                  <h3>Delete Ledger</h3>
                  <p>Are you sure want to delete?</p>
                </div>
                <div className="modal-btn delete-action">
                  <div className="row">
                    <div className="col-6">
                      <a
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          deleteLedger();
                          history.goBack();
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

export default LedgerInfo