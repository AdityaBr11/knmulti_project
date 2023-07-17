import { Email, Upload } from '@mui/icons-material'
import { Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useHistory, useParams } from 'react-router-dom'
import httpService from '../../../lib/httpService'
import FileUploadModel from '../../Purchase/FileUploadModel'
import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';

const LandSaleDetails = () => {
  const history = useHistory();

  const {id} = useParams();

  const [ landSale, setlandSale ] = useState({});

  const fetchLandSale = async () => {
    const res = await httpService.get(`/landsale?_id=${id}`);
    setlandSale(res.data[0]);
  }

  useEffect(() => {
    fetchLandSale();

  }, []);


  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Land Sale Details</title>
        <meta name="description" content="Land Sale Details" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col">
              <h3 className="page-title">Land Sale Details</h3>
              <p class="h3">Plot No# {landSale?.plotNo}</p>
            </div>

            <div className="col">
            <div className='rounded-circle bg-primary p-1 float-right mr-1'>
            
            <Stack
              
              onClick={() => {
                history.push({
                  pathname: '/app/purchase/landsaleEdit',
                  state: {...landSale, edit: true}                        
                })
              }}
            >
              <Button
                
              >
                <EditIcon />
              </Button>
            </Stack>
              </div>
              <div className='rounded-circle bg-primary p-2 float-right mr-2'>
                <Link
                  to={{pathname : "/app/apps/email", state: {
                    id: landSale?._id,
                    subject: `Details for Land Sale of Plot No  ${landSale?.plotNo}`,
                    pdf: "",
                    index: "",
                    type: 'land-sale-email'
                  } }}
                  className="text-light"
                >
                  <Email />
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

            </div>

          </div>
        </div>

        <div className="d-flex">
          <div class="p-2 mr-2 flex-fill">
            
            {/* <span class="badge bg-warning p-2 h5">{landSale?.modeOfPay}</span> */}
            <table class="table"> 
              <tbody>
                <tr>
                  <td>Mouza</td>
                  <td>{landSale?.mouza}</td>
                </tr>
                <tr>
                  <td>Chaka No</td>
                  <td>{landSale?.chakaNo}</td>
                </tr>
                <tr>
                  <td>Khata No</td>
                  <td>{landSale?.khataNo}</td>
                </tr>
                <tr>
                  <td>Type Of Land</td>
                  <td>{landSale?.typeOfLand}</td>
                </tr>
                <tr>
                  <td>Type Of Kisam</td>
                  <td>{landSale?.typesofkisam}</td>
                </tr>
                <tr>
                  <td>Type Of Document</td>
                  <td>{landSale?.typeOfDoc}</td>
                </tr>
                <tr>
                  <td>Document No.</td>
                  <td>{landSale?.documentNo}</td>
                </tr>
                <tr>
                  <td>Mode Of Payment</td>
                  <td>{landSale?.modeOfPay}</td>
                </tr>
                
              </tbody>
            </table>
          </div>
          <div class="p-2 ml-2 flex-fill">
            <table class="table"> 
              <tbody>
                <tr>
                  <td>Area</td>
                  <td>{landSale?.area} Sq.Ft</td>
                </tr>
                <tr>
                  <td>Total Amount</td>
                  <td>{landSale?.totalAmount}</td>
                </tr>
                <tr>
                  <td>Advance Amount</td>
                  <td>{landSale?.advanceAmount}</td>
                </tr>
                <tr>
                  <td>Balance Amount</td>
                  <td>{landSale?.balanceAmount}</td>
                </tr>
                <tr>
                  <td>Date Of Payment</td>
                  <td>{landSale?.payDate?.split("T")[0]}</td>
                </tr>
                <tr>
                  <td>Date Of Conversion</td>
                  <td>{landSale?.dateOfConversion?.split("T")[0]}</td>
                </tr>
                <tr>
                  <td>Date Of Mutation</td>
                  <td>{landSale?.dateOfMutation?.split("T")[0]}</td>
                </tr>
                <tr>
                  <td>Registration Date</td>
                  <td>{landSale?.registrationDate?.split("T")[0]}</td>
                </tr>
                
              </tbody>
            </table>
          </div>
        </div>

        <hr />

        <div className="d-flex">
          <div class="p-2 mr-2 flex-fill">
            
            {/* <span class="badge bg-warning p-2 h5">{landSale?.modeOfPay}</span> */}
            <table class="table"> 
              <tbody>
                <tr>
                  <td>Land Owner Name</td>
                  <td>{landSale?.landOwnerName}</td>
                </tr>
                <tr>
                  <td>Purchaser Name</td>
                  <td>{landSale?.purchaserName}</td>
                </tr>
                <tr>
                  <td>patta Owner Name</td>
                  <td>{landSale?.landpataOwnerName}</td>
                </tr>

                <tr>
                  <td>Received By</td>
                  <td>{landSale?.receivedBy}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="p-2 ml-2 flex-fill">
            <table class="table"> 
              <tbody>
                <tr>
                  <td>Project</td>
                  <td>
                    <Link to={`/app/projects/projects-view/${landSale?.projectId?._id}`}>{landSale?.projectId?.name}</Link>
                    </td>
                </tr>
                <tr>
                  <td>Vendor</td>
                  <td>
                  <Link to={`/app/profile/vendor-profile/${landSale?.vendorId?._id}`}>{landSale?.vendorId?.name}</Link>
                  </td>
                </tr>
                <tr>
                  <td>patta Owner Mobile</td>
                  <td>{landSale?.landpataOwnerMobile}</td>
                </tr>
                
              </tbody>
            </table>
          </div>
        </div>

      </div>

      { landSale && 
        <FileUploadModel modLink={`landsale/${id}`} filesInfo={landSale?.fileInfos} />
      }
    </div>
  )
}

export default LandSaleDetails