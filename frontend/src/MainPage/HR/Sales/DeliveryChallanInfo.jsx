import { Delete, Download, Edit, Email, Upload } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import httpService from '../../../lib/httpService';

const DeliveryChallanInfo = () => {

  const [challanData, setChallanData] = useState();
  const history  = useHistory();
  
  const fetchDeliveryChallan = async (id) => {
    toast
      .promise(
        httpService.get(`/deliverychallan/${id}`),
        {
          error: 'Failed to fetch Delivery Challan',
          success: 'Delivery Challan Fetched Successfully',
          pending: 'fetching Delivery Challan...'
        }
      ).then((res) => {
        console.log(res.data);
        setChallanData(res.data)
      });
    
  }
    
  const { id } = useParams();
  useEffect(async () => {
    await fetchDeliveryChallan(id);
  }, [])

  const pdfView = () => {
    return(
      <>
        <div style={{ height: "100vh" }} className="d-flex justify-content-center">
        <object data={challanData?.pdf_url} type="application/pdf" width={"80%"} height="100%">
          <p>PDF Not Available</p>
        </object> 
      </div>
      </>
    )
  }

  const handleDelete = () => {
    toast
      .promise(
        httpService.delete(`/deliverychallan/${id}`),
        {
          error: 'Failed to delete Delivery Challan',
          success: 'Delivery Challan Deleted Successfully',
          pending: 'deleting Delivery Challan...'
        }
      ).then((res) => {
        document.querySelectorAll('.cancel-btn')?.forEach((e) => e.click());
        history.push("/app/sales/deliverychallan");
      });
  }

  const handleOpen = () => {
    toast
      .promise(
        httpService.put(`/deliverychallan/${id}`, { status: 'OPEN' }),
        {
          error: 'Failed to Open Delivery Challan',
          success: 'Delivery Challan is marked Open Successfully',
          pending: 'Marking as Open...'
        }
      ).then((res) => {
        document.querySelectorAll('.cancel-btn')?.forEach((e) => e.click());
        fetchDeliveryChallan()
      });
  }

  const handleDeliver = () => {
    toast
      .promise(
        httpService.put(`/deliverychallan/${id}`, { status: 'DELIVERED' }),
        {
          error: 'Failed to mark Delivered',
          success: 'Delivery Challan is marked as Delivered Successfully',
          pending: 'Marking as Delivered...'
        }
      ).then((res) => {
        document.querySelectorAll('.cancel-btn')?.forEach((e) => e.click());
        fetchDeliveryChallan()
      });
  }

  const handleReturn = () => {
    toast
      .promise(
        httpService.put(`/deliverychallan/${id}`, { status: 'RETURNED' }),
        {
          error: 'Failed to mark Returned',
          success: 'Delivery Challan is marked Returned Successfully',
          pending: 'Marking as Returned...'
        }
      ).then((res) => {
        document.querySelectorAll('.cancel-btn')?.forEach((e) => e.click());
        fetchDeliveryChallan()
      });
  }

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DELIVERY CHALLAN</title>
        <meta name="description" content="vendor bill" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col">
              <h3 className="page-title">{challanData?.deliveryChallan}</h3>
            </div>
            <div className="col-md-8">
              <div className='rounded-circle bg-primary p-2 float-right'>
                <a href={challanData?.pdf_url} target="_blank" className="text-light" download>
                  <Download />
                </a>
              </div>
              <div className='rounded-circle bg-primary p-2 float-right mr-2'>
                <Link
                  to={"#"}
                  className="text-light"
                  data-toggle="modal"
                  data-target="#delete_challan"
                >
                  <Delete />
                </Link>
              </div>
                <>
                  <div className='rounded-circle bg-primary p-2 float-right mr-2'>
                    <Link
                      to={{pathname : "/app/apps/email", state: {
                        id: challanData?._id,
                        subject: `Details of Delivery Challan ${challanData?.deliveryChallan}`,
                        pdf: challanData?.pdf_url,
                        index: challanData?.deliveryChallan,
                        type: 'delivery-challan'
                      }}}
                      className="text-light"
                    >
                      <Email />
                    </Link>
                  </div>
                  <div className='rounded-circle bg-primary p-2 float-right mr-2'>
                    <Link
                      to={{pathname : "/app/sales/createdeliverychallan", state: { ...challanData, edit: true }}}
                      className="text-light"
                    >
                      <Edit />
                    </Link>
                  </div>
                  {
                    challanData?.status !== 'RETURNED' && (
                    <div className="btn btn-primary float-right mr-2">
                      <Link
                        className='text-light'
                        to={{ pathname:`/app/sales/createInvoice`, state: { ...challanData, dcConvert: true } }}
                      >Convert to Invoice</Link>
                    </div>
                    )
                  }
                  {
                    challanData?.status === 'DRAFT' && (
                      <div className="btn btn-primary float-right mr-2">
                        <Link
                          className='text-light'
                          to={'#'}
                          onClick={(e) => {
                            e.preventDefault();
                            handleOpen();
                          }}
                        >Mark As Open</Link>
                      </div>
                    )
                  }
                  {
                    challanData?.status === 'OPEN' && (
                      <div className="btn btn-primary float-right mr-2">
                        <Link
                          className='text-light'
                          to={'#'}
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeliver();
                          }}
                        >Mark As Delivered</Link>
                      </div>
                    )
                  }
                  {
                    challanData?.status === 'OPEN' && (
                      <div className="btn btn-primary float-right mr-2">
                        <Link
                          className='text-light'
                          to={'#'}
                          onClick={(e) => {
                            e.preventDefault();
                            handleReturn();
                          }}
                        >Mark As Returned</Link>
                      </div>
                    )
                  }
                  {
                    challanData?.status === 'DELIVERED' && (
                      <div className="btn btn-primary float-right mr-2">
                        <Link
                          className='text-light'
                          to={'#'}
                          onClick={(e) => {
                            e.preventDefault();
                            handleOpen();
                          }}
                        >Revert to Open</Link>
                      </div>
                    )
                  }                  
                </>
              </div>
            </div>
          </div>
        
        {pdfView()}

        {/* Delete Estimate Modal */}
        <div
          className="modal custom-modal fade"
          id="delete_challan"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <div className="form-header">
                  <h3>Delete Delivery Challan</h3>
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
  );
};

export default DeliveryChallanInfo;
