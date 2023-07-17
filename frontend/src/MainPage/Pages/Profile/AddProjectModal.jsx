import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import httpService from '../../../lib/httpService';

const AddProjectModal = ({ handleProject }) => {

  let { id } = useParams();

  const [ projectList, setProjectList ] = useState([]);

  const [ vendor, setVendor ] = useState();

  const [ projectId, setProjectId ] = useState("");

  const fetchProjectList = async () => {
      const { data } = await httpService.get('/project');
      setProjectList(data);
  };

  async function fetchApi() {
    const res = await httpService.get('/vendor/' + id);
    setVendor(res.data);
  }

  const editVendor = async () => {
    toast
      .promise(
        httpService.put(`/vendor/${id}`, {
          ...vendor,
          projectList : [ ...vendor.projectList, projectId ]
        }),
        {
          error: 'Failed to edit vendor',
          success: 'Vendor edited successfully',
          pending: 'Editing vendor',
        }
      )
      .then(() => console.log("success vendor edit"));
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  };

  useEffect(() => {
    fetchApi()
    fetchProjectList();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // editVendor();
    handleProject(projectId);
  }


  return (
    <div id="add_projectmodal" className="modal custom-modal fade" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Project</h5>
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
              <div className="form-group">
                <label>
                  Project Name <span className="text-danger">*</span>
                </label>
                <select className="custom-select" name="project" 
                  onChange={(e) => {setProjectId(e.target.value)}}
                >
                  <option value="none">none</option>
                  { projectList.length && projectList.map((p) => (
                    <option value={p._id}>{p.name}</option>
                  )) }
                  
                </select>
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

export default AddProjectModal