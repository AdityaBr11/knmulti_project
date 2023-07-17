import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';
import { Table } from 'antd';
import 'antd/dist/antd.css';
import { itemRender, onShowSizeChange } from '../paginationfunction';
import '../antdstyle.css';
import httpService from '../../lib/httpService';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { set } from 'lodash';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Leads = () => {
  const [data, setData] = useState([]);
  const [dataToDisplay, setDataToDisplay] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [leadToAdd, setLeadToAdd] = useState({});
  const [leadW, setLeadW] = useState(0);
  const [leadL, setLeadL] = useState(0);
  const [nLead, setNLead] = useState(0);
  const [projects, setProjects] = useState([]);
  let query = useQuery();
  const user = useSelector(state => state.authentication.value.user);
  const [projectId, setProjectId] = useState(
    query.get('projectId') ? query.get('projectId') : ''
  );

  useEffect(() => {
    if (user) {
      fetchLeads();
      fetchProjects();
    }
  }, []);

  const fetchLeads = async () => {
    setIsLoading(true);
    if (user?.jobRole?.name === 'Admin') {
      const leads = await httpService.get('/lead');
      // leads.data.splice(0, 3);
      setData(leads.data);
      // setDataToDisplay(leads.data.filter((v, i) => v.status?.name !== 'Lead Won' && v.status?.name !== 'Lead Lost'));
      setDataToDisplay(leads.data)
      setIsLoading(false);
    } else {
      const leads = await httpService.get(`/lead/employee/${user?._id}`)
      console.log(leads, "leadsleadsleads");
      setData(leads.data);
      setDataToDisplay(leads.data.filter((v, i) => v.status?.name !== 'Lead Won' && v.status?.name !== 'Lead Lost'));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const won = data.filter((v, i) => v.status?.name === 'Lead Won')
    const lost = data.filter((v, i) => v.status?.name === 'Lead Lost')
    const n = data.filter((v, i) => v.status?.name !== 'Lead Won' && v.status?.name !== 'Lead Lost')
    setLeadW(won.length);
    setLeadL(lost.length);
    setNLead(n.length);
  }, [data])

  const fetchProjects = async () => {
    const projects = await httpService.get('/project');
    setProjects(projects.data);
  };

  const filterLeadName = (e) => {
    if (e.target.value === null) {
      setDataToDisplay(data.filter((v, i) => v.status?.name !== 'Lead Won' && v.status?.name !== 'Lead Lost'));
    } else {
      const newData = data.filter((v, i) => v.name.toLowerCase().includes(e.target.value.toLowerCase()));
      setDataToDisplay(newData);
    }
  }

  const filterLead = (e) => {
    if (e.target.value === null) {
      setDataToDisplay(data.filter((v, i) => v.status?.name !== 'Lead Won' && v.status?.name !== 'Lead Lost'));
    } else {
      const newData = data.filter((v, i) => v.lead.toLowerCase().includes(e.target.value.toLowerCase()));
      setDataToDisplay(newData);
    }
  }

  const filterStaff = (e) => {
    if (e.target.value === null) {
      setDataToDisplay(data.filter((v, i) => v.status?.name !== 'Lead Won' && v.status?.name !== 'Lead Lost'));
    } else {
      const newData = data.filter((v, i) => (v.currentAssigned.firstName.toLowerCase().includes(e.target.value.toLowerCase())
        || v.currentAssigned.lastName.toLowerCase().includes(e.target.value.toLowerCase())));
      setDataToDisplay(newData);
    }
  }

  const columns = [
    {
      title: 'Lead#',
      // dataIndex: 'lead',
      dataIndex: 'name',
      render: (text, record) => (
        <h2 className="table-avatar">
          <Link
            to={`/app/profile/lead-profile/${record?._id}`}
            className="avatar"
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                background: '#E33F3B',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '1.2rem',
                color: '#fff',
              }}
            >
              {text?.substr(0, 1)}
              {/* {record?.lead?.split('-')[0].charAt(0)} */}
            </div>
          </Link>
          <Link to={`/app/profile/lead-profile/${record?._id}`}>{text}</Link>
        </h2>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email.length - b.email.length,
    },

    {
      title: 'Mobile',
      dataIndex: 'phone',
      sorter: (a, b) => a.mobile.length - b.mobile.length,
    },

    {
      title: 'Current Project',
      dataIndex: 'project',
      render: (text, record) =>
      (
        <Link to={`/app/projects/projects-view/${record?.project[record?.project?.length - 1]?._id}`}>
          {record?.project[record?.project?.length - 1]?.name}
        </Link>
      ),

      sorter: (a, b) => a.project.length - b.project.length,
    },

    {
      title: 'Assigned Staff',
      dataIndex: 'currentAssigned',
      render: (text, record) => (
        <div
        >
          {record?.currentAssigned?.firstName ? <>
            <Link
              to={{ pathname: `/app/profile/employee-profile/${record?.currentAssigned?._id}` }}
            >
              <p>{`${record?.currentAssigned?.firstName} ${record?.currentAssigned?.lastName}`}</p>
            </Link>
          </> : 'Not Assigned'}
        </div>
      )
    },
    {
      title: 'Action',
      render: (text, record) => (
        <div>

          <Link className="dropdown-item" to={{
            pathname: `/app/leads/add-leads`,
            state: {
              ...record,
              edit: true
            },
          }}>
            <i className="fa fa-pencil m-r-5" />
          </Link>

          {/* <div className="dropdown dropdown-action text-right">
            <a
              href="#"
              className="action-icon dropdown-toggle"
              data-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="material-icons">more_vert</i>
            </a>
            <div className="dropdown-menu dropdown-menu-right">
              <Link className="dropdown-item" to={{
                pathname: `/app/leads/add-leads`,
                state: {
                  ...record,
                  edit: true
                },
              }}>
                <i className="fa fa-pencil m-r-5" /> Edit
              </Link>
            </div>
          </div> */}
        </div>
      ),
    },
  ];
  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Leads </title>
        <meta name="description" content="Login page" />
      </Helmet>
      {isLoading ? (
        <div
          style={{
            height: '90vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          className="content container-fluid"
        >
          <CircularProgress />
        </div>
      ) : (
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              {/* jin - changed col-sm-12 to col-sm-8  */}
              <div className="col-sm-8">
                <h3 className="page-title">Leads</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/app/main/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Leads</li>
                </ul>
              </div>
              <div className="col-auto float-right ml-auto">
                <Link
                  to='/app/leads/add-leads'
                  className="btn add-btn"
                >
                  <i className="fa fa-plus" /> Add Lead
                </Link>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3">
              <div className="stats-info">
                <h6>Total Leads</h6>
                <h4>
                  {data?.length}
                </h4>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stats-info">
                <h6>Leads Won</h6>
                <h4>
                  {leadW}
                </h4>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stats-info">
                <h6>Leads Lost</h6>
                <h4>
                  {leadL}
                </h4>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stats-info">
                <h6>Active Leads</h6>
                <h4>
                  {nLead}
                </h4>
              </div>
            </div>
          </div>
          <div className="row filter-row">
            <div className="col-sm-6 col-md-3">
              <div className="form-group form-focus focused">
                <div>
                  <input
                    placeholder="Lead Name"
                    className="form-control floating"
                    type="text"
                    onChange={(e) => filterLeadName(e)}
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="form-group form-focus focused">
                <div>
                  <input
                    placeholder="Lead#"
                    className="form-control floating"
                    type="text"
                    onChange={(e) => filterLead(e)}
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="form-group form-focus focused">
                <div>
                  <input
                    placeholder="Staff Assigned#"
                    className="form-control floating"
                    type="text"
                    onChange={(e) => filterStaff(e)}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <Table
                  className="table-striped"
                  pagination={{
                    total: dataToDisplay.length,
                    showTotal: (total, range) =>
                      `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                    showSizeChanger: true,
                    onShowSizeChange: onShowSizeChange,
                    itemRender: itemRender,
                  }}
                  style={{ overflowX: 'auto' }}
                  columns={columns}
                  // bordered
                  dataSource={dataToDisplay.filter((lead) => {
                    if (projectId) {
                      return lead.project.some((p) =>
                        p._id.includes(projectId)
                      );
                    }
                    return lead;
                  })}
                  rowKey={(record) => record.id}
                  onChange={console.log('change value')}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* <div id="add_lead" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-lg">
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
                  await handleAddLead();
                  e.target.reset();
                }}
              >
                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      <label className="col-form-label">
                        Name <span className="text-danger">*</span>
                      </label>
                      <input
                        onChange={(e) => {
                          setLeadToAdd({
                            ...leadToAdd,
                            name: e.target.value,
                          });
                        }}
                        className="form-control"
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        onChange={(e) => {
                          setLeadToAdd({
                            ...leadToAdd,
                            email: e.target.value,
                          });
                        }}
                        className="form-control"
                        type="email"
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="col-form-label">
                        Phone <span className="text-danger">*</span>
                      </label>
                      <input
                        onChange={(e) => {
                          setLeadToAdd({
                            ...leadToAdd,
                            phone: e.target.value,
                          });
                        }}
                        className="form-control"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                      <label>Address</label>
                      <textarea
                        onChange={(e) => {
                          setLeadToAdd({
                            ...leadToAdd,
                            address: e.target.value,
                          });
                        }}
                        defaultValue={''}
                        className="form-control"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn" type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Leads;
