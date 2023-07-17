import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import httpService from '../../../lib/httpService';

const TransferStk = ({ allStock, pId, fetchTransferStock }) => {

  const history = useHistory();

  const [ currStk, setcurrStk ] = useState("");
  const [ transferDate, settransferDate ] = useState("");
  const [ stkData, setstkData ] = useState("");
  const [ projects, setProjects ] = useState([]);
  const [ currProject, setcurrProject ] = useState("");
  const [ transferStock, setTransferStock ] = useState(0);

  const handleBlur = async () => {
    setstkData(allStock.filter(a => a?._id == currStk)[0]);
    const res = await httpService.get('/project');
    setProjects(res.data.filter(p => p?._id != pId));
  }
  
  console.log(stkData)
  const handleSubmit = (e) => {
    e.preventDefault();

    const transferStk = {
      date: transferDate,
      stockId: stkData?._id,
      // splitStockId: stkData?._id,
      transferQuantity: transferStock,
      unit: stkData?.unit,
      projectFrom: stkData?.projectId?._id,
      projectTo: currProject,
    }

    httpService.post(`/stock/transtock`, transferStk)
      .then((res) => fetchTransferStock())
      .catch((err) => console.log({err}))
      document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

  return (
    <div id="transfer_stocks" className="modal custom-modal fade" role="dialog">
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Transfer Stock</h5>
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
              onSubmit={handleSubmit}
            >
              <div className="row">
                <div className="col-md-6 col-sm-6">
                  <label htmlFor="">Stock</label>
                  <select name="" id="" className='custom-select' 
                  value={currStk} onChange={(e) => setcurrStk(e.target.value)}
                  onBlur={handleBlur}
                  >
                    <option value="">Select Stock</option>
                    { allStock.map((s) => (
                      <option key={s?._id} value={s?._id}>{s?.itemDetails} | {s?.stockNo}</option>
                    )) }
                  </select>
                </div>
                <div className="col-md-6 col-sm-6">
                  <label htmlFor="">Date</label>
                  <input type="date" className="form-control"
                    value={transferDate}
                    onChange={(e) => settransferDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              { stkData && 
                <>
                <div className="row">
                  <div className="col-md-6 col-sm-6">
                    <label htmlFor="">Transfer From</label>
                    <h4>{stkData?.projectId?.name}</h4>
                  </div>
                  <div className="col-md-6 col-sm-6">
                    <label htmlFor="">Transfer To</label>
                    <select name="" id="" className="custom-select"
                      value={currProject}
                      onChange={(e) => setcurrProject(e.target.value)}
                      required
                    > 
                    <option value="">Select Project</option>
                    { projects?.map(p => (
                      <option key={p?._id} value={p?._id}>{ p?.name }</option>
                    )) }
                    </select>
                  </div>
                  <div className="col-md-6 col-sm-6">
                    <label htmlFor="">Left Quantity</label>
                    <h4>{stkData?.leftQuantity} {stkData?.unit}</h4>
                  </div>
                  <div className="col-md-6 col-sm-6">
                    <label htmlFor="">Transfer Quantity</label>
                    <input type="number" className="form-control"
                      value={transferStock}
                      onChange={(e) => setTransferStock(e.target.value)}
                      max={stkData?.leftQuantity}
                      min={1}
                      required
                    />
                  </div>
                </div>
                </>
              }
              <br />
              <div className='row'>
                <button className="btn btn-primary mr-2" type="submit">
                  Save
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransferStk