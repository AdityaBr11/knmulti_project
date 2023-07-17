import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar_28, Avatar_13 } from '../../Entryfile/imagepath';
import httpService from '../../lib/httpService';

const Clients = () => {
  const [leads, setLeads] = useState([]);
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [leadToAdd, setLeadToAdd] = useState({});
  const [leadToEdit, setLeadToEdit] = useState({});
  const userID = useSelector((state) => state.authentication.value.user?._id);
  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }
    fetchProjects();
    fetchEmployees();
    fetchLeads();
  }, []);

  const fetchProjects = async () => {
    const projects = await httpService.get('/project');
    setProjects(projects.data);
  };

  const fetchEmployees = async () => {
    const employees = await httpService.get('/employee');
    setEmployees(employees.data);
  };

  const fetchLeads = async () => {
    const leads = await httpService.get('/lead');
    console.log(leads);
    setLeads(leads.data);
  };

  const addLead = async () => {
    console.log('here');
    await httpService.post('/lead', {
      ...leadToAdd,
      createdBy: userID,
    });
    setLeadToAdd({});
    fetchLeads();
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  };

  const editLead = async () => {
    await httpService.put(`/lead/${leadToEdit._id}`, leadToEdit);
    setLeadToEdit({});
    fetchLeads();
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  };

  const deleteLead = async () => {
    await httpService.delete(`/lead/${leadToEdit._id}`);
    setLeadToEdit({});
    fetchLeads();
    document.querySelectorAll('.cancel-btn')?.forEach((e) => e.click());
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Clients </title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Leads</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Project</Link>
                </li>
                <li className="breadcrumb-item active">Leads</li>
              </ul>
            </div>
            <div className="col-auto float-right ml-auto">
              <a
                href="#"
                className="btn add-btn"
                data-toggle="modal"
                data-target="#add_client"
              >
                <i className="fa fa-plus" /> Add Lead
              </a>
              <div className="view-icons">
                <Link
                  to="/app/employees/clients"
                  className="grid-view btn btn-link active"
                >
                  <i className="fa fa-th" />
                </Link>
                <Link
                  to="/app/employees/clients-list"
                  className="list-view btn btn-link"
                >
                  <i className="fa fa-bars" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        {/* Search Filter */}
        <div className="row filter-row">
          <div className="col-sm-4">
            <div className="form-group form-focus focused">
              <input type="text" className="form-control floating" />
              <label className="focus-label">Client Name</label>
            </div>
          </div>
          <div className="col-sm-5">
            <div className="form-group form-focus select-focus">
              <select className="select floating">
                <option value={''}>Select Project</option>
                {projects.map((project) => (
                  <option key={project._id}>{project.name}</option>
                ))}
              </select>
              <label className="focus-label">Project</label>
            </div>
          </div>
          <div className="col-md-3">
            <a href="#" className="btn btn-success btn-block">
              {' '}
              Search{' '}
            </a>
          </div>
        </div>
        {/* Search Filter */}
        <div className="row staff-grid-row">
          {leads.map((lead, i) => (
            <div key={i} className="col-md-4 col-sm-6 col-12 col-lg-4 col-xl-3">
              <div className="profile-widget">
                <div className="dropdown profile-action">
                  <a
                    href="#"
                    className="action-icon dropdown-toggle"
                    data-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="material-icons">more_vert</i>
                  </a>
                  <div className="dropdown-menu dropdown-menu-right">
                    <a
                      className="dropdown-item"
                      href="#"
                      data-toggle="modal"
                      data-target="#edit_client"
                      onClick={() => setLeadToEdit(lead)}
                    >
                      <i className="fa fa-pencil m-r-5" /> Edit
                    </a>
                    <a
                      className="dropdown-item"
                      href="#"
                      data-toggle="modal"
                      data-target="#delete_client"
                      onClick={() => setLeadToEdit(lead)}
                    >
                      <i className="fa fa-trash-o m-r-5" /> Delete
                    </a>
                  </div>
                </div>
                <h4
                  style={{
                    textAlign: 'left',
                  }}
                  className="user-name m-t-10 mb-0 text-ellipsis"
                >
                  {lead.name}
                </h4>
                <div
                  style={{
                    textAlign: 'left',
                  }}
                  className="small text-muted m-t-5"
                >
                  {lead.description}
                </div>
                <div
                  style={{
                    textAlign: 'left',
                  }}
                  className="text-muted m-t-5"
                >
                  Assigned to{' '}
                  <img
                    style={{
                      width: '14px',
                      borderRadius: '50%',
                    }}
                    src={Avatar_13}
                  ></img>{' '}
                  {lead.employee.firstName + ' ' + lead.employee.lastName}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* /Page Content */}
      {/* Add Client Modal */}
      <div id="add_client" className="modal custom-modal fade" role="dialog">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Lead</h5>
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
                  await addLead();
                  e.target.resetForm();
                }}
              >
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Name <span className="text-danger">*</span>
                      </label>
                      <input
                        onChange={(e) => {
                          setLeadToAdd((d) => ({ ...d, name: e.target.value }));
                        }}
                        className="form-control"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="col-form-label">Phone</label>
                      <input
                        onChange={(e) => {
                          setLeadToAdd((d) => ({
                            ...d,
                            phone: e.target.value,
                          }));
                        }}
                        className="form-control"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Project <span className="text-danger">*</span>
                      </label>
                      <select
                        onChange={(e) => {
                          setLeadToAdd((d) => ({
                            ...d,
                            project: e.target.value,
                          }));
                        }}
                        className="custom-select"
                      >
                        <option>Select Project</option>
                        {projects.map((project) => (
                          <option key={project._id} value={project._id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Employee <span className="text-danger">*</span>
                      </label>
                      <select
                        onChange={(e) => {
                          setLeadToAdd((d) => ({
                            ...d,
                            employee: e.target.value,
                          }));
                        }}
                        className="custom-select"
                      >
                        <option>Select Employee</option>
                        {employees.map((employee) => (
                          <option key={employee._id} value={employee._id}>
                            {employee.firstName + ' ' + employee.lastName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        onChange={(e) => {
                          setLeadToAdd((d) => ({
                            ...d,
                            email: e.target.value,
                          }));
                        }}
                        className="form-control floating"
                        type="email"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Address <span className="text-danger">*</span>
                      </label>
                      <input
                        onChange={(e) => {
                          setLeadToAdd((d) => ({
                            ...d,
                            address: e.target.value,
                          }));
                        }}
                        className="form-control floating"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label className="col-form-label">
                        Description <span className="text-danger">*</span>
                      </label>
                      <textarea
                        rows={4}
                        className="form-control"
                        placeholder="Description"
                        onChange={(e) => {
                          setLeadToAdd((d) => ({
                            ...d,
                            description: e.target.value,
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Client Modal */}
      {/* Edit Client Modal */}
      <div id="edit_client" className="modal custom-modal fade" role="dialog">
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Lead</h5>
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
                onSubmit={(e) => {
                  e.preventDefault();
                  editLead();
                }}
              >
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Name <span className="text-danger">*</span>
                      </label>
                      <input
                        defaultValue={leadToEdit.name}
                        onChange={(e) => {
                          setLeadToEdit((d) => ({
                            ...d,
                            name: e.target.value,
                          }));
                        }}
                        className="form-control"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="col-form-label">Phone</label>
                      <input
                        defaultValue={leadToEdit.phone}
                        onChange={(e) => {
                          setLeadToEdit((d) => ({
                            ...d,
                            phone: e.target.value,
                          }));
                        }}
                        className="form-control"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Project <span className="text-danger">*</span>
                      </label>
                      <select
                        value={leadToEdit.project?._id}
                        onChange={(e) => {
                          setLeadToEdit((d) => ({
                            ...d,
                            project: e.target.value,
                          }));
                        }}
                        className="custom-select"
                      >
                        <option>Select Project</option>
                        {projects.map((project) => (
                          <option key={project._id} value={project._id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Employee <span className="text-danger">*</span>
                      </label>
                      <select
                        value={leadToEdit.employee?._id}
                        onChange={(e) => {
                          setLeadToEdit((d) => ({
                            ...d,
                            employee: e.target.value,
                          }));
                        }}
                        className="custom-select"
                      >
                        <option>Select Employee</option>
                        {employees.map((employee) => (
                          <option key={employee._id} value={employee._id}>
                            {employee.firstName + ' ' + employee.lastName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        defaultValue={leadToEdit.email}
                        onChange={(e) => {
                          setLeadToEdit((d) => ({
                            ...d,
                            email: e.target.value,
                          }));
                        }}
                        className="form-control floating"
                        type="email"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Address <span className="text-danger">*</span>
                      </label>
                      <input
                        defaultValue={leadToEdit.dddress}
                        onChange={(e) => {
                          setLeadToEdit((d) => ({
                            ...d,
                            address: e.target.value,
                          }));
                        }}
                        className="form-control floating"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label className="col-form-label">
                        Description <span className="text-danger">*</span>
                      </label>
                      <textarea
                        rows={4}
                        className="form-control"
                        placeholder="Description"
                        defaultValue={leadToEdit.description}
                        onChange={(e) => {
                          setLeadToEdit((d) => ({
                            ...d,
                            description: e.target.value,
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit Client Modal */}
      {/* Delete Client Modal */}
      <div className="modal custom-modal fade" id="delete_client" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete Client</h3>
                <p>Are you sure want to delete?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <a
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        deleteLead();
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
      {/* /Delete Client Modal */}
    </div>
  );
};

export default Clients;
