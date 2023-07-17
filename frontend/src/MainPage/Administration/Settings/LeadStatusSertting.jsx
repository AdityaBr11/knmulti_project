import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import httpService from '../../../lib/httpService';

const LeadStatusSetting = () => {

  const [status, setStatus] = useState();
  const [statusName, setStatusName] = useState();
  const [position, setPosition] = useState();
  const [allowed, setAllowed] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState();
  const [edit, setEdit] = useState(false)

  useEffect(async () => {
    await fetchStatus()
  }, []);

  const fetchStatus = async () => {
    const { data } = await httpService.get('/lead-status');
    setStatus(data);
    let statId = []
    data.forEach((status) => {
      statId.push(status._id);
    });
    setAllowed(statId);
  };

  const handleEdit = (stat) => {
    setEdit(true);
    setSelectedStatus(stat)
    setStatusName(stat.name);
    setPosition(stat.position);
    setAllowed(stat.allowed);
  }

  const handleSubmit = async () => {
    if (statusName === null || statusName === undefined) {
      toast.error('Status name is required', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    if (position === null || position === undefined) {
      toast.error('Position of the status is required.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    };
    const status = {
      name: statusName,
      position: position - 1,
      allowed,
    }
    if (edit) {
      await httpService.put(`/lead-status/${selectedStatus?._id}`, status);
      setStatusName('');
      setPosition('')
      await fetchStatus()
      document.querySelectorAll('.close')?.forEach((e) => e.click());
      return;
    }
    await httpService.post('lead-status', status);
    setStatusName('');
    setPosition('')
    await fetchStatus()
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  };

  const handleDelete = async (stat) => {
    console.log(stat)
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const status = await httpService.delete(`/lead-status/${stat._id}`)
        if (status) {
          return status
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    })
    .then(async (result) => {
      console.log(result)
      if (result?.value?.data?.msg === 'deleted successfully') {
        Swal.fire({
          title: `Status Deleted Successfully`,
        })
        await fetchStatus()
      } else if (result?.value?.data?.length) {
        Swal.fire({
          icon: 'error',
          title: `There are ${result?.value?.data?.length} leads with this status`
        })
      }
    })
  }

  const handleAllowedChange = (e) => {
    let stateId = allowed;
    if (stateId?.includes(e.target.value)) {
      stateId = stateId?.filter((v, i) => v !== e.target.value);
    } else {
      stateId.push(e.target.value);
    }
    setAllowed(stateId)
  }

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Lead Setting</title>
        <meta name="description" content="Login page" />
      </Helmet>
      <div className="content container-fluid">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <h3 className="page-title">Lead Status Setting</h3>
                </div>
              </div>
            </div>

               <div className="row">
                 <div className="col-sm-6">
                   <Link
                     to="#"
                     className="btn btn-primary btn-block"
                     data-toggle="modal"
                     data-target="#add_status"
                     onClick={() => setEdit(false)}
                   >
                     <i className="fa fa-plus" /> Add Status
                   </Link>
                   <div className="roles-menu">
                     <ul>
                     {
                       status?.length && 
                         status?.map((stat, index) => (
                           <li key={stat?._id} 
                           >
                             <Link to="#">
                               {stat?.name}
                               {console.log(stat,'stat frm editbtn')}
                               <span className="role-action">
                                 <span
                                   className="action-circle large"
                                   data-toggle="modal"
                                   data-target="#add_status"
                                   onClick={() => handleEdit(stat)}
                                 >
                                   <i className="material-icons">edit</i>
                                 </span>
                                 <span
                                   className="action-circle large delete-btn"
                                  //  data-toggle="modal"
                                  //  data-target="#delete_status"
                                   onClick={() => handleDelete(stat)}
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

               <div id="add_status" className="modal custom-modal fade" role="dialog">
                  <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Add Status</h5>
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
                        <form onSubmit={(e) => {
                          handleSubmit()
                          e.preventDefault();
                        }}>
                          <div className="form-group">
                            <label>
                              Status <span className="text-danger">*</span>
                            </label>
                            <input className="form-control" type="text"
                              value={statusName}
                              onChange={(e) => setStatusName(e.target.value)}
                            />
                          </div>
                          <div className="form-group">
                            <label>
                              Position <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              min={1}
                              max={status?.length+1}
                              className="form-control"
                              value={position}
                              onChange={(e) => setPosition(e.target.value)}
                            />
                          </div>
                          <div className="form-group">
                            <label>
                              Accept From <span className="text-danger">*</span>
                            </label>
                            <br />
                            {status?.length && status?.map((stat,index) => (
                              <>
                              {console.log(stat,'stat')}
                                <input
                                  className=""
                                  // checked={allowed?.includes(stat?.allowed[index]) ? true : false}
                                  onChange={(e) => handleAllowedChange(e)}
                                  type="checkbox" 
                                  id={stat._id} 
                                  name={stat.name} 
                                  value={stat._id}
                                />
                                <label className="mr-2" for={stat._id}> {stat?.name}</label>                              
                                <br />
                              </>
                            ))}
                            
                          </div>
                          <div className="">
                            <button className="btn btn-primary">Submit</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div id="edit_role" className="modal custom-modal fade" role="dialog">
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
              </div> */}
          </div>
        </div>
      </div>
  )
}

export default LeadStatusSetting