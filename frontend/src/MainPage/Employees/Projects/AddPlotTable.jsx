import { Add, DeleteOutline } from '@material-ui/icons';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import httpService from '../../../lib/httpService';

const AddPlotTable = ({ projectId, fetchProjectDetails, projectType }) => {

  const plotTemplate = {
    name: "",
    dimension: "",
    area: 0,
    areaCost: 0,
    corner: 0,
    other: 0,
    cost: 0,
    facing: "",
    description: ""
  };
  const [ plotData, setplotData ] = useState([plotTemplate]);

  const addPlotField = () => {
    setplotData([ ...plotData, plotTemplate ]);
  }

  const removePlotField = (e, index) => {
    if(index !== 0){
      const updatedPlot = plotData.filter((plt, i) => index !== i );
      setplotData(updatedPlot);
    }
  }

  const handlePlotData = (e, index) => {
    const updatedPlot = plotData.map((plot, i) => index == i ? Object.assign(plot, {[e.target.name]: e.target.value }) : plot);
    setplotData(updatedPlot);
  }

  const handleRowValue = (e, index) => {
    
    let updatedCost = (+ plotData[index]?.areaCost) + (+ plotData[index]?.corner) + (+ plotData[index]?.other);
    const updatePlot = plotData.map((pd, i) => index == i ? Object.assign(pd, {cost : updatedCost}) : pd);
    setplotData(updatePlot);
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.table(plotData);
    toast
      .promise(
        httpService
          .post(`/project/${projectId}/subPlots`, { subPlots: plotData } )
          .catch(() => {
            toast.error('Something went wrong');
          }),
        {
          error: 'Something went wrong',
          success: 'Plot deatils updated successfully',
          pending: 'Updating Plot Deatils',
        }
      )
      .then(() => {
        fetchProjectDetails();
      });
      document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

  return (
    <div id="add_plots" className="modal custom-modal fade" role="dialog">
      <div
        className="modal-dialog modal-dialog-centered modal-xl"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add {projectType}s</h5>
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
                <div className="col-md-12 col-sm-12">
                  <div className="table-responsive">
                    <table className="table table-hover table-white">
                      <thead>
                        <tr className="text-center">
                          <td>Name <span className="text-danger">*</span></td>
                          <td>Dimension <span className="text-danger">*</span></td>
                          <td>Area <span className="text-danger">*</span></td>
                          <td>Area Cost <span className="text-danger">*</span></td>
                          <td>Corner Cost</td>
                          <td>Other Cost</td>
                          <td>Grand Total <span className="text-danger">*</span></td>
                          <td>Facing</td>
                          <td>Description</td>
                          <td>Remove</td>
                        </tr>
                      </thead>
                      <tbody>
                        { plotData.map((plot, index) => (

                          <tr>
                            <td style={{ width: "100px" }}>
                              <input type="text" name="name" className="form-control"
                                value={plot.name}
                                onChange={(e) => handlePlotData(e, index)}
                                required
                              />
                            </td>
                            <td>
                              <input type="text" name="dimension" className="form-control" 
                              value={plot.dimension}
                              onChange={(e) => handlePlotData(e, index)}
                              required
                              />
                            </td>
                            <td style={{ width: "100px" }}>
                              <input type="number" name="area" className="form-control"
                              value={plot.area}
                              onChange={(e) => handlePlotData(e, index)}
                              required
                              />
                            </td>
                            <td>
                              <input type="number" name="areaCost" className="form-control"
                              value={plot.areaCost}
                              onChange={(e) => { handlePlotData(e, index);
                                handleRowValue(e, index);
                              }}
                              required
                              />
                            </td>
                            <td>
                              <input type="number" name="corner" className="form-control"
                              value={plot.corner}
                              onChange={(e) => { handlePlotData(e, index);
                                handleRowValue(e, index);
                              }}
                              />
                            </td>
                            <td>
                              <input type="number" name="other" className="form-control"
                              value={plot.other}
                              onChange={(e) => { handlePlotData(e, index);
                                handleRowValue(e, index);
                              }}
                              />
                            </td>
                            <td>
                              <input type="number" name="cost" className="form-control"
                              value={plot.cost}
                              onChange={(e) => handlePlotData(e, index)}
                              required
                              />
                            </td>
                            <td style={{ width: "110px" }}>
                              {/* <input type="text" name="facing" className="form-control"
                              value={plot.facing}
                              onChange={(e) => handlePlotData(e, index)}
                              /> */}
                              <select name="facing" className='custom-select' 
                              value={plot?.facing} 
                              onChange={(e) => handlePlotData(e, index)}
                              >
                                <option value="">Select</option>
                                <option value="North">North</option>
                                <option value="South">South</option>
                                <option value="Center">Center</option>
                                <option value="East">East</option>
                                <option value="West">West</option>
                              </select>
                            </td>
                            <td>
                              <input type="text" name="description" className="form-control"
                              value={plot.description}
                              onChange={(e) => handlePlotData(e, index)}
                              />
                            </td>
                            <td className='text-center'>
                              { index !== 0 && 
                                <DeleteOutline onClick={(e) => removePlotField(e, index)} />
                              }
                            </td>
                          </tr>
                        )) }
                      </tbody>
                    </table>
                    <div className="ml-3 btn btn-primary" onClick={addPlotField}><Add /> Add another {projectType}</div>
                  </div>
                </div>
              </div>
              <div className="row">
                <button className="btn btn-primary m-2" type="submit">
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

export default AddPlotTable