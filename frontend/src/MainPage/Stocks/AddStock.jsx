import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useHistory } from 'react-router-dom'
import httpService from '../../lib/httpService';

const AddStock = () => {

  const history = useHistory();

  const [ itemDetails, setitemDetails ] = useState("");
  const [ stockNo, setstockNo ] = useState("");
  const [ quantity, setquantity ] = useState("");
  const [ billStatus, setbillStatus ] = useState("UNPAID");
  const [ date, setdate ] = useState("");

  const [ vendors, setVendors ] = useState([]);
  const [ vendor, setVendor ] = useState(undefined);


  const fetchVendors = async () => {
    const res = await httpService.get('/vendor');
    setVendors(res.data);
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const stockData = {
      itemDetails,
      stockNo,
      quantity,
      billStatus,
      vendorId : vendor,
      date
    }
    console.log({ ...stockData, leftQuantity : quantity });

    const res = await httpService.post('/stock', { ...stockData, leftQuantity : quantity });
    console.log(res.data);
    history.push(`/app/stock/stocklist`);
  }

  return (
    <div className="page-wrapper"> 
      <Helmet>
        <title>Add Stock</title>
        <meta name="description" content="Add Stock" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col">
              <h3 className="page-title">Add Stock</h3>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <form onSubmit={handleSubmit}> 
              <div className="row">
                <div className="col-sm-6 col-md-6">
                    <div className="form-group">
                      <label>
                        Item Details <span className="text-danger">*</span>
                      </label>
                      <input type="text" 
                      name="itemDetails" 
                      value={itemDetails}
                      onChange = {(e) => setitemDetails(e.target.value)}
                      className='form-control' required/>
                    </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6 col-md-6">
                    <div className="form-group">
                      <label>
                        Stock No <span className="text-danger">*</span>
                      </label>
                      <input type="text" 
                      name="stockNo" 
                      value={stockNo}
                      onChange = {(e) => setstockNo(e.target.value)}
                      className='form-control' required/>
                    </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6 col-md-6">
                    <div className="form-group">
                      <label>
                        Quantity <span className="text-danger">*</span>
                      </label>
                      <input type="text" 
                      name="quantity" 
                      value={quantity}
                      onChange = {(e) => setquantity(e.target.value)}
                      className='form-control' required/>
                    </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6 col-md-6">
                    <div className="form-group">
                      <label>
                        Bill Status <span className="text-danger">*</span>
                      </label>
                      <select
                      className="custom-select"
                      value={billStatus}
                      onChange={(e) => setbillStatus(e.target.value)} 
                      >
                      <option selected>Please Select</option>
                      {["UPAID", "PAID"].map((bs, index) => (
                        <option key={index} value={bs}>
                          {bs}
                        </option>
                      ))}
                    </select>
                    </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6 col-md-6">
                  <div className="form-group">
                    <label>
                      Vendor <span className="text-danger">*</span>
                    </label>
                    <select
                      className="custom-select"
                      value={vendor}
                      onChange={(e) => setVendor(e.target.value)} 
                      >
                      <option selected>Please Select</option>
                      {vendors.map((vendor) => (
                        <option key={vendor._id} value={vendor._id}>
                          {vendor.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-6 col-md-4">
                  <div className="form-group">
                    <label>
                      Date <span className="text-danger">*</span>
                    </label>
                    <input type="date" 
                    name="date" 
                    value={date}
                    onChange={(e) => setdate(e.target.value)}
                    className='form-control' required/>
                  </div>
                </div>
              </div>

              <div className='row'>
                <button className="btn btn-primary mr-2" type="submit">
                  Save
                </button>
                <div className="btn btn-outline-secondary">
                  <Link to={`/app/stock/stocklist`}>Cancel</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddStock