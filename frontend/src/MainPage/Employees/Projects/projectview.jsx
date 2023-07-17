import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useHistory, useParams } from 'react-router-dom';
import httpService from '../../../lib/httpService';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';
import { Backdrop, Paper, TableContainer } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import Swal from 'sweetalert2';
import PlotsTable from './plotsTable';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import EditProjectModal from './popups/EditProjectModal';
import AddStocks from './popups/AddStocks';
import { Delete, Edit } from '@material-ui/icons';
import AddConsumeStk from './AddConsumeStk';
import TransferStk from './TransferStk';
import AddPlotTable from './AddPlotTable';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
];

const InactiveTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 250,
  },
});

const InProspectTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 250,
    background: '#ffa500',
    color: '#fff',
  },
});

const InSiteVisitTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 250,
    background: '#ff8500',
    color: '#fff',
  },
});

const InDisscussionTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 250,
    background: '#FEF600',
    color: '#fff',
  },
});

const InNegotiationTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 250,
    background: '#89CFF0',
    color: '#fff',
  },
});

const LeadsWontTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 250,
    background: '#9A66CB',
    color: '#fff',
  },
});

const SoldOutTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 250,
    background: '#4CBB17',
    color: '#fff',
  },
});

const BookingTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 250,
    background: '#00ffdd',
    color: '#fff',
  },
});

const RegistrationTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 250,
    background: '#ffb0dd',
    color: '#fff',
  },
});

const UnderRegistrationTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 250,
    background: '#112ac6',
    color: '#fff',
  },
});

const legends = [
  {
    name: 'Inactive',
    color: '#EF473A',
  },
  {
    name: 'Prospect11',
    color: '#ffa500',
  },
  {
    name: 'Site Visit',
    color: '#ff8500',
  },
  {
    name: 'Discussion',
    color: '#FEF600',
  },
  {
    name: 'Negotiation',
    color: '#89CFF0',
  },
  {
    name: 'Won',
    color: '#4CBB17',
  },
  {
    name: 'Booking',
    color: '#00ffdd',
  },
  {
    name: 'Under Registration',
    color: '#112ac6',
  },
  {
    name: 'Registration',
    color: '#ffb0dd',
  },
];

const ProjectView = () => {
  const { id } = useParams();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [projectDetails, setProjectDetails] = useState({});
  const [projectToEdit, setProjectToEdit] = useState({});
  const layoutImageRef = useRef(null);
  const imgRef = useRef(null);
  const [plotInfoBackdrop, setPlotInfoBackdrop] = useState(false);
  const [plotInfo, setPlotInfo] = useState({});
  const [activeInfoTab, setActiveInfoTab] = useState(2);
  const [selectePlotId, setSelectedPlotId] = useState('');
  const [selectedPath, setSelectedPath] = useState('');
  const [customerPurchases, setCustomerPurchases] = useState([]);
  const [selectedCoordinates, setSelectedCoordinates] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [updatedPaths, setUpdatedPaths] = useState(false);
  const [imageReady, setImageReady] = useState(false);
  const [markers, setMarkers] = useState([]);
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
  const [projectLeads, setProjectLeads] = useState([]);
  const [projectLeadsWon, setProjectLeadsWon] = useState([]);
  const [projectLeadsLost, setProjectLeadsLost] = useState([]);

  const [rerender, setRerender] = useState(false);

  const [sptstkId, setsptstkId] = useState("");

  const [allStock, setAllStock] = useState([]);

  const [tStk, settStk] = useState([]);

  // Stocks 
  const [stocks, setStocks] = useState({
    itemName: "",
    reqQuantity: 0,
    spentFor: "",
    leftQuantity: 0,
    totalQuantity: 0,
    vendorId: undefined
  });

  const [editStock, setEditStock] = useState(false);
  // const fetchStocks = async () => {
  //   const res = await httpService.get(`/stock/splitStock?projectId=${id}`);
  //   setAllStock([ ...res.data ]);
  // }
  const fetchStocks = async () => {
    const res = await httpService.get(`/stock?projectId=${id}`);
    setAllStock([...res.data]);
    setsptstkId("");
  }

  console.log(sptstkId);

  const [vendorList, setVendorList] = useState([]);

  const handleStocks = (e) => {
    setStocks({ ...stocks, [e.target.name]: e.target.value });
  }

  const [qItem, setqItem] = useState("");
  const [qVendor, setqVendor] = useState("");
  const [qProject, setqProject] = useState("");

  function searchStock(data) {

    return data
      .filter(row => row.itemDetails.toLowerCase().indexOf(qItem) > -1)
      .filter(r => r.vendorId?.name.toLowerCase().indexOf(qVendor) > -1)
      .filter(c => c.projectId?.name.toLowerCase().indexOf(qProject) > -1);
  }

  // console.log({ plotInfo })

  const handleStockSubmit = async (e) => {
    e.preventDefault();
    console.log(stocks);
    if (editStock) {
      const res = await httpService.put(`/stock/${stocks?._id}`, stocks);
      setEditStock(!editStock);
      setStocks({
        itemName: "",
        reqQuantity: 0,
        spentFor: "",
        leftQuantity: 0,
        totalQuantity: 0,
        vendorId: undefined
      })
    } else {
      const res = await httpService.post('/stock', stocks);
    }
    await fetchStocks();
    setEditStock(false);
    setStocks({
      itemName: "",
      reqQuantity: 0,
      spentFor: "",
      leftQuantity: 0,
      totalQuantity: 0,
      vendorId: undefined
    })
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

  const handleStockDelete = async (id) => {
    const res = await httpService.delete(`/stock/${id}`);
    await fetchStocks();
  }

  const fetchTransferStock = async () => {
    const res = await httpService.get(`/stock/transtock?projectFrom=${id}`);
    settStk([...res.data]);
    fetchStocks();
  }

  const fetchVendors = async () => {
    const res = await httpService.get('/vendor');
    setVendorList(res.data);
  }

  useEffect(() => {
    fetchProjectDetails();
    fetchVendors();
    fetchStocks();
    fetchTransferStock();
  }, [rerender]);

  useEffect(() => {
    if (activeInfoTab === 1 && selectePlotId) {
      document
        .querySelector(`#plot-info #${selectePlotId}`)
        ?.classList.add('selected');
    }
  }, [activeInfoTab, selectePlotId]);

  const updateProjectPaths = async () => {
    await toast
      .promise(
        httpService.post(`/project/${projectDetails._id}/subPlots`, {
          subPlots: projectDetails.subPlots,
        }),
        {
          error: 'Something went wrong',
          success: 'Layout deatils updated successfully',
          pending: 'Updating Layout Deatils',
        }
      )
      .then(() => {
        setRerender(!rerender);
      });
    setUpdatedPaths(false);
  };

  useEffect(() => {
    if (selectedPath) {
      document.querySelector(`.selected`)?.classList.remove('selected');
      document.querySelector(`#${selectedPath}`)?.classList.add('selected');
    }
  }, [selectedPath]);

  const fetchProjectDetails = async () => {
    if (!id) {
      history.goBack();
    }
    const res = await httpService.get(`/project/${id}`);
    console.log(res.data);
    setProjectDetails(res.data);
    setProjectToEdit(res.data);
    if (
      res?.data?.subPlots.some((p) => !p.component) ||
      res?.data?.subPlots.length === 0
    ) {
      setUpdatedPaths(true);
    }
    res?.data?.subPlots
      .filter((l) => l?.sold)
      .map((land) => land?.soldTo)
      .forEach((c) => {
        setCustomerPurchases((p) => {
          const temp = p;
          if (!temp.some((p) => p?._id === c?._id)) {
            temp.push(c);
          }
          return temp;
        });
      });

    const totalArea = res?.data?.subPlots.reduce((a, b) => a + b.area, 0);
    const totalAreaSold = res?.data?.subPlots
      .filter((l) => l.sold)
      .reduce((a, b) => a + b.area, 0);
    const totalAreaInDiscussion = res?.data?.subPlots
      .filter(
        (p) =>
          !p.sold &&
          p.leadsInfo.some(
            (l) => l.leadType === 'Discussion' || l.leadType === 'New Lead'
          )
      )
      .reduce((a, b) => a + b.area, 0);
    const totalAreaInNegotiation = res?.data?.subPlots
      .filter(
        (p) => !p.sold && p.leadsInfo.some((l) => l.leadType === 'Negotiations')
      )
      .reduce((a, b) => a + b.area, 0);
    const totalAreaLeadsWons = res?.data?.subPlots
      .filter(
        (p) => !p.sold && p.leadsInfo.some((l) => l.leadType === 'Won')
      )
      .reduce((a, b) => a + b.area, 0);
    const totalPlots = res?.data?.subPlots.length;
    const totalPlotsSoldOut = res?.data?.subPlots.filter((l) => l.sold).length;
    const totalPlotsInDiscussion = res?.data?.subPlots.filter(
      (p) =>
        !p.sold &&
        p.leadsInfo.some(
          (l) => l.leadType === 'Discussion' || l.leadType === 'New Lead'
        )
    ).length;
    const totalPlotsInNegotiation = res?.data?.subPlots.filter(
      (p) => !p.sold && p.leadsInfo.some((l) => l.leadType === 'Negotiations')
    ).length;
    const totalPlotsLeadsWons = res?.data?.subPlots.filter(
      (p) => !p.sold && p.leadsInfo.some((l) => l.leadType === 'Won')
    ).length;
    res?.data?.subPlots.forEach((p) => {
      // console.log(p.name);
      p.leadsInfo.forEach((l) => {
        if (l.leadType === 'Won') {
          setProjectLeadsWon((d) => [
            ...d,
            {
              lead: l?.lead,
              customer: l?.customer,
              isCustomer: l?.isCustomer,
              leadType: l.leadType,
              plotName: p.name,
            },
          ]);
        } else if (l.leadType === 'Lost') {
          setProjectLeadsLost((d) => [
            ...d,
            {
              lead: l.lead,
              customer: l?.customer,
              isCustomer: l?.isCustomer,
              leadType: l.leadType,
              plotName: p.name,
            },
          ]);
        }
      });
    });
    setTotalPlotArea(totalArea);
    setPlotAreaSoldOut(totalAreaSold);
    setPlotAreaInNegotiation(totalAreaInNegotiation);
    setPlotAreaLeadsWon(totalAreaLeadsWons);
    setPlotAreaUnderDiscussion(totalAreaInDiscussion);
    setTotalPlots(totalPlots);
    setTotalPlotsSoldOut(totalPlotsSoldOut);
    setTotalPlotsInDiscussion(totalPlotsInDiscussion);
    setTotalPlotsInNegotiation(totalPlotsInNegotiation);
    setTotalPlotsLeadsWon(totalPlotsLeadsWons);
    setIsLoading(false);
  };

  useEffect(() => {
    console.log(projectLeadsWon);
  }, [projectLeadsWon?.length]);

  const editProject = async () => {
    await httpService.put(`/project/${projectToEdit._id}`, projectToEdit);
    fetchProjectDetails();
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  };

  const handleSubPlotFile = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('layout', file);
    toast
      .promise(
        httpService
          .post(`/project/${projectDetails._id}/landDivision/csv`, formData)
          .catch(() => {
            toast.error('Something went wrong');
          }),
        {
          error: 'Something went wrong',
          success: 'Plot deatils updated successfully',
          pending: 'Updating Plot Deatils',
        }
      )
      .then(() => {
        fetchProjectDetails();
      });
  };

  console.log({ customerPurchases });

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
          {/* Page Header */}
          <div
            className="page-header"
            style={{
              marginBottom: '1rem',
            }}
          >
            <div className="row align-items-center">
              <div className="col">
                <h3 className="page-title">{projectDetails?.name} <span className={'badge bg-inverse-info'}>{projectDetails?.type} / {projectDetails?.subtype}</span></h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/app/main/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Project</li>
                </ul>
              </div>
              <div className="col-auto float-right ml-auto">
                <a
                  href="#"
                  className="btn add-btn"
                  data-toggle="modal"
                  data-target="#edit_project"
                >
                  <i className="fa fa-plus" /> Edit Project
                </a>
              </div>
            </div>
          </div>
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
                    AVAILABLE {projectDetails?.subtype?.toUpperCase()} TO SELL
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
                    {projectDetails?.subtype?.toUpperCase()} SOLD
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
                            TOTAL {projectDetails?.subtype?.toUpperCase()} <br />
                            (UNITS)
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
                            {projectDetails?.subtype?.toUpperCase()}
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
                            {projectDetails?.subtype?.toUpperCase()}
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
                            {projectDetails?.subtype?.toUpperCase()}{' '}
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
                            SOLD {projectDetails?.subtype?.toUpperCase()}
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
          </TableContainer>
          {/* /Page Header */}
          <div className="card tab-box">
            <div className="row user-tabs">
              <div className="col-lg-12 col-md-12 col-sm-12 line-tabs">
                <ul className="nav nav-tabs nav-tabs-bottom">
                  <li className="nav-item">
                    <a
                      href="#details"
                      data-toggle="tab"
                      className="nav-link active"
                    >
                      Details
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="#attachments"
                      data-toggle="tab"
                      className="nav-link"
                    >
                      Attachments
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      onClick={() => {
                        setTimeout(() => {
                          const markers = projectDetails.subPlots?.map((p) => ({
                            ...p,
                            component: p.component,
                          }));
                          setMarkers(markers);
                        }, 200);
                      }}
                      href="#layout"
                      data-toggle="tab"
                      className="nav-link"
                    >
                      Project Layout
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      onClick={() => { }}
                      href="#subPlot"
                      data-toggle="tab"
                      className="nav-link"
                    >
                      {projectDetails?.type == "Plot" ? "Sub Plots" : projectDetails?.subtype}
                    </a>
                  </li>
                  {/* <li className="nav-item">
                    <a href="#leadsWon" data-toggle="tab" className="nav-link">
                      Leads Won
                    </a>
                  </li> */}
                  <li className="nav-item">
                    <a href="#leadsLost" data-toggle="tab" className="nav-link">
                      Leads Lost
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="#customers" data-toggle="tab" className="nav-link"
                      onClick={() => console.log(customerPurchases)}
                    >
                      Customers
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="#stocks" data-toggle="tab" className="nav-link">
                      Stocks
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="#transferstocks" data-toggle="tab" className="nav-link">
                      Transfer Stocks
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="tab-content">
            <div
              id="details"
              className="pro-overview show active tab-pane fade"
            >
              <div className="row">
                <div className="col-lg-8 col-xl-9">
                  <div className="card">
                    <div className="card-body">
                      <div className="project-title">Project Description</div>
                      <hr />
                      <p>{projectDetails?.description}</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-xl-3">
                  <div className="card">
                    <div className="card-body">
                      <h6 className="card-title m-b-15">Project details</h6>
                      <table className="table table-striped table-border">
                        <tbody>
                          <tr>
                            <td>Cost/SqFt:</td>
                            <td className="text-right">
                              ₹{projectDetails.costPerSqFeet}
                            </td>
                          </tr>
                          <tr>
                            <td>Created:</td>
                            <td className="text-right">
                              {new Date(
                                projectDetails?.startDate
                              ).toLocaleDateString()}
                            </td>
                          </tr>
                          <tr>
                            <td>Created by:</td>
                            <td className="text-right">
                              <Link to="/app/profile/employee-profile">
                                {projectDetails?.createdBy?.firstName ||
                                  'Admin'}
                              </Link>
                            </td>
                          </tr>
                          <tr>
                            <td>Land Area:</td>
                            <td className="text-right">
                              {projectDetails?.landArea || 0}
                            </td>
                          </tr>
                          <tr>
                            <td>Total {projectDetails?.subtype}:</td>
                            <td className="text-right">
                              {projectDetails?.subPlots?.length}
                            </td>
                          </tr>
                          <tr>
                            <td>{projectDetails?.subtype} sold:</td>
                            <td className="text-right">{totalPlotsSoldOut}</td>
                          </tr>
                          <tr>
                            <td>Under discussion:</td>
                            <td className="text-right">
                              {totalPlotsInDiscussion}
                            </td>
                          </tr>
                          <tr>
                            <td>Under Negotiations:</td>
                            <td className="text-right">
                              {totalPlotsInNegotiation}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-pane fade" id="attachments">
              <div className="row">
                <div
                  className="input-group mb-3 pl-3"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <h3>Attachments</h3>
                  <input
                    type="file"
                    style={{
                      display: 'none',
                    }}
                    accept="application/pdf"
                    onChange={(e) => {
                      const form = new FormData();
                      form.append('attachment', e.target.files[0]);
                      toast
                        .promise(
                          httpService.post(
                            `/project/${projectDetails._id}/attachment`,
                            form
                          ),
                          {
                            pending: 'Uploading File',
                            success: 'File Uploaded',
                            error: 'File Upload Failed',
                          }
                        )
                        .then(() => {
                          fetchProjectDetails();
                        });
                    }}
                  />
                  <button
                    onClick={(e) => {
                      e.target.previousSibling.click();
                    }}
                    className="btn add-btn"
                  >
                    <i className="fa fa-plus" /> Add File
                  </button>
                </div>
                <div
                  className="card"
                  style={{
                    width: '100%',
                  }}
                >
                  <div className="card-body">
                    <ul className="files-list">
                      {projectDetails.attachments?.map((attachment) => (
                        <li>
                          <div className="files-cont">
                            <div className="file-type">
                              <span className="files-icon">
                                <i className="fa fa-file-pdf-o" />
                              </span>
                            </div>
                            <div className="files-info">
                              <span className="file-name text-ellipsis">
                                <a target={'_blank'} href={attachment.url}>
                                  {attachment.name}
                                </a>
                              </span>
                              <span className="file-date">
                                {new Date(
                                  attachment.uploadedAt
                                ).toLocaleDateString() +
                                  ' at ' +
                                  new Date(
                                    attachment.uploadedAt
                                  ).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Project LayOut  */}
            <div className="tab-pane fade" id="layout">
              <h2 className="card-title mb-0 h-100 mt-2">Project Layout</h2>
              <hr />

              <div
                style={{
                  display: 'flex',
                  width: '100%',
                }}
              >
                {legends.map((legend, index) => (
                  <div
                    key={index}
                    style={{
                      marginRight: '10px',
                    }}
                  >
                    <div
                      style={{
                        background: legend.color,
                        display: 'inline-block',
                        width: '10px',
                        height: '10px',
                      }}
                    ></div>{' '}
                    {legend.name}
                  </div>
                ))}
              </div>
              <div className="row">
                {!projectDetails?.layout && (
                  <div className="card-body">
                    <h3
                      style={{
                        textAlign: 'center',
                        color: '#C0C0C0',
                        marginTop: '40px',
                        marginBottom: '30px',
                      }}
                    >
                      <input
                        type={'file'}
                        onChange={(e) => {
                          console.log(e.target.files[0]);
                          const form = new FormData();
                          form.append('layout', e.target.files[0]);
                          toast
                            .promise(
                              httpService.post(
                                `/project/${projectDetails._id}/layout`,
                                form
                              ),
                              {
                                pending: 'Uploading File',
                                success: 'File Uploaded',
                                error: 'File Upload Failed',
                              }
                            )
                            .then(() => {
                              fetchProjectDetails();
                            });
                        }}
                        style={{
                          display: 'none',
                        }}
                      />
                      <button
                        className="btn add-btn"
                        style={{
                          float: 'none',
                        }}
                        onClick={(e) => {
                          e.target.previousSibling.click();
                        }}
                      >
                        Add Layout
                      </button>
                    </h3>
                  </div>
                )}
                {projectDetails?.layout && updatedPaths && (
                  <div className="card-body">
                    <div className="clearfix">
                      {
                        projectDetails?.subPlots?.filter((e) => !e.component)
                          .length
                      }{' '}
                      more plot(s) need to be mapped
                      <button
                        className="btn add-btn"
                        style={{
                          marginLeft: 'auto',
                        }}
                        onClick={() => {
                          if (
                            projectDetails?.subPlots?.filter(
                              (e) => !e.component
                            ).length
                          ) {
                            toast.error(
                              'All plots needs to be mapped before saving'
                            );
                            return;
                          }
                          updateProjectPaths();
                        }}
                      >
                        Save Layout
                      </button>
                    </div>
                    <img
                      ref={layoutImageRef}
                      src={projectDetails?.layout}
                      draggable="false"
                      useMap="#layoutMap"
                      onLoad={(e) => {
                        layoutImageRef.current.addEventListener(
                          'click',
                          (e) => {
                            Swal.fire({
                              title: 'Enter name',
                              input: 'text',
                              preConfirm: (value) => {
                                return new Promise((resolve) => {
                                  setTimeout(() => {
                                    if (value === '') {
                                      resolve(
                                        Swal.showValidationMessage(
                                          'Please enter a name'
                                        )
                                      );
                                    } else {
                                      resolve();
                                    }
                                  }, 400);
                                });
                              },
                            }).then((result) => {
                              if (result.isConfirmed) {
                                const temp = projectDetails.subPlots;
                                temp.find(
                                  (v) => v.name === result.value
                                ).component = {
                                  x: e.offsetX,
                                  y: e.offsetY,
                                };
                                setProjectDetails({
                                  ...projectDetails,
                                  subPlots: temp,
                                });
                                setCoordinates((c) => [
                                  ...c,
                                  {
                                    x: e.offsetX,
                                    y: e.offsetY,
                                    name: result.value,
                                  },
                                ]);
                              }
                            });
                          }
                        );
                      }}
                      className="layout-image"
                    />
                    <map name="layoutMap"></map>
                    <br />
                    {projectDetails?.subPlots?.map((plot, index) =>
                      plot.component ? (
                        <InactiveTooltip key={index} title={plot?.name}>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setPlotInfoBackdrop(true);
                              setPlotInfo(plot);
                            }}
                            className="pin"
                            style={{
                              position: 'absolute',
                              top:
                                window.scrollY +
                                layoutImageRef?.current?.getBoundingClientRect()
                                  .y +
                                plot.component.y,
                              left:
                                window.scrollX +
                                layoutImageRef?.current?.getBoundingClientRect()
                                  .x -
                                220 +
                                plot.component.x,
                              background: '#EF473A',
                            }}
                          ></div>
                        </InactiveTooltip>
                      ) : (
                        <></>
                      )
                    )}
                  </div>
                )}
                {projectDetails.subPlots && !updatedPaths && (
                  <div
                    className="card-body"
                    style={{
                      position: 'relative',
                    }}
                  >
                    <img
                      ref={imgRef}
                      src={projectDetails?.layout}
                      draggable="false"
                      useMap="#layoutMap"
                      className="layout-image"
                      onLoad={(e) => {
                        setImageReady(true);
                      }}
                    />
                    {markers?.map((plot, index) =>
                      plot.component ? (
                        <>
                          {plot.leadsInfo.length === 0 && !plot.sold && (
                            <InactiveTooltip key={index} title={plot?.name}>
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();

                                  setPlotInfoBackdrop(true);
                                  setPlotInfo(plot);
                                }}
                                className="pin"
                                style={{
                                  position: 'absolute',
                                  top: 16 + parseInt(plot.component.y) + 'px',
                                  left: 32 + parseInt(plot.component.x) + 'px',
                                  background: '#EF473A',
                                }}
                              ></div>
                            </InactiveTooltip>
                          )}

                          {plot.leadsInfo.length > 0 &&
                            plot.leadsInfo.some(
                              (l) =>
                                l.leadType === 'New Lead'
                            ) &&
                            plot.leadsInfo.every(
                              (l) =>
                                l.leadType !== 'Won' &&
                                l.leadType !== 'Negotiations'
                            ) &&
                            !plot.sold && (
                              <InProspectTooltip
                                key={index}
                                title={plot.name}
                              >
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();

                                    setPlotInfoBackdrop(true);
                                    setPlotInfo(plot);
                                  }}
                                  className="pin"
                                  style={{
                                    position: 'absolute',
                                    top: 16 + parseInt(plot.component.y) + 'px',
                                    left:
                                      32 + parseInt(plot.component.x) + 'px',
                                    background: '#ffa500',
                                  }}
                                ></div>
                              </InProspectTooltip>
                            )}

                          {plot.leadsInfo.length > 0 &&
                            plot.leadsInfo.some(
                              (l) =>
                                l.leadType === 'Site Visit'
                            ) &&
                            plot.leadsInfo.every(
                              (l) =>
                                l.leadType !== 'Won' &&
                                l.leadType !== 'Negotiations'
                            ) &&
                            !plot.sold && (
                              <InSiteVisitTooltip
                                key={index}
                                title={plot.name}
                              >
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();

                                    setPlotInfoBackdrop(true);
                                    setPlotInfo(plot);
                                  }}
                                  className="pin"
                                  style={{
                                    position: 'absolute',
                                    top: 16 + parseInt(plot.component.y) + 'px',
                                    left:
                                      32 + parseInt(plot.component.x) + 'px',
                                    background: '#ff8500',
                                  }}
                                ></div>
                              </InSiteVisitTooltip>
                            )}

                          {plot.leadsInfo.length > 0 &&
                            plot.leadsInfo.some(
                              (l) =>
                                l.leadType === 'Discussion'
                            ) &&
                            plot.leadsInfo.every(
                              (l) =>
                                l.leadType !== 'Won' &&
                                l.leadType !== 'Negotiations'
                            ) &&
                            !plot.sold && (
                              <InDisscussionTooltip
                                key={index}
                                title={plot.name}
                              >
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();

                                    setPlotInfoBackdrop(true);
                                    setPlotInfo(plot);
                                  }}
                                  className="pin"
                                  style={{
                                    position: 'absolute',
                                    top: 16 + parseInt(plot.component.y) + 'px',
                                    left:
                                      32 + parseInt(plot.component.x) + 'px',
                                    background: '#FEF600',
                                  }}
                                ></div>
                              </InDisscussionTooltip>
                            )}
                          {plot.leadsInfo.length > 0 &&
                            plot.leadsInfo.some(
                              (l) => l.leadType == 'Negotiations'
                            ) &&
                            !plot.sold && (
                              <InNegotiationTooltip
                                key={index}
                                title={plot?.name}
                              >
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();

                                    setPlotInfoBackdrop(true);
                                    setPlotInfo(plot);
                                  }}
                                  className="pin"
                                  style={{
                                    position: 'absolute',
                                    top: 16 + parseInt(plot.component.y) + 'px',
                                    left:
                                      32 + parseInt(plot.component.x) + 'px',
                                    background: '#89CFF0',
                                  }}
                                ></div>
                              </InNegotiationTooltip>
                            )}
                          {plot.leadsInfo.some(
                            (l) => l.leadType == 'Won'
                          ) &&
                            plot.sold && (
                              <LeadsWontTooltip key={index} title={plot?.name}>
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();

                                    setPlotInfoBackdrop(true);
                                    setPlotInfo(plot);
                                  }}
                                  className="pin"
                                  style={{
                                    position: 'absolute',
                                    top: 16 + parseInt(plot.component.y) + 'px',
                                    left:
                                      32 + parseInt(plot.component.x) + 'px',
                                    background: '#4CBB17',
                                  }}
                                ></div>
                              </LeadsWontTooltip>
                            )}

                          {plot.leadsInfo.some(
                            (l) => l.leadType == 'Booking'
                          ) &&
                            plot.sold && (
                              <BookingTooltip key={index} title={plot?.name}>
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();

                                    setPlotInfoBackdrop(true);
                                    setPlotInfo(plot);
                                  }}
                                  className="pin"
                                  style={{
                                    position: 'absolute',
                                    top: 16 + parseInt(plot.component.y) + 'px',
                                    left:
                                      32 + parseInt(plot.component.x) + 'px',
                                    background: '#00ffdd',
                                  }}
                                ></div>
                              </BookingTooltip>
                            )}

                          {plot.leadsInfo.some(
                            (l) => l.leadType == 'Under Registration'
                          ) &&
                            plot.sold && (
                              <UnderRegistrationTooltip key={index} title={plot?.name}>
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();

                                    setPlotInfoBackdrop(true);
                                    setPlotInfo(plot);
                                  }}
                                  className="pin"
                                  style={{
                                    position: 'absolute',
                                    top: 16 + parseInt(plot.component.y) + 'px',
                                    left:
                                      32 + parseInt(plot.component.x) + 'px',
                                    background: '#112ac6',
                                  }}
                                ></div>
                              </UnderRegistrationTooltip>
                            )}

                          {plot.leadsInfo.some(
                            (l) => l.leadType == 'Registration'
                          ) &&
                            plot.sold && (
                              <RegistrationTooltip key={index} title={plot?.name}>
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();

                                    setPlotInfoBackdrop(true);
                                    setPlotInfo(plot);
                                  }}
                                  className="pin"
                                  style={{
                                    position: 'absolute',
                                    top: 16 + parseInt(plot.component.y) + 'px',
                                    left:
                                      32 + parseInt(plot.component.x) + 'px',
                                    background: '#ffb0dd',
                                  }}
                                ></div>
                              </RegistrationTooltip>
                            )}

                          {/* {plot.sold && (
                            <SoldOutTooltip key={index} title={plot?.name}>
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();

                                  setPlotInfoBackdrop(true);
                                  setPlotInfo(plot);
                                }}
                                className="pin"
                                style={{
                                  position: 'absolute',
                                  top: 16 + parseInt(plot.component.y) + 'px',
                                  left: 32 + parseInt(plot.component.x) + 'px',
                                  background: '#4CBB17',
                                }}
                              ></div>
                            </SoldOutTooltip>
                          )} */}
                        </>
                      ) : (
                        <></>
                      )
                    )}
                    <br />
                  </div>
                )}
              </div>
            </div>

            {/* Sub Plot  */}
            <div className="tab-pane fade" id="subPlot">
              <h2 className="card-title mb-0 h-100 mt-2">{projectDetails?.type == "Plot" ? "Sub Plots" : projectDetails?.subtype}</h2>
              <hr />
              <div className="row">
                {projectDetails.subPlots.length === 0 && (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <input
                      type={'file'}
                      onChange={handleSubPlotFile}
                      style={{
                        display: 'none',
                      }}
                    />
                    <button
                      onClick={(e) => {
                        e.target.previousSibling.click();
                      }}
                      className="btn btn-primary"
                    >
                      Add {projectDetails?.subtype} Details in CSV
                    </button>
                    <button
                      data-toggle="modal"
                      data-target="#add_plots"
                      className="btn btn-primary ml-5"
                    >
                      Add {projectDetails?.subtype} Details
                    </button>
                  </div>
                )}
                {/* Plot Table  */}
                {projectDetails.subPlots.length > 0 && (
                  <PlotsTable setRerender={setRerender} plots={projectDetails?.subPlots || []} />
                )}
              </div>
            </div>

            {/* Leads Won  */}
            <div id="leadsWon" className="tab-pane fade">
              <h2 className="card-title mb-0 h-100 mt-2">Leads Won</h2>
              <hr />
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Plot</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {projectLeadsWon.reverse().map((l, index) => (
                      <TableRow key={index}>
                        <TableCell>{l?.customer?.displayName || l?.lead?.name}</TableCell>
                        <TableCell>{l?.customer?.email || l?.lead?.email}</TableCell>
                        <TableCell>{l?.customer?.phone || l?.lead?.phone}</TableCell>
                        <TableCell>{l?.plotName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {projectLeadsWon.length === 0 && (
                  <div
                    style={{
                      height: '35vh',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <h4>No Leads</h4>
                  </div>
                )}
              </TableContainer>
            </div>

            <div id="leadsLost" className="tab-pane fade">
              <h2 className="card-title mb-0 h-100 mt-2">Leads Lost</h2>
              <hr />
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Plot</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {projectLeadsLost.reverse().map((l, index) => (
                      <TableRow key={index}>
                        <TableCell>{l?.customer?.displayName || l?.lead?.name}</TableCell>
                        <TableCell>{l?.customer?.email || l?.lead?.email}</TableCell>
                        <TableCell>{l?.customer?.phone || l?.lead?.phone}</TableCell>
                        <TableCell>{l?.plotName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {projectLeadsLost.length === 0 && (
                  <div
                    style={{
                      height: '35vh',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <h4>No Leads</h4>
                  </div>
                )}
              </TableContainer>
            </div>
            <div id="customers" className="tab-pane fade">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <h3>Customers</h3>
              </div>
              <div
                className="row"
                style={{
                  padding: '15px',
                }}
              >
                {customerPurchases.reverse().map((customer) => (

                  <div
                    key={customer?._id}
                    className="col-md-4 col-sm-6 col-12 col-lg-4 col-xl-3"
                  >
                    <div className="profile-widget">
                      <div className="profile-img">
                        <Link
                          to={`/app/profile/customer-profile/${customer?._id}`}
                          className="avatar"
                        >
                          <img src={''} alt="" />
                        </Link>
                      </div>
                      <h4 className="user-name m-t-10 mb-0 text-ellipsis">
                        <Link to={`/app/profile/customer-profile/${customer?._id}`}>
                          {customer?.displayName}
                        </Link>
                      </h4>
                      <div className="small text-muted">{customer?.phone}</div>
                      <div className="small text-muted">{customer?.email}</div>
                    </div>
                  </div>
                ))}

                {customerPurchases?.length == 0 &&
                  <TableContainer component={Paper}>
                    <div
                      style={{
                        height: '35vh',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <h4>No Customer</h4>
                    </div>
                  </TableContainer>
                }
              </div>
            </div>
            <div id="stocks" className="tab-pane fade">
              <div className="row align-items-center">
                <div className="col">
                  <h2 className="card-title mb-0 h-100 mt-2">Stocks</h2>
                </div>
                <div className="col-auto float-right ml-auto">
                  <a
                    href="#"
                    className="btn add-btn"
                    data-toggle="modal"
                    data-target="#transfer_stocks"
                  >
                    <i className="fa fa-plus" /> Transfer Stock
                  </a>
                </div>
              </div>

              <hr />
              <>
                {/* Search Filter */}
                <div className="row filter-row justify-content-between">
                  <div className="col-sm-6 col-md-6">
                    <div className="form-group form-focus focused">
                      <input
                        type="text"
                        style={{
                          padding: '10px',
                        }}
                        placeholder={'Search by Item'}
                        className="form-control"
                        value={qItem}
                        onChange={(e) => setqItem(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-6">
                    <div className="form-group form-focus focused">
                      <input
                        type="text"
                        style={{
                          padding: '8px',
                        }}
                        placeholder={'Search by Vendor'}
                        className="form-control"
                        value={qVendor}
                        onChange={(e) => setqVendor(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell className='text-center'>Sr No.</TableCell>
                      <TableCell className='text-center'>Date</TableCell>
                      <TableCell className='text-center'>Stock No</TableCell>
                      <TableCell className='text-center'>Item</TableCell>
                      <TableCell className='text-center'>Allocated Quantity</TableCell>
                      <TableCell className='text-center'>Consumed Quantity</TableCell>
                      <TableCell className='text-center'>Unit</TableCell>
                      <TableCell className='text-center'>Purpose</TableCell>
                      <TableCell className='text-center'>Delivered By (Vendor)</TableCell>
                      <TableCell className='text-center'>Add Consumption</TableCell>
                      {/* <TableCell className='text-center'>Delete</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>

                    {searchStock(allStock).reverse().map((l, index) => (
                      <TableRow key={index}>
                        <TableCell className='text-center'>{index + 1}</TableCell>
                        <TableCell className='text-center'>{l?.date?.split("T")[0]}</TableCell>
                        <TableCell className='text-center'>{l?.stockNo}</TableCell>
                        <TableCell className='text-center'>{l?.itemDetails}</TableCell>
                        <TableCell className='text-center'>{l?.quantity}</TableCell>
                        <TableCell className='text-center'>{l?.consumedQuantity || 0}</TableCell>
                        <TableCell className='text-center'>{l?.unit}</TableCell>
                        <TableCell className='text-center'>{l?.purpose || "nill"}</TableCell>
                        {/* <TableCell className='text-center'>{l?.vendorId?.name}</TableCell> */}
                        <TableCell className='text-center'><a href="#"><Link to={`/app/profile/vendor-profile/${l?.vendorId?._id}`}>{l?.vendorId?.name}</Link></a></TableCell>
                        <TableCell className='text-center'>
                          <a
                            href="#"
                            className="btn"
                            data-toggle="modal"
                            data-target="#add_consume_stocks"
                            onClick={(e) => setsptstkId(l)}
                            onMouseEnter={(e) => setsptstkId(l)}
                            onMouseLeave={(e) => setsptstkId(l)}
                          >
                            <Edit />
                          </a>
                        </TableCell>
                        {/* <TableCell> <a
                            href="#"
                            className="btn"
                            data-toggle="modal"
                            data-target="#add_stocks"
                            onClick={() => {
                              setStocks({ ...l, vendorId : l?.vendorId?._id });
                              setEditStock(true)
                            }}
                          >
                            <Edit />
                          </a> 
                        </TableCell>
                        <TableCell> <Delete onClick={() => handleStockDelete(l?._id)} /> </TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {allStock.length === 0 && (
                  <div
                    style={{
                      height: '35vh',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <h4>No Stocks</h4>
                  </div>
                )}
              </TableContainer>
            </div>
            <div id="transferstocks" className="tab-pane fade">
              <div className="row align-items-center">
                <div className="col">
                  <h2 className="card-title mb-0 h-100 mt-2">Transfered Stocks</h2>
                </div>
              </div>
              <hr />
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell className='text-center'>Sr No.</TableCell>
                      <TableCell className='text-center'>Date</TableCell>
                      <TableCell className='text-center'>Item</TableCell>
                      <TableCell className='text-center'>Transfer Quantity</TableCell>
                      <TableCell className='text-center'>Unit</TableCell>
                      <TableCell className='text-center'>Transfer To</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tStk.reverse().map((l, index) => (
                      <TableRow key={index}>
                        <TableCell className='text-center'>{index + 1}</TableCell>
                        <TableCell className='text-center'>{l?.date?.split("T")[0]}</TableCell>
                        <TableCell className='text-center'>{l?.stockId?.itemDetails}</TableCell>
                        <TableCell className='text-center'>{l?.transferQuantity}</TableCell>
                        <TableCell className='text-center'>{l?.unit}</TableCell>
                        <TableCell className='text-center'><Link to={`/app/projects/projects-view/${l?.projectTo?._id}`} onClick={() => setRerender(!rerender)}>{l?.projectTo?.name}</Link></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {tStk.length === 0 && (
                  <div
                    style={{
                      height: '35vh',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <h4>No Transfer Stocks</h4>
                  </div>
                )}
              </TableContainer>
            </div>
          </div>
        </div>
      )}
      {/* /Page Content */}
      <AddStocks
        handleStockSubmit={handleStockSubmit}
        stocks={stocks}
        handleStocks={handleStocks}
        vendorList={vendorList}
      />
      <EditProjectModal
        onSubmit={editProject}
        projectToEdit={projectToEdit}
        setProjectToEdit={setProjectToEdit}
        projectTypeEdit={projectToEdit?.type}
      />
      <Backdrop
        style={{
          zIndex: '9999',
        }}
        open={plotInfoBackdrop}
        onClick={() => {
          setPlotInfoBackdrop(false);
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {plotInfoBackdrop && (
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              style={{
                width: '70%',
                minHeight: '50%',
                maxHeight: '100%',
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '30px',
                overflow: 'auto',
              }}
            >
              <h3
                style={{
                  textAlign: 'center',
                }}
              >
                {plotInfo?.name}
              </h3>
              <div className='d-flex justify-content-center'>
                <h4 style={{ textAlign: 'center', fontWeight: 500, margin: '1rem', }} >
                  Dimension : {plotInfo?.dimension}
                </h4>
                <h4 style={{ textAlign: 'center', fontWeight: 500, margin: '1rem', }} >
                  Area : {plotInfo?.area}
                </h4>
                <h4 style={{ textAlign: 'center', fontWeight: 500, margin: '1rem', }} >
                  Cost : {plotInfo?.cost}
                </h4>
              </div>
              <div className="card tab-box">
                <div className="row user-tabs">
                  <div className="col-lg-12 col-md-12 col-sm-12 line-tabs">
                    <ul className="nav nav-tabs nav-tabs-bottom">
                      <li className="nav-item">
                        <a
                          href="#lead"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveInfoTab(2);
                          }}
                          className={`nav-link ${activeInfoTab === 2 ? 'active' : ''
                            }`}
                        >
                          Interests
                        </a>
                      </li>
                      {/* <li className="nav-item">
                        <a
                          href="#leads"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveInfoTab(3);
                          }}
                          className={`nav-link ${
                            activeInfoTab === 3 ? 'active' : ''
                          }`}
                        >
                          Sales
                        </a>
                      </li> */}
                    </ul>
                  </div>
                </div>
              </div>
              <div
                className="tab-content"
                style={{
                  paddingTop: '4px',
                }}
              >
                {activeInfoTab === 2 && (
                  <div id="lead" className="">
                    <Box sx={{ margin: 1 }}>
                      <Table size="small" aria-label="purchases">
                        {plotInfo?.leadsInfo?.length > 0 && (
                          <TableHead>
                            <TableRow>
                              <TableCell>Name</TableCell>
                              <TableCell>Email</TableCell>
                              <TableCell>Phone</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell>isCustomer</TableCell>
                            </TableRow>
                          </TableHead>
                        )}
                        <TableBody>
                          {plotInfo?.leadsInfo?.length === 0 && (
                            <h4
                              style={{
                                textAlign: 'center',
                                marginTop: '1rem',
                                marginBottom: '1rem',
                              }}
                            >
                              No Leads
                            </h4>
                          )}
                          {plotInfo?.leadsInfo?.map((r) => (
                            <TableRow key={r?.lead?._id}>
                              <TableCell component="th" scope="row">
                                {r?.customer?.displayName || r?.lead?.name}
                              </TableCell>
                              <TableCell>{r?.customer?.email || r?.lead?.email}</TableCell>
                              <TableCell>{r?.customer?.phone || r?.lead?.phone}</TableCell>
                              <TableCell>{r?.leadType}</TableCell>
                              <TableCell>{r?.isCustomer ? "YES" : "NO"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  </div>
                )}
                {activeInfoTab === 3 && plotInfo?.sold ? (
                  <div id="lead" className="">
                    <div
                      className="task-wrapper"
                      style={{
                        padding: '0',
                      }}
                    >
                      <h4>
                        <b>Sold To</b>: {plotInfo?.soldTo?.displayName}
                      </h4>
                      <h4>
                        <b>Sold On</b>: {plotInfo?.soldAt}
                      </h4>
                      <h4>
                        <b>Sold Price</b>: {plotInfo?.cost}
                      </h4>
                      <h4>
                        <b>Sold By</b>: {plotInfo?.soldBy?.firstName}
                      </h4>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          )}
        </div>
      </Backdrop>
      {
        sptstkId &&
        <AddConsumeStk allStock={allStock} stkId={sptstkId} fetchStocks={fetchStocks} />
      }
      {allStock?.length &&
        <TransferStk allStock={allStock} pId={id} fetchTransferStock={fetchTransferStock} />
      }
      {

        <AddPlotTable projectId={id} fetchProjectDetails={fetchProjectDetails} projectType={projectDetails?.type} />

      }
    </div>
  );
};

export default ProjectView;
