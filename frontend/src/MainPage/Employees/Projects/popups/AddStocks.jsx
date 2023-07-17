import React from 'react'

const AddStocks = ({ handleStockSubmit, stocks, handleStocks, vendorList}) => 
(
  <div id="add_stocks" className="modal custom-modal fade" role="dialog">
    <div
      className="modal-dialog modal-dialog-centered modal-lg"
      role="document"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Add Stocks</h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="modal-body">
          <form
            onSubmit={handleStockSubmit}
          >
            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Item Name</label>
                  <input
                    name="itemName"
                    value={stocks.itemName}
                    onChange={handleStocks}
                    className="form-control"
                    type="text"
                    required
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <div className="form-group">
                    <label>Total Quantity</label>
                    <input
                       name="totalQuantity"
                      value={stocks.totalQuantity}
                      onChange={handleStocks}
                      className="form-control"
                      type="number"
                      min={0}
                      required
                    />
                  </div>
                </div>
              </div>
              
            </div>
            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <div className="form-group">
                    <label>Required Quantity</label>
                    <input
                      name="reqQuantity"
                      value={stocks.reqQuantity}
                      onChange={handleStocks}
                      className="form-control"
                      type="number"
                      min={0}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <div className="form-group">
                    <label>Left Quantity</label>
                    <input
                      name="leftQuantity"
                      value={stocks.leftQuantity}
                      onChange={handleStocks}
                      className="form-control"
                      type="number"
                      min={0}
                      required
                    />
                  </div>
                </div>
              </div>
              
            </div>
            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Spent For</label>
                  <div>
                    <input
                      name="spentFor"
                      value={stocks.spentFor}
                      onChange={handleStocks}
                      className="form-control"
                      type="text"
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Vendor Name</label>
                  <select
                    name="vendorId"
                    value={stocks.vendorId}
                    onChange={handleStocks}
                    className="custom-select"
                  >
                    <option value={undefined}>Select type</option>
                    { vendorList.length && vendorList.map(v => 
                    <option value={v?._id}>{v?.name}</option>) }
                  </select>
                </div>
              </div>
            </div>
            
            <div className="submit-section">
              <button className="btn btn-primary submit-btn" disabled={ (+stocks.totalQuantity) !== ((+stocks.reqQuantity) + (+stocks.leftQuantity)) }>Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  );

export default AddStocks