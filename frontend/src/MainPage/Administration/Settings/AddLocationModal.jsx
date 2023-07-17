import React, { useState } from 'react'
import httpService from '../../../lib/httpService';

const AddLocationModal = ({ fetchLocation }) => {

  const [ loc, setLoc ] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(loc != ""){
      await httpService.post(`/location`, { name : loc });
    }
    fetchLocation();
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

  return (
    <div id="add_loc" className="modal custom-modal fade" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Location</h5>
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
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  Location <span className="text-danger">*</span>
                </label>
                <input className="form-control" type="text"
                  value={loc}
                  onChange={(e) => setLoc(e.target.value)}
                />
              </div>
              <div className="">
                <button className="btn btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddLocationModal