/**
 * Signin Firebase
 */

 import React, { useEffect, useState } from 'react';
 import { Helmet } from 'react-helmet';
 import { Link } from 'react-router-dom';
 import httpService from '../../../lib/httpService';
 
 const Department = () => {
 
   const [ depts, setdepts ] = useState([]);
   const [ deptName, setdeptName ] = useState("");
   const [curr, setCurr] = useState("");
 
   const fetchdepts = async () => {
     const res = await httpService.get(`/department`);
     setdepts(res?.data);
   }
 
   const handleLinkClick = (e, deptId, deptN) => {
     setCurr(deptId);
     setdeptName(deptN);
   }
 
   const handledeptName = async (e) => {
     e.preventDefault();
     await httpService.put(`/department/${curr}`, { name: deptName });
     await fetchdepts();
     document.querySelectorAll('.close')?.forEach((e) => e.click());
   }
 
   const handleDelete = async (e) => {
     e.preventDefault()
     await httpService.delete(`/department/${curr}`);
     await fetchdepts();
     document.querySelectorAll('.close')?.forEach((e) => e.click());
   }

   const handleSubmit = async (e) => {
    e.preventDefault();
    if(deptName != ""){
      await httpService.post(`/department`, { name : deptName });
      await fetchdepts();
    }
    document.querySelectorAll('.close')?.forEach((e) => e.click());
    
  }
 
   useEffect(() => {
 
     fetchdepts();
 
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
         <title>Department </title>
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
                   <h3 className="page-title">Add Department</h3>
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
                     data-target="#add_dept"
                   >
                     <i className="fa fa-plus" /> Add Department
                   </Link>
                   <div className="roles-menu">
                     <ul>
                     {
                       depts.length && 
                         depts.map((dept, index) => (
                           <li key={dept?._id} 
                             onClick={(e) => handleLinkClick(e, dept?._id, dept?.name)}
                             className={ curr === dept?._id ? "active" : "" }
                           >
                             <Link to="#">
                               {dept?.name}
                               <span className="role-action">
                                 <span
                                   className="action-circle large"
                                   data-toggle="modal"
                                   data-target="#edit_dept"
                                 >
                                   <i className="material-icons">edit</i>
                                 </span>
                                 <span
                                   className="action-circle large delete-btn"
                                   data-toggle="modal"
                                   data-target="#delete_dept"
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
               <div id="add_dept" className="modal custom-modal fade" role="dialog">
                  <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Add Department</h5>
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
                            Department <span className="text-danger">*</span>
                            </label>
                            <input className="form-control" type="text"
                              value={deptName}
                              onChange={(e) => setdeptName(e.target.value)}
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

               <div id="edit_dept" className="modal custom-modal fade" role="dialog">
                 <div className="modal-dialog modal-dialog-centered" role="document">
                   <div className="modal-content modal-md">
                     <div className="modal-header">
                       <h5 className="modal-title">Edit Department</h5>
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
                           Department <span className="text-danger">*</span>
                           </label>
                           <input
                             className="form-control"
                             // defaultValue="Team Leader"
                             type="text"
                             value={deptName}
                             onChange={(e) => setdeptName(e.target.value)}
                           />
                         </div>
                         <div className="submit-section">
                           <div className="btn btn-primary"
                             data-dismiss="modal"
                             onClick={handledeptName}
                           >Save</div>
                         </div>
                       </form>
                     </div>
                   </div>
                 </div>
               </div>
 
               {/* delete  */}
               <div className="modal custom-modal fade" id="delete_dept" role="dialog">
                 <div className="modal-dialog modal-dialog-centered">
                   <div className="modal-content">
                     <div className="modal-body">
                       <div className="form-header">
                         <h3>Delete Department</h3>
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
 
 export default Department;
 