import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import {
  User,
  Avatar_19,
  Avatar_07,
  Avatar_06,
  Avatar_14,
} from '../../../Entryfile/imagepath.jsx';
import { CircularProgress } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import '../../index.css';
import { getDashboard } from '../../../lib/api/index.js';
import { useSelector } from 'react-redux';
import httpService from '../../../lib/httpService';
// import 'Assets/plugins/morris/morris.min.js';
// import 'Assets/plugins/raphael/raphael.min.js';
// import 'Assets/js/chart.js';

const barchartdata = [
  { y: '2006', 'Total Income': 100, 'Total Outcome': 90 },
  { y: '2007', 'Total Income': 75, 'Total Outcome': 65 },
  { y: '2008', 'Total Income': 50, 'Total Outcome': 40 },
  { y: '2009', 'Total Income': 75, 'Total Outcome': 65 },
  { y: '2010', 'Total Income': 50, 'Total Outcome': 40 },
  { y: '2011', 'Total Income': 75, 'Total Outcome': 65 },
  { y: '2012', 'Total Income': 100, 'Total Outcome': 90 },
];
const linechartdata = [
  { y: '2006', 'Total Sales': 50, 'Total Revenue': 90 },
  { y: '2007', 'Total Sales': 75, 'Total Revenue': 65 },
  { y: '2008', 'Total Sales': 50, 'Total Revenue': 40 },
  { y: '2009', 'Total Sales': 75, 'Total Revenue': 65 },
  { y: '2010', 'Total Sales': 50, 'Total Revenue': 40 },
  { y: '2011', 'Total Sales': 75, 'Total Revenue': 65 },
  { y: '2012', 'Total Sales': 100, 'Total Revenue': 50 },
];
const AdminDashboard = () => {
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

  const user = useSelector((state) => state.authentication.value.user);
  const [dashboard, setDashboard] = useState({
    projectCount: 0,
    employeeCount: 0,
    customerCount: 0,
    leadCount: 0,
    invoices: [],
    project: [],
    payments: [],
  });

  const disAreaPer = (plotAreaUnderDiscussion / totalPlotArea) * 100;
  const negAreaPer = (plotAreaInNegotiation / totalPlotArea) * 100;
  const PlotLeadAreaPer = (plotAreaLeadsWon / totalPlotArea) * 100;
  const soldAreaPer = (totalPlotsSoldOut / totalPlotArea) * 100;
  const inactive =
    100 - (disAreaPer + negAreaPer + PlotLeadAreaPer + soldAreaPer);
  const leftArea =
    totalPlotArea -
    (plotAreaUnderDiscussion +
      plotAreaInNegotiation +
      plotAreaLeadsWon +
      totalPlotsSoldOut);

  useEffect(() => {
    fetchData();
  }, [dashboard.project]);
  // console.log(dashboard.payments, "invoicesinvoices");
  useEffect(() => {
    async function fetchApi() {
      setLoading(true);
      try {
        const res = await getDashboard();
        if (res.error) {
          console.log('-------INTERNAL SERVER ERROR-------');
          return;
        }
        // leconso.log("dashbord", res);
        setDashboard(res);
      } catch (err) {
        console.log(err);
      }
    }
    fetchApi();
  }, []);


  const fetchData = async () => {
    try {
      dashboard.project.forEach((project) => {
        const totalArea = project?.subPlots.reduce((a, b) => a + b?.area, 0);
        const totalAreaSold = project?.subPlots
          .filter((l) => l?.sold)
          .reduce((a, b) => a + b?.area, 0);
        const totalAreaInDiscussion = project?.subPlots
          .filter(
            (p) =>
              !p?.sold &&
              p?.leadsInfo.some(
                (l) => l?.leadType === 'Discussions' || l?.leadType === 'New Lead'
              )
          )
          .reduce((a, b) => a + b?.area, 0);
        const totalAreaInNegotiation = project?.subPlots
          .filter(
            (p) =>
              !p?.sold && p?.leadsInfo.some((l) => l?.leadType === 'Negotiations')
          )
          .reduce((a, b) => a + b?.area, 0);
        const totalAreaLeadsWons = project.subPlots
          .filter(
            (p) => !p?.sold && p?.leadsInfo.some((l) => l?.leadType === 'Lead Won')
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

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Dashboard</title>
        <meta name="description" content="Dashboard" />
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
              <div className="col-sm-12">
                <h3 className="page-title">Welcome {user?.firstName}!</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item active">Dashboard</li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
              <div className="card dash-widget">
                <Link to="/app/leads/projects">
                  <div className="card-body">
                    <Link to="/app/leads/projects">
                      <span className="dash-widget-icon">
                        <i className="fa fa-cubes" />
                      </span>
                    </Link>
                    <div className="dash-widget-info">
                      <h3>{dashboard?.projectCount}</h3>

                      <Link to="/app/leads/projects"> <span>Projects</span></Link>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
              <div className="card dash-widget">
                <Link to="/app/sales/customers">
                  <div className="card-body">
                    <Link to="/app/sales/customers">
                      <span className="dash-widget-icon">
                        {/* <i className="fa fa-usd" /> */}
                        <SupportAgentIcon></SupportAgentIcon>
                      </span>
                    </Link>
                    <div className="dash-widget-info">
                      <h3>{dashboard?.customerCount}</h3>
                      {/* <span>Clients</span> */}
                      <Link to="/app/sales/customers"> <span>Customer</span></Link>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
              <div className="card dash-widget">
                <Link to="/app/employees/leads">
                  <div className="card-body">

                    <span className="dash-widget-icon">
                      {/* <i className="fa fa-diamond" /> */}
                      <PeopleIcon></PeopleIcon>
                    </span>

                    <div className="dash-widget-info">
                      <h3>{dashboard?.leadCount}</h3>
                      {/* <span>Leads</span> */}
                      <Link to="/app/employees/leads"> <span>Leads</span></Link>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
              <div className="card dash-widget">
                <Link to="/app/employee/employees-list">
                  <div className="card-body">
                    <span className="dash-widget-icon">
                      <i className="fa fa-user" />
                    </span>
                    <div className="dash-widget-info">
                      <h3>{dashboard?.employeeCount}</h3>
                      {/* <span>Employees</span> */}
                      <Link to="/app/employee/employees-list"> <span>Employees</span></Link>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className="row">


            <div className="col-md-12 col-lg-6 col-xl-4 d-flex">
              <div className="card flex-fill">
                <div className="card-body">
                  <h4 className="card-title">Project Statistics</h4>
                  <div className="statistics">
                    <div className="row">
                      <div className="col-md-6 col-6 text-center">
                        <div className="stats-box mb-4">
                          <p>Total Area(Sqft)</p>
                          <h3> {totalPlotArea}</h3>
                        </div>
                      </div>
                      <div className="col-md-6 col-6 text-center">
                        <div className="stats-box mb-4">
                          <p>Total Plots(units)</p>
                          <h3>{totalPlots}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="progress mb-4">
                    <div
                      className="progress-bar bg-purple"
                      role="progressbar"
                      style={{ width: `${disAreaPer}%` }}
                      aria-valuenow={30}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      {disAreaPer} %
                    </div>
                    <div
                      className="progress-bar bg-warning"
                      role="progressbar"
                      style={{ width: `${negAreaPer}%` }}
                      aria-valuenow={18}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      {negAreaPer}%
                    </div>
                    <div
                      className="progress-bar bg-success"
                      role="progressbar"
                      style={{ width: `${PlotLeadAreaPer}%` }}
                      aria-valuenow={12}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      {PlotLeadAreaPer}%
                    </div>
                    <div
                      className="progress-bar bg-info"
                      role="progressbar"
                      style={{ width: `${soldAreaPer}%` }}
                      aria-valuenow={14}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      {soldAreaPer} %
                    </div>
                    {inactive > 0 ? (
                      <div
                        className="progress-bar bg-danger"
                        role="progressbar"
                        style={{ width: `${inactive}%` }}
                        aria-valuenow={14}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        {inactive} %
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                  <div>
                    <p>
                      <i className="fa fa-dot-circle-o text-purple mr-2" />
                      Discussion Area{' '}
                      <span className="float-right">
                        {plotAreaUnderDiscussion}
                      </span>
                    </p>
                    <p>
                      <i className="fa fa-dot-circle-o text-warning mr-2" />
                      Negotiation Area{' '}
                      <span className="float-right">
                        {plotAreaInNegotiation}
                      </span>
                    </p>
                    <p>
                      <i className="fa fa-dot-circle-o text-success mr-2" />
                      Leads Won Area{' '}
                      <span className="float-right">{plotAreaLeadsWon}</span>
                    </p>
                    {/* <p>
                    <i className="fa fa-dot-circle-o text-danger mr-2" />
                    Pending Tasks <span className="float-right">47</span>
                  </p> */}
                    <p className="mb-3">
                      <i className="fa fa-dot-circle-o text-info mr-2" />
                      Sold Area{' '}
                      <span className="float-right">{plotAreaSoldOut}</span>
                    </p>
                    <p className="mb-0">
                      <i className="fa fa-dot-circle-o text-danger mr-2" />
                      Left Area <span className="float-right">{leftArea}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4 d-flex">
              <div className="card card-table flex-fill">
                <div className="card-header">
                  <h3 className="card-title mb-0">Invoices</h3>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-nowrap custom-table mb-0">
                      <thead>
                        <tr>
                          <th>Invoice</th>
                          <th>Customer</th>
                          {/* <th>Due Date</th> */}
                          {/* <th>Total</th> */}
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboard.invoices.map((inv) => {
                          return (
                            <tr>
                              <td>
                                <Link to={`/app/sales/invoice-view/${inv?._id}`}>
                                  {inv?.invoice}
                                </Link>
                              </td>
                              <td>
                                <h2>
                                  {/* <a href="#">{inv?.customer?.name}</a> */}
                                  <Link to={`/app/sales/invoice-view/${inv?._id}`}>{inv?.customer?.displayName}</Link>
                                  {/* <a href="#">{inv?.customer?.displayName}</a> */}
                                </h2>
                              </td>
                              {/* <td>
                                  {new Date(inv?.invoiceDate).toLocaleDateString()}
                                </td> */}
                              {/* <td>{inv?.grandTotal}</td> */}
                              <td>

                                {inv?.status === 'PAID' ?
                                  <span className="badge bg-inverse-success">
                                    {inv?.status}
                                  </span> : ''}
                                {inv?.status === 'PARTIAL' ?
                                  <span className="badge bg-inverse-warning">
                                    {inv?.status}
                                  </span> : ''}
                                {inv?.status === 'PENDING' ?
                                  <span className="badge bg-inverse-warning">
                                    {inv?.status}
                                  </span> : ''}


                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="card-footer">
                  <Link to="/app/sales/invoices">View all invoices</Link>
                </div>
              </div>
            </div>
            {/* //Payments */}
            <div className="col-md-4 d-flex">
              <div className="card card-table flex-fill">
                <div className="card-header">
                  <h3 className="card-title mb-0">Payments</h3>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table custom-table table-nowrap mb-0">
                      <thead>
                        <tr>
                          <th>Payment</th>
                          {/* <th>Customer</th> */}
                          <th>Payment Type</th>
                          {/* <th>Paid Date</th> */}
                          <th>Paid Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboard.payments.map((payment) => {
                          return (
                            <tr>
                              <td>
                                <Link to={`/app/sales/payment-view/${payment?._id}`}>
                                  {payment?.paymentNumber}
                                </Link>
                              </td>
                              {/* <td> */}
                              {/* <h2> */}
                              {/* <a href="#">{payment?.customer?.name}</a> */}
                              {/* <a href="#">{payment?.customer?.customer}</a> */}
                              {/* </h2> */}
                              {/* </td> */}

                              <td><Link to={`/app/sales/payment-view/${payment?._id}`}>
                                {payment?.paymentMode}
                              </Link></td>
                              {/* <td>
                                {new Date(
                                  payment?.paymentDate
                                ).toLocaleDateString()}
                              </td> */}
                              {/* <td>{payment?.amount}</td> */}
                              <td>{payment?.amountReceived}</td>

                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="card-footer">
                  <Link to="/app/sales/payment-received">View all payments</Link>
                </div>
              </div>
            </div>
          </div>
          {/* /Statistics Widget */}

        </div>
      )}
    </div>
  );
};

export default withRouter(AdminDashboard);
