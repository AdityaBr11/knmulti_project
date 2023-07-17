import { Add, DeleteOutline } from '@mui/icons-material';
import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import httpService from '../../../lib/httpService';

const AddOtherPlotDetails = ({ setRerender, plots }) => {

  const { id } = useParams();

  const [ currPlot, setcurrPlot ] = useState("");

  const [ plotData, setPlotData ] = useState("");

  const detailsTemplate = {
    name: "",
    area: 0,
    percent: 0,
    cost: 0,
    description: ""
  };

  const [ otherData, setotherData ] = useState([detailsTemplate]);

  const handleBlur = () => {
    const plotDetails = plots.filter(p => p?.name == currPlot)[0];
    setPlotData(plotDetails);
    setotherData([detailsTemplate]);
  }

  const addOtherDetailField = () => {
    setotherData([ ...otherData, detailsTemplate ]);
  }

  const removeOtherDataField = (e, index) => {
    if(index !== 0){
      const updatedOtherDetails = otherData.filter((plt, i) => index !== i );
      setotherData(updatedOtherDetails);
    }
  }

  const handleOtherDetailsData = (e, index) => {
    const updatedOtherDetails = otherData.map((od, i) => index == i ? Object.assign(od, {[e.target.name]: e.target.value}) : od);
    setotherData(updatedOtherDetails);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // plotData?.revenuePlot = otherData;

    const newPlots = plots?.map(p => p?.name == plotData?.name ? Object.assign(p, {revenuePlot : [ ...plotData?.revenuePlot, ...otherData] }) : p);

    // console.log({newPlots});

    // console.log({otherData});

    httpService.put(`/project/${id}`, { subPlots: newPlots })
      .then(res => {
        setRerender(true);
        setRerender(false);
        // setcurrPlot("");
      });


    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

  return (
    <div id="add_otherdetails_plot" className="modal custom-modal fade" role="dialog">
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Revenue Plot</h5>
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
                    { plots.map((p, index) => (
                      <option key={index} value={p?.name}>{p?.name}</option>
                    )) }
                  </select>
                </div>
              </div>

              {  
                plotData &&
                <>
                  <div className="row">
                    <div className="col-md-12 col-sm-12">
                      <div className="table-responsive">
                        <table className="table table-hover table-white">
                          <thead>
                            <tr className="text-center">
                              <td>Name <span className="text-danger">*</span></td>
                              <td>Area <span className="text-danger">*</span></td>
                              <td>Percent(%) <span className="text-danger">*</span></td>
                              <td>Area Cost <span className="text-danger">*</span></td>
                              <td>Description</td>
                              <td>Remove</td>
                            </tr>
                          </thead>
                          <tbody>
                          { otherData.map((od, index) => (
                            <tr>
                              <td style={{ width: "200px" }}>
                                <input type="text" name="name" className="form-control"
                                  value={od?.name}
                                  onChange={(e) => handleOtherDetailsData(e, index)}
                                  required
                                />
                              </td>
                              <td style={{ width: "100px" }}>
                                <input type="number" name="area" className="form-control"
                                  value={od?.area}
                                  onChange={(e) => handleOtherDetailsData(e, index)}
                                  required
                                />
                              </td>
                              <td style={{ width: "100px" }}>
                                <input type="number" name="percent" className="form-control"
                                  value={od?.percent}
                                  onChange={(e) => handleOtherDetailsData(e, index)}
                                  required
                                />
                              </td>
                              <td style={{ width: "200px" }}>
                                <input type="number" name="cost" className="form-control"
                                  value={od?.cost}
                                  onChange={(e) => handleOtherDetailsData(e, index)}
                                  required
                                />
                              </td>
                              <td>
                                <input type="text" name="description" className="form-control"
                                value={od?.description}
                                onChange={(e) => handleOtherDetailsData(e, index)}
                                />
                              </td>
                              <td className='text-center'>
                              { index !== 0 && 
                                <DeleteOutline onClick={(e) => removeOtherDataField(e, index)} />
                              }
                            </td>
                            </tr>
                          )) }
                          </tbody>
                        </table>
                        <div className="ml-3 btn btn-primary" onClick={addOtherDetailField}><Add /> Add another</div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <button className="btn btn-primary m-2" type="submit">
                      Save
                    </button>
                  </div>
                </>}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
  }

  export default AddOtherPlotDetails