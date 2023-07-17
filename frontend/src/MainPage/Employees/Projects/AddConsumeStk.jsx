import React, { useState } from 'react'
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import httpService from '../../../lib/httpService';

const AddConsumeStk = ({ allStock, stkId, fetchStocks }) => {

  const history = useHistory();

  const [ sptStk, setsptStk ] = useState(stkId || "");

  const [ newconsumedQuantity, setconsumedQuantity ] = useState(0);

 const [ purpose, setPurpose ] = useState(stkId?.purpose || "");


  const handleSubmit = (e) => {
    e.preventDefault();
    const conQoee = Number(sptStk?.consumedQuantity) + Number(newconsumedQuantity);
    httpService.put(`/stock/${stkId?._id}`, { purpose, consumedQuantity: conQoee, leftQuantity: sptStk?.leftQuantity - newconsumedQuantity })
      .then((res) => {
        console.log(res?.data);
        fetchStocks();
      })
      .catch((err) => console.log({err}));
      document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

  const handleCancel = (e) => {
    fetchStocks();
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

  return (
    <div id="add_consume_stocks" className="modal custom-modal fade" role="dialog"
    // onClick={handleCancel}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Stock Consumtion</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={handleCancel}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <form
              onSubmit={handleSubmit}
            >
              <div className="row">
                <div className="col-md-6 col-sm-6">
                  <label>Stock Item Details</label>
                  <h3>{ sptStk?.itemDetails }</h3>
                </div>
                <div className="col-md-6 col-sm-6">
                  <label>Stock No</label>
                  <h3>{ sptStk?.stockNo }</h3>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 col-sm-6">
                  <label>Allocated Quantity</label>
                  <h3>{ sptStk?.leftQuantity } {sptStk?.unit}</h3>
                </div>
                <div className="col-md-6 col-sm-6">
                  <label>Consumed Quantity</label>
                  <input type="number" name="newconsumedQuantity" 
                  value={newconsumedQuantity} onChange={(e) => setconsumedQuantity(e.target.value)} 
                  className="form-control" max={sptStk?.leftQuantity} />
                </div>
                <div className="col-md-6 col-sm-6">
                  <label>Purpose</label>
                  <input type="text" name="purpose" 
                  value={purpose} onChange={(e) => setPurpose(e.target.value)} 
                  className="form-control" />
                </div>
              </div>
              <br />
              <div className="row">
                <button className="btn btn-primary mr-2" type="submit">
                  Save
                </button>
                <div className="btn btn-outline-secondary" onClick={handleCancel}>
                  Cancel
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddConsumeStk