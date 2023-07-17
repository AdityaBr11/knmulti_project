import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import 'react-summernote/dist/react-summernote.css'; // import styles
import '../../index.css';
import httpService from '../../../lib/httpService';
import { toast } from 'react-toastify';
import { CircularProgress, Paper, TableContainer } from '@mui/material';
import AddProjectModal from './popups/AddProjectModal';
import EditProjectModal from './popups/EditProjectModal';
import DeleteProjectModal from './popups/DeleteProjectModal';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import { createNotify } from '../../../features/notify/notifySlice';
import { useDispatch, useSelector } from 'react-redux';

const ProjectList = () => {

  const dispatch = useDispatch();

  const empObj = useSelector((state) => state?.authentication?.value?.user);

  const [projectList, setProjectList] = React.useState([]);
  const [projectsFromServer, setProjectsFromServer] = React.useState([]);
  const [projectToAdd, setProjectToAdd] = React.useState({});
  const [projectToEdit, setProjectToEdit] = React.useState({});
  const [projectNameToSearch, setProjectNameToSearch] = React.useState('');
  const [isLoading, setLoading] = React.useState(true);
  const [totalPlotArea, setTotalPlotArea] = useState(0);
  const [plotAreaUnderDiscussion, setPlotAreaUnderDiscussion] = useState(0);
  const [plotAreaInNegotiation, setPlotAreaInNegotiation] = useState(0);
  const [plotAreaLeadsWon, setPlotAreaLeadsWon] = useState(0);
  const [plotAreaSoldOut, setPlotAreaSoldOut] = useState(0);
  const [totalPlots, setTotalPlots] = useState(0);
  const [totalPlotsSoldOut, setTotalPlotsSoldOut] = useState(0);
  const [totalPlotsInDiscussion, setTotalPlotsInDiscussion] = useState(0);
  const [totalPlotsInNegotiation, setTotalPlotsInNegotiation] = useState(0);
  const [totalPlotsLeadsWon, setTotalPlotsLeadsWon] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);
  console.log(projectNameToSearch, "____projectNameToSearch");
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await httpService.get('/project');
      setProjectsFromServer(result.data);
      result.data.forEach((project) => {
        const totalArea = project.subPlots.reduce((a, b) => a + b.area, 0);
        const totalAreaSold = project.subPlots
          .filter((l) => l.sold)
          .reduce((a, b) => a + b.area, 0);
        const totalAreaInDiscussion = project.subPlots
          .filter(
            (p) =>
              !p.sold &&
              p.leadsInfo.some(
                (l) => l.leadType === 'Discussions' || l.leadType === 'New Lead'
              )
          )
          .reduce((a, b) => a + b.area, 0);
        const totalAreaInNegotiation = project.subPlots
          .filter(
            (p) =>
              !p.sold && p.leadsInfo.some((l) => l.leadType === 'Negotiations')
          )
          .reduce((a, b) => a + b.area, 0);
        const totalAreaLeadsWons = project.subPlots
          .filter(
            (p) => !p.sold && p.leadsInfo.some((l) => l.leadType === 'Lead Won')
          )
          .reduce((a, b) => a + b.area, 0);
        const totalPlots = project.subPlots.length;
        const totalPlotsSoldOut = project.subPlots.filter((l) => l.sold).length;
        const totalPlotsInDiscussion = project.subPlots.filter(
          (p) =>
            !p.sold &&
            p.leadsInfo.some(
              (l) => l.leadType === 'Discussions' || l.leadType === 'New Lead'
            )
        ).length;
        const totalPlotsInNegotiation = project.subPlots.filter(
          (p) =>
            !p.sold && p.leadsInfo.some((l) => l.leadType === 'Negotiations')
        ).length;
        const totalPlotsLeadsWons = project.subPlots.filter(
          (p) => !p.sold && p.leadsInfo.some((l) => l.leadType === 'Lead Won')
        ).length;
        setTotalPlotArea((d) => d + totalArea);
        setPlotAreaSoldOut((d) => d + totalAreaSold);
        setPlotAreaInNegotiation((d) => d + totalAreaInNegotiation);
        setPlotAreaLeadsWon((d) => d + totalAreaLeadsWons);
        setPlotAreaUnderDiscussion((d) => d + totalAreaInDiscussion);
        setTotalPlots((d) => d + totalPlots);
        setTotalPlotsSoldOut((d) => d + totalPlotsSoldOut);
        setTotalPlotsInDiscussion((d) => d + totalPlotsInDiscussion);
        setTotalPlotsInNegotiation((d) => d + totalPlotsInNegotiation);
        setTotalPlotsLeadsWon((d) => d + totalPlotsLeadsWons);
      });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const searchProject = async (e) => {
    e.preventDefault();
    const filteredProjects = projectsFromServer.filter((project) =>
      project.name.toLowerCase().includes(projectNameToSearch.toLowerCase())
    );
    setProjectList(filteredProjects);
  };

  useEffect(() => {
    if (!isLoading && projectNameToSearch) {
      const filteredProjects = projectsFromServer.filter((project) =>
        project.name.toLowerCase().includes(projectNameToSearch.toLowerCase())
      );
      setProjectList(filteredProjects);
    } else {
      setProjectList(projectsFromServer);
    }
  }, [isLoading, projectNameToSearch]);

  const addProjects = async () => {
    if (!projectToAdd.name) {
      toast.error("Select Project  Name");
      return;
    }
    if (!projectToAdd.startDate) {
      toast.error("Select Start Date");
      return;
    }
    if (!projectToAdd.type) {
      toast.error("Select Project Type");
      return;
    }
    if (!projectToAdd.type) {
      toast.error("Select Project Type");
      return;
    }

    toast.promise(
      new Promise((resolve, reject) => {
        httpService
          .post('/project', projectToAdd)
          .then((res) => {

            dispatch(createNotify({
              notifyHead: `New Project Added`,
              notifyBody: `Project ${res?.data?.name} is created`,
              createdBy: empObj?._id
            }));

            fetchData();
            document.querySelectorAll('.close')?.forEach((e) => e.click());
            resolve();
          })
          .catch((err) => {
            reject();
          });
      }),
      {
        error: 'Something went wrong!',
        success: 'Project added successfully!',
        pending: 'Adding project...',
      }
    );
  };

  const editProjects = async () => {
    toast.promise(
      new Promise((resolve, reject) => {
        httpService
          .put(`/project/${projectToEdit._id}`, projectToEdit)
          .then((res) => {
            fetchData();
            setProjectToEdit({});
            document.querySelectorAll('.close')?.forEach((e) => e.click());
            resolve();
          })
          .catch((err) => {
            console.log(err);
            reject();
          });
      }),
      {
        pending: 'Updating Project...',
        success: 'Project Updated Successfully',
        error: 'Something went wrong',
      }
    );
  };

  const deleteProject = async () => {
    toast.promise(
      new Promise((resolve, reject) => {
        httpService.delete(`/project/${projectToEdit._id}`).then((res) => {
          if (res.status < 400) {
            fetchData();
            document.querySelectorAll('.cancel-btn')?.forEach((e) => e.click());
            setProjectToEdit({});
            resolve();
          } else {
            reject();
          }
        });
      }),
      {
        pending: 'Deleting Project...',
        success: 'Project Deleted Successfully',
        error: 'Something went wrong',
      }
    );
  };

  const convertDate = (date) => {
    var newDate = new Date(date);
    var dateString =
      newDate.getDate() +
      '/' +
      (newDate.getMonth() + 1) +
      '/' +
      newDate.getFullYear();
    return dateString;
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Projects </title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      {isLoading && (
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
      )}
      {!isLoading && (
        <div className="content container-fluid">
          <div className="page-header">
            <div className="row align-items-center">
              <div className="col">
                <h3 className="page-title">Projects</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/app/main/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Projects</li>
                </ul>
              </div>
              <div className="col-auto float-right ml-auto">
                <a
                  href="#"
                  className="btn add-btn"
                  data-toggle="modal"
                  data-target="#create_project"
                >
                  <i className="fa fa-plus" /> Create Project
                </a>
              </div>
            </div>
          </div>

          {/* 
          <TableContainer
            sx={{
              marginBottom: '1rem',
            }}
            component={Paper}
          >
            <Table sx={{ minWidth: 1000 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      backgroundColor: '#BEC0BF',
                    }}
                    align="center"
                  ></TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: '#D5D5D5',
                      border: '1px solid #fff',
                      fontWeight: 700,
                      fontSize: '1.2rem',
                      color: '#0376BA',
                    }}
                    align="center"
                  >
                    AVAILABLE UNITS TO SELL
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: '#D5D5D5',
                      border: '1px solid #fff',
                      fontWeight: 700,
                      fontSize: '1.2rem',
                      color: '#0376BA',
                    }}
                    align="center"
                  >
                    UNITS SOLD
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      backgroundColor: '#BEC0BF',
                      padding: 0,
                    }}
                    scope="row"
                  >
                    <Table>
                      <TableBody>
                        <TableRow
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                        >
                          <TableCell
                            sx={{
                              fontWeight: 700,
                            }}
                          >
                            TOTAL AREA <br />
                            (SQFT)
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              textAlign: 'right',
                            }}
                          >
                            {totalPlotArea}
                          </TableCell>
                        </TableRow>
                        <TableRow
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                        >
                          <TableCell
                            sx={{
                              fontWeight: 700,
                            }}
                          >
                            TOTAL UNITS <br />
                            
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              textAlign: 'right',
                            }}
                          >
                            {totalPlots}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableCell>
                  <TableCell
                    sx={{
                      padding: 0,
                    }}
                    scope="row"
                  >
                    <Table style={{}}>
                      <TableBody>
                        <TableRow
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                        >
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              backgroundColor: '#FFD932',
                            }}
                          >
                            DISCUSSION <br />
                            AREA
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              backgroundColor: '#FFD932',
                              textAlign: 'right',
                            }}
                          >
                            {plotAreaUnderDiscussion}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              backgroundColor: '#F27200',
                              color: '#fff',
                            }}
                          >
                            NEGOTIATION <br />
                            AREA
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              backgroundColor: '#F27200',
                              color: '#fff',
                              textAlign: 'right',
                            }}
                          >
                            {plotAreaInNegotiation}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              backgroundColor: '#00A2FF',
                              color: '#fff',
                            }}
                          >
                            LEADS WON <br />
                            AREA{' '}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              backgroundColor: '#00A2FF',
                              color: '#fff',
                              textAlign: 'right',
                            }}
                          >
                            {plotAreaLeadsWon}
                          </TableCell>
                        </TableRow>
                        <TableRow
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                        >
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              backgroundColor: '#FFD932',
                            }}
                          >
                            DISCUSSION <br />
                            UNITS
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              backgroundColor: '#FFD932',
                              textAlign: 'right',
                            }}
                          >
                            {totalPlotsInDiscussion}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              backgroundColor: '#F27200',
                              color: '#fff',
                            }}
                          >
                            NEGOTIATION <br />
                            UNITS
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              backgroundColor: '#F27200',
                              color: '#fff',
                              textAlign: 'right',
                            }}
                          >
                            {totalPlotsInNegotiation}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              backgroundColor: '#00A2FF',
                              color: '#fff',
                            }}
                          >
                            LEADS WON <br />
                            UNITS{' '}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              backgroundColor: '#00A2FF',
                              color: '#fff',
                              textAlign: 'right',
                            }}
                          >
                            {totalPlotsLeadsWon}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableCell>
                  <TableCell
                    style={{
                      padding: 0,
                    }}
                    scope="row"
                  >
                    <Table
                      sx={{
                        height: '144px',
                      }}
                    >
                      <TableBody>
                        <TableRow
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                        >
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              backgroundColor: '#61D836',
                              color: '#fff',
                            }}
                          >
                            SOLD AREA
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              backgroundColor: '#61D836',
                              color: '#fff',
                              textAlign: 'right',
                            }}
                          >
                            {plotAreaSoldOut}
                          </TableCell>
                        </TableRow>

                        <TableRow
                          sx={{
                            '&:last-child td, &:last-child th': {
                              border: 0,
                            },
                          }}
                        >
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              backgroundColor: '#61D836',
                              color: '#fff',
                            }}
                          >
                            SOLD UNITS
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: 700,
                              backgroundColor: '#61D836',
                              color: '#fff',
                              textAlign: 'right',
                            }}
                          >
                            {totalPlotsSoldOut}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer> */}


          <div className="row filter-row">
            <div className="col-9">
              <div className="form-group form-focus focused">
                <input
                  onChange={(e) => {
                    setProjectNameToSearch(e.target.value);
                  }}
                  type="text"
                  required
                  placeholder="Project Name"
                  style={{
                    padding: '10px',
                  }}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <a
                href="#"
                onClick={searchProject}
                className="btn btn-success btn-block"
              >
                {' '}
                Search{' '}
              </a>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <table className="table table-striped custom-table datatable">
                  <thead>
                    <tr>
                      <th
                        style={{
                          width: '25%',
                        }}
                      >
                        Project
                      </th>
                      <th
                        style={{
                          width: '25%',
                        }}
                      >
                        Project Type
                      </th>
                      <th
                        style={{
                          width: '25%',
                        }}
                      >
                        Sub Type
                      </th>
                      <th
                        style={{
                          width: '25%',
                        }}
                      >
                        Start Date
                      </th>
                      <th
                        style={{
                          width: '25%',
                        }}
                      >
                        Status
                      </th>
                      {/* <th
                        style={{
                          width: '25%',
                        }}
                      >
                        Leads
                      </th> */}
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectList &&
                      projectList.map((project) => (
                        <tr key={project?._id}>
                          <td>
                            <Link
                              to={`/app/projects/projects-view/${project?._id}`}
                            >
                              {project.name}
                            </Link>
                          </td>
                          <td>{project && project?.type}</td>
                          <td>{project && project?.subtype}</td>

                          <td>{convertDate(project?.startDate)} </td>
                          <td><span className={project?.saleStatus?.toUpperCase() == "LIVE" ? 'badge bg-inverse-success' : 'badge bg-inverse-danger'}>{project?.saleStatus?.toUpperCase()}</span></td>

                          {/* <td>
                            <div className="action-label">
                              <Link
                                to={`/app/employees/leads?projectId=${project._id}`}
                              >
                                {
                                  project.leads?.filter(
                                    (lead) =>
                                      lead.status !== 'Lead Won' &&
                                      lead.status !== 'Lead Lost'
                                  ).length
                                }{' '}
                                Leads
                              </Link>
                            </div>
                          </td> */}
                          <td className="text-right">
                            <div className="dropdown dropdown-action">
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
                                  data-target="#edit_project"
                                  onClick={() => setProjectToEdit(project)}
                                >
                                  <i className="fa fa-pencil m-r-5" /> Edit
                                </a>
                                <a
                                  className="dropdown-item"
                                  href="#"
                                  data-toggle="modal"
                                  data-target="#delete_project"
                                  onClick={() => setProjectToEdit(project)}
                                >
                                  <i className="fa fa-trash-o m-r-5" /> Delete
                                </a>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {!projectList.length && (
                  <div
                    style={{
                      width: '100%',
                      height: '300px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <h3>No Projects</h3>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <AddProjectModal
        onSubmit={addProjects}
        setProjectToAdd={setProjectToAdd}
      />
      <EditProjectModal
        onSubmit={editProjects}
        setProjectToEdit={setProjectToEdit}
        projectToEdit={projectToEdit}
      />
      <DeleteProjectModal onSubmit={deleteProject} />
    </div>
  );
};

export default ProjectList;
