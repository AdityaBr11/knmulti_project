import React, { useState } from 'react';
import DatePicker from 'react-date-picker';

export default function AddProjectModal({ onSubmit, setProjectToAdd }) {

  const [projectType, setProjectType] = useState("");
  const [doj, Setdoj] = useState(new Date());
  console.log(doj, 'doj');
  return (
    <div id="create_project" className="modal custom-modal fade" role="dialog">
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create Project</h5>
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
              onSubmit={async (e) => {
                e.preventDefault();
                onSubmit(e.target.reset);
                e.target.reset();
              }}
            >
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Project Name</label>
                    <input
                      onChange={(e) => {
                        setProjectToAdd((d) => ({
                          ...d,
                          name: e.target.value,
                        }));
                      }}
                      className="form-control"
                      type="text"
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Start 1Date</label>
                    <div>
                      <DatePicker
                        // poppername="endDate"
                        className="form-control"
                        // style={{ border: 'none', backgroundColor: 'red' }}
                        value={doj}
                        // value={}
                        onChange={(e) => {
                          setProjectToAdd((d) => ({
                            ...d,
                            startDate: e,
                          }));
                          Setdoj(e)
                        }}
                      />
                      {/* {projectToAdd.startDate} */}
                      {/* <input
                        className="form-control"
                        onChange={(e) => {
                          setProjectToAdd((d) => ({
                            ...d,
                            startDate: e.target.value,
                          }));
                        }}
                        type="date"
                      /> */}
                    </div>
                  </div>
                </div>

              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Type</label>
                    <select
                      onChange={(e) => {
                        setProjectType(e.target.value);
                        setProjectToAdd((d) => ({
                          ...d,
                          type: e.target.value,
                        }));
                      }}
                      className="custom-select"
                    >
                      <option value={''} hidden>
                        Select type
                      </option>
                      <option value={'Plot'}>Plotting</option>
                      <option value={'Housing'}>Housing</option>
                    </select>
                  </div>
                </div>
                {projectType == "Plot" &&

                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Sub Type</label>
                      <select
                        onChange={(e) => {
                          setProjectToAdd((d) => ({
                            ...d,
                            subtype: e.target.value,
                          }));
                        }}
                        className="custom-select"
                      >
                        <option value={''} hidden>
                          Select type
                        </option>
                        <option value={'Residencial Plot'}>Residencial Plot</option>
                        <option value={'Commercial Plot'}>Commercial Plot</option>
                        <option value={'Farm Plot'}>Farm Plot</option>
                      </select>
                    </div>
                  </div>
                }
                {projectType == "Housing" &&

                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Sub Type</label>
                      <select
                        onChange={(e) => {
                          setProjectToAdd((d) => ({
                            ...d,
                            subtype: e.target.value,
                          }));
                        }}
                        className="custom-select"
                      >
                        <option value={''} hidden>
                          Select type
                        </option>
                        <option value={'Apartment'}>Apartment</option>
                        <option value={'Simplex'}>Simplex</option>
                        <option value={'Duplex'}>Duplex</option>
                        <option value={'Triplex'}>Triplex</option>
                        <option value={'Villa'}>Villa</option>
                        <option value={'Bunglow'}>Bunglow</option>
                        <option value={'Penthouse'}>Penthouse</option>
                      </select>
                    </div>
                  </div>
                }
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Sale Status</label>
                    <select
                      onChange={(e) => {
                        setProjectToAdd((d) => ({
                          ...d,
                          saleStatus: e.target.value,
                        }));
                      }}
                      className="custom-select"
                    >
                      <option value={''} hidden>
                        Select Status
                      </option>
                      <option value={'Not Live'}>Not Live</option>
                      <option value={'Live'}>Live</option>
                    </select>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Cost/sq Feet</label>
                    <input
                      onChange={(e) => {
                        setProjectToAdd((d) => ({
                          ...d,
                          costPerSqFeet: e.target.value,
                        }));
                      }}
                      className="form-control"
                      type="number"
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows={4}
                  className="form-control"
                  placeholder="Description"
                  defaultValue={''}
                  onChange={(e) => {
                    setProjectToAdd((d) => ({
                      ...d,
                      description: e.target.value,
                    }));
                  }}
                />
              </div>
              <div className="submit-section">
                <button className="btn btn-primary submit-btn">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
