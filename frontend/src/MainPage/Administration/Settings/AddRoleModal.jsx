import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { postRoleAccessPrem } from '../../../features/roleAccessPerm/roleAccessPremSlice';

const AddRoleModal = () => {

  const dispatch = useDispatch();

  const [ role, setRole ] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(postRoleAccessPrem({ role }));
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

  return (
    <div id="add_role" className="modal custom-modal fade" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Role</h5>
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
                  Role Name <span className="text-danger">*</span>
                </label>
                <input className="form-control" type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
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

export default AddRoleModal