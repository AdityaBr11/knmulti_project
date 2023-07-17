import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import httpService from '../../../lib/httpService';

const EditPlot = ({ setRerender, plots }) => {

  const { id } = useParams();

  const [ currPlot, setcurrPlot ] = useState("");

  const [ plotData, setPlotData ] = useState("");

  const handleBlur = () => {
    const plotDetails = plots.filter(p => p?.name == currPlot)[0];
    setPlotData(plotDetails);
  }

  const handleCostChange = (otherCost) => {
    const costData = (+ otherCost) + (+ plotData?.areaCost) + (+ plotData?.corner);
    setPlotData({ ...plotData, cost : costData, other: otherCost });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPlots = plots?.map(p => p?.name == plotData?.name ? Object.assign(p, {cost : plotData?.cost, other: plotData?.other}) : p);
    console.log(newPlots);
    httpService.put(`/project/${id}`, { subPlots: newPlots })
      .then(res => {
        setRerender(true);
        setRerender(false)
      });
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

  return (
    <div id="edit_plot" className="modal custom-modal fade" role="dialog">
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Plot</h5>
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
                  <label htmlFor="">Plot Name</label>
                  <select name="" id="" className='custom-select' 
                  value={currPlot} onChange={(e) => setcurrPlot(e.target.value)}
                  onBlur={handleBlur}
                  >
                    <option value="">Select Plot</option>
                    { plots.filter(pt => pt.sold !== true).map((p, index) => (
                      <option key={index} value={p?.name}>{p?.name}</option>
                    )) }
                  </select>
                </div>
              </div>

              {  
                plotData &&
                <>
                  {/* <div className="row">
                    <div className="col-sm-6">
                      <label htmlFor="">Name</label>
                      <input type="text" className="form-control"
                        value={plotData?.name}
                      />
                    </div>
                    <div className="col-sm-6">
                      <label htmlFor="">Area</label>
                      <input type="number" className="form-control"
                        value={plotData?.area}
                      />
                    </div>
                  </div> */}
                  <div className="row">
                    <div className="col-md-6 col-sm-6">
                      <label htmlFor="">Area Cost</label>
                      <input type="number" className="form-control"
                        value={plotData?.areaCost}
                        disabled
                      />
                    </div>
                    <div className="col-md-6 col-sm-6">
                      <label htmlFor="">Corner</label>
                      <input type="number" className="form-control"
                        value={plotData?.corner}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 col-sm-6">
                      <label htmlFor="">Other</label>
                      <input type="number" className="form-control"
                        value={plotData?.other}
                        onChange={(e) => { 
                          // setPlotData(e.target.value);
                          handleCostChange(e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-md-6 col-sm-6">
                      <label htmlFor="">Cost</label>
                      <input type="number" className="form-control"
                        value={plotData?.cost}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <label htmlFor="">Area</label>
                      <input type="number" className="form-control"
                        value={plotData?.area}
                        disabled
                      />
                    </div>
                    <div className="col-sm-6 text-center p-4">
                      <button className="btn btn-primary" type="submit">
                        Update
                      </button>
                    </div>
                  </div>
                </>
              }
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditPlot