/**
 * Signin Firebase
 */
 
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import AddRoleModal from './AddRoleModal';
import { useDispatch, useSelector } from 'react-redux';
import { deleteRoleAccessPrem, getRoleAccessPrem, putRoleAccessPrem, setCurrentRoleAcc } from '../../../features/roleAccessPerm/roleAccessPremSlice';
import ModuleAccess from './ModuleAccess';

const RolePermisson = () => {

  const dispatch = useDispatch();

  const { roleAccessParams, current, isLoading } = useSelector(state => state.roleAccessParams);

  const [curr, setCurr] = useState("");
  const [ roleName, setRoleName ] = useState("");

  useEffect(() => {
    dispatch(getRoleAccessPrem());
    if(current){
      setCurr(current?._id);
      setRoleName(current.role);
    } else {
      setCurr(roleAccessParams[0]?._id);
      setRoleName(roleAccessParams[0]?.role);
      dispatch(setCurrentRoleAcc(roleAccessParams[0]?._id));
    }
  }, []);

  const handleLinkClick = (e, roleId) => {
    dispatch(setCurrentRoleAcc(roleId));
    setCurr(roleId);
    setRoleName(current.role);
  }

  const handleRoleName = () => {
    const accessData = {
      _id : current._id,
      role: roleName
    }
    dispatch(putRoleAccessPrem(accessData));
  }

  const handleDelete = () => {
    dispatch(deleteRoleAccessPrem(current._id));
    dispatch(setCurrentRoleAcc(roleAccessParams[0]?._id));
  }

  if(isLoading){
    return(
      <div>Loading</div>
    )
  }

  return (
    <div className="page-wrapper">
      <Helmet> 
        <title>Roles & Permissions </title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col-sm-12">
              <h3 className="page-title">Roles &amp; Permissions</h3>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        <div className="row">
          <div className="col-sm-4 col-md-4 col-lg-4 col-xl-3">
            <Link
              to="#"
              className="btn btn-primary btn-block"
              data-toggle="modal"
              data-target="#add_role"
            >
              <i className="fa fa-plus" /> Add Roles
            </Link>
            <div className="roles-menu">
              <ul>

                {
                  roleAccessParams.length && 
                    roleAccessParams.map((rap, index) => (
                      <li key={rap?._id} 
                        onClick={(e) => handleLinkClick(e, rap?._id)}
                        className={ curr === rap?._id ? "active" : "" }
                      >
                        <Link to="#">
                          {rap?.role}
                          <span className="role-action">
                            <span
                              className="action-circle large"
                              data-toggle="modal"
                              data-target="#edit_role"
                            >
                              <i className="material-icons">edit</i>
                            </span>
                            <span
                              className="action-circle large delete-btn"
                              data-toggle="modal"
                              data-target="#delete_role"
                            >
                              <i className="material-icons">delete</i>
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))
                }
              </ul>
            </div>
          </div>
          {/* Module Access */}
          { !isLoading && current && <ModuleAccess /> }
          
        </div>
      </div>
      {/* /Page Content */}
      {/* Add Role Modal */}
      <AddRoleModal />
      {/* /Add Role Modal */}
      {/* Edit Role Modal */}
      <div id="edit_role" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content modal-md">
            <div className="modal-header">
              <h5 className="modal-title">Edit Role</h5>
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
              <form>
                <div className="form-group">
                  <label>
                    Role Name <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    // defaultValue="Team Leader"
                    type="text"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                  />
                </div>
                <div className="submit-section">
                  <div className="btn btn-primary"
                    data-dismiss="modal"
                    onClick={handleRoleName}
                  >Save</div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit Role Modal */}
      {/* Delete Role Modal */}
      <div className="modal custom-modal fade" id="delete_role" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete Role</h3>
                <p>Are you sure want to delete?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row text-center">
                  <div className="col-6"
                  
                    onClick={handleDelete}
                  >
                    <Link to="#" className="btn btn-primary" data-dismiss="modal">
                      Delete
                    </Link>
                  </div>
                  <div className="col-6">
                    <Link
                      to="#"
                      data-dismiss="modal"
                      className="btn btn-primary"
                    >
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Delete Role Modal */}
    </div>
  );
};

export default RolePermisson;
