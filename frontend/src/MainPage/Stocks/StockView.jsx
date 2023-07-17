import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useParams, useHistory } from 'react-router-dom'
import httpService from '../../lib/httpService';

const StockView = () => {
  const { id } = useParams();
  const history = useHistory();

  const [ stock, setStock ] = useState("");

  const fetchStock = async () => {
    const res = await httpService.get(`/stock?_id=${id}`);
    console.log(res.data[0]);
    setStock(res.data[0]);
  }

  useEffect(() => {
    fetchStock();
  }, []);

  return (
    <div className="page-wrapper"> 
      <Helmet>
        <title>Stock Info</title>
        <meta name="description" content="Stock Info" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col">
              <h3 className="page-title"><div className="btn btn-outline-secondary" onClick={() => history.goBack()}>
                  Go Back
                </div>
              </h3>
            </div>
          </div>
        </div>
        <div className="row">
            <div className="p-2 mr-2 flex-fill">
              <p className="h3">
                Stock No # {stock?.stockNo}
              </p>
              <span className="badge bg-warning p-2 h5">{stock?.billStatus}</span>
              <table className="table"> 
              <tbody>
                <tr>
                  <td>Item Details</td>
                  <td>{stock?.itemDetails}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>DATE</td>
                  <td>{stock?.date?.split("T")[0]}</td>
                </tr>
                <tr>
                  <td>Total Quantity</td>
                  <td>{stock?.quantity}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>Left Quantity</td>
                  <td>{stock?.leftQuantity}</td>
                </tr>
                <tr>
                  <td>Vendor</td>
                  <td><Link to={`/app/profile/vendor-profile/${stock?.vendorId?._id}`}>{stock?.vendorId?.name}</Link></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>

        <div className="row">
            <table className="table table-striped">
              <thead>
                <tr className='bg-primary'>

                  <th>Sr No.</th>
                  <th>Split No</th>
                  <th>Date</th>
                  <th>Project</th>
                  <th>Purpose</th>
                  <th>Used Quantity</th>
                </tr>
              </thead>
              <tbody>
                { stock?.splitStocks?.length > 0 && stock?.splitStocks.reverse().map((ss, index) => <tr key={index}>
                  <td>{index+1}</td>
                  <td>{ss?.splitStockNo}</td>
                  <td>{ss?.splitStockdate?.split("T")[0]}</td>
                  <td><Link to={`/app/projects/projects-view/${ss?.projectId?._id}`}>{ss?.projectId?.name}</Link></td>
                  <td>{ss?.purpose}</td>
                  <td>{ss?.usedQuantity}</td>
                </tr>) }
                
              </tbody>
            </table>
        </div>
      </div>
    </div>
  )
}

export default StockView