import React from 'react';

const DeleteProjectModal = ({ onSubmit }) => (
  <div className="modal custom-modal fade" id="delete_project" role="dialog">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-body">
          <div className="form-header">
            <h3>Delete Project</h3>
            <p>Are you sure want to delete?</p>
          </div>
          <div className="modal-btn delete-action">
            <div className="row">
              <div className="col-6">
                <a
                  href=""
                  onClick={(e) => {
                    e.preventDefault();
                    onSubmit();
                  }}
                  className="btn btn-primary continue-btn"
                >
                  Delete
                </a>
              </div>
              <div className="col-6">
                <a
                  href=""
                  data-dismiss="modal"
                  className="btn btn-primary cancel-btn"
                >
                  Cancel
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DeleteProjectModal;
