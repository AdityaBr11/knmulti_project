/**
 * Signin Firebase
 */

 import React, { useEffect, useState } from 'react';
 import { Helmet } from 'react-helmet';
 import { Link } from 'react-router-dom';
 import httpService from '../../../lib/httpService';
 
 const Role = () => {
 
   const [ roles, setroles ] = useState([]);
   const [ roleName, setroleName ] = useState("");
   const [curr, setCurr] = useState("");
 
   const fetchRoles = async () => {
     const res = await httpService.get(`/role`);
     setroles(res?.data);
   }
 
   const handleLinkClick = (e, roleId, roleN) => {
     setCurr(roleId);
     setroleName(roleN);
   }
 
   const handleRoleName = async (e) => {
     e.preventDefault();
     await httpService.put(`/role/${curr}`, { name: roleName });
     await fetchRoles();
     document.querySelectorAll('.close')?.forEach((e) => e.click());
   }
 
   const handleDelete = async (e) => {
     e.preventDefault()
     await httpService.delete(`/role/${curr}`);
     await fetchRoles();
     document.querySelectorAll('.close')?.forEach((e) => e.click());
   }

   const handleSubmit = async (e) => {
    e.preventDefault();
    if(roleName != ""){
      await httpService.post(`/role`, { name : roleName });
      await fetchRoles();
    }
    document.querySelectorAll('.close')?.forEach((e) => e.click());
    
  }
 
   useEffect(() => {
 
     fetchRoles();
 
     if ($('.select').length > 0) {
       $('.select').select2({
         minimumResultsForSearch: -1,
         width: '100%',
       });
     }
   }, []);
 
   return (
     <div className="page-wrapper">
       <Helmet>
         <title>Role </title>
         <meta name="description" content="Login page" />
       </Helmet>
       {/* Page Content */}
       <div className="content container-fluid">
         <div className="row">
           <div className="col-md-8 offset-md-2">
             {/* Page Header */}
             <div className="page-header">
               <div className="row">
                 <div className="col-sm-12">
                   <h3 className="page-title">Add Roles</h3>
                 </div>
               </div>
             </div>
             {/* /Page Header */}
               <div className="row">
                 <div className="col-sm-6">
                   <Link
                     to="#"
                     className="btn btn-primary btn-block"
                     data-toggle="modal"
                     data-target="#add_role"
                   >
                     <i className="fa fa-plus" /> Add Role
                   </Link>
                   <div className="roles-menu">
                     <ul>
                     {
                       roles.length && 
                         roles.map((role, index) => (
                           <li key={role?._id} 
                             onClick={(e) => handleLinkClick(e, role?._id, role?.name)}
                             className={ curr === role?._id ? "active" : "" }
                           >
                             <Link to="#">
                               {role?.name}
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
               </div>
               {/* <AddroleModal /> */}
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
                              Role <span className="text-danger">*</span>
                            </label>
                            <input className="form-control" type="text"
                              value={roleName}
                              onChange={(e) => setroleName(e.target.value)}
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

               <div id="edit_role" className="modal custom-modal fade" role="dialog">
                 <div className="modal-dialog modal-dialog-centered" role="document">
                   <div className="modal-content modal-md">
                     <div className="modal-header">
                       <h5 className="modal-title">Edit role</h5>
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
                             role <span className="text-danger">*</span>
                           </label>
                           <input
                             className="form-control"
                             // defaultValue="Team Leader"
                             type="text"
                             value={roleName}
                             onChange={(e) => setroleName(e.target.value)}
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
 
               {/* delete  */}
               <div className="modal custom-modal fade" id="delete_role" role="dialog">
                 <div className="modal-dialog modal-dialog-centered">
                   <div className="modal-content">
                     <div className="modal-body">
                       <div className="form-header">
                         <h3>Delete role</h3>
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
           </div>
         </div>
       </div>
       {/* /Page Content */}
     </div>
   );
 };
 
 export default Role;
 