import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useHistory } from 'react-router-dom'
import httpService from '../../lib/httpService';

const AddBillStock = () => {
  const history = useHistory();

  const [ vendors, setVendors ] = useState([]);
  const [ vendor, setVendor ] = useState(undefined);

  const [ vendorBills, setVendorBills ] = useState([]);
  const [ vendorBill, setVendorBill ] = useState(undefined);
  const [ billData, setBillData ] = useState({});

  const [ addStockDate, setAddStockDate ] = useState("");

  const fetchVendors = async () => {
    const res = await httpService.get('/vendor');
    setVendors(res.data);
  };

  const fetchVendorBill = async () => {
    if(vendor){
      const res = await httpService.get(`/vendortrx/getvendorbills?vendorId=${vendor}&status=${"PAID"}`);
      setVendorBills(res.data);
      setBillData({});
    } else {
      setVendorBills([]);
      setBillData({});
    }
  }

  const handleStock = () => {
    if(vendorBill){
      let updatedBillData = vendorBills.filter(f => f?._id == vendorBill)[0];
      let billtrx = updatedBillData?.transaction;
      let updatedBilltrx = billtrx?.map(bt => {
        const upbt = {
          itemDetails: bt.itemDetails,
          stockNo: `STK-${Math.ceil(Math.random()*100000)}`,
          quantity: bt.quantity,
          billStatus : updatedBillData.status,
          leftQuantity: bt.quantity,
          vendorId : vendor,
          billId: vendorBill,
          date: addStockDate
        }
        return upbt;
      })
      const updtedBillWithTrx = { ...updatedBillData, transaction : updatedBilltrx }
      setBillData(updtedBillWithTrx);
    } else {
      setBillData({});
    }
  }

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ustockData = [ ...billData.transaction ]
    

    const res = await httpService.post('/stock/billstock', ustockData);
    history.push(`/app/stock/stocklist`);
  }

  return (
    <div className="page-wrapper"> 
      <Helmet>
        <title>Add Billed Stock</title>
        <meta name="description" content="Add Billed Stock" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col">
              <h3 className="page-title">Add Billed Stock</h3>
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
                      Vendor <span className="text-danger">*</span>
                    </label>
                    <select
                      className="custom-select"
                      value={vendor}
                      onChange={(e) => setVendor(e.target.value)}
                      onBlur={fetchVendorBill} 
                      required
                      >
                      <option value={""} selected>Please Select</option>
                      {vendors.map((vendor) => (
                        <option key={vendor._id} value={vendor._id}>
                          {vendor.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-sm-6 col-md-6">
                  <div className="form-group">
                    <label>
                      Vendor Bills <span className="text-danger">*</span>
                    </label>
                    <select
                      className="custom-select"
                      value={vendorBill}
                      onChange={(e) => setVendorBill(e.target.value)}
                      onBlur={handleStock}
                      required
                      >
                      <option value={""} selected>Please Select</option>
                      {vendorBills.map((vb) => (
                        <option key={vb?._id} value={vb?._id}>
                          {vb?.billNo}
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
                    name="addStockDate" 
                    value={addStockDate}
                    onChange={(e) => setAddStockDate(e.target.value)}
                    onBlur={handleStock}
                    className='form-control' required/>
                  </div>
                </div>
              </div>

              <div>
                <table className="table table-striped">
                  <thead>
                    <tr className='bg-primary'>
                      <th>Sr No.</th>
                      <th>Date</th>
                      <th>Item and Description</th>
                      <th>Stock No</th>
                      <th>Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    { billData && billData?.transaction?.length > 0 && billData?.transaction.map((trx, index) => <tr>
                      <td>{index+1}</td>
                      <td>{trx?.date}</td>
                      <td>{trx?.itemDetails}</td>
                      <td>{trx?.stockNo}</td>
                      <td>{trx?.quantity}</td>
                    </tr>) }
                    
                  </tbody>
                </table>
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

export default AddBillStock