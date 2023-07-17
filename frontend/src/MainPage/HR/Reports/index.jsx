 /**
 * Crm Routes
 */
/* eslint-disable */
import React,{useState,useEffect} from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import ExpenseReport from './expensereport';
import Invoicereport from './invoicereport';
import PaymentReport from './paymentreport';
import IssueTracking from './issuetracking';
import TaskReport from './taskreport';
import UserReport from './userreport';
import EmployeeReport from './employeereport';
import PayslipReport from './payslipreport';
import AttendanceReport from './attendancereport';
import LeaveReport from './leavereport';
import DailyReport from './dailyreport';
import BalanceSheet from './balancesheet';
import AgentSale from './agentsale';
import CashFlow from './cashflow';
import CustomerSale from './customersale';
import CustomerBalSummary from './customerBalSummary';
import SaleOrderDetails from './saleOrderDetails';
import ProfitLoss from './profitloss';
import ProductSale from './productsale';
import VendorBalanceSum from './VendorBalanceSum';
import VendorPurchaseReport from './VendorPurchaseReport';
import VendorCreditSummary from './VendorCreditSummary';
import ProjectsReport from './ProjectsReport';
import ProjectsBalSummary from './ProjectsBalSummary';
import PaymentReceived from './paymentReceived';
import PaymentsMade from './PaymentsMade';
import httpService from '../../../lib/httpService';

const ReportsRoute = ({ match }) => {
  console.log('from index')
  const [data, setData] = useState([{}]);
  var tempu = [];
  let uniqueTempu = [];

  useEffect(async () => {
    const res = await httpService.get('/sale-invoice');
    setData(res.data);
    var invoices = [...res.data];
    console.log(invoices, 'data from index');
  }, []);

    console.log(data, 'data index res');
    data?.map((emails) => {
      uniqueTempu.push(emails?.customer?.email);
    });
    tempu = [...new Set(uniqueTempu)];
    console.log(tempu, 'tempu i func');
 

  return(
  <>
  <Switch>
    <Redirect
      exact
      from={`${match.url}/`}
      to={`${match.url}/expense-reports`}
    />
    <Route path={`${match.url}/vendor-balance-summary`} component={VendorBalanceSum} />
    <Route path={`${match.url}/vendor-purchase-report`} component={VendorPurchaseReport} />
    <Route path={`${match.url}/vendor-credit-report`} component={VendorCreditSummary} />
    <Route path={`${match.url}/projects-report`} component={ProjectsReport} />
    <Route path={`${match.url}/projects-balance-report`} component={ProjectsBalSummary} />
    <Route path={`${match.url}/payment-received`} component={PaymentReceived} />
    <Route path={`${match.url}/payment-made`} component={PaymentsMade} />
    <Route path={`${match.url}/expense-reports`} component={ExpenseReport} />
    <Route path={`${match.url}/invoice-reports`} component={Invoicereport} />
    <Route path={`${match.url}/payments-reports`} component={PaymentReport} />
    <Route path={`${match.url}/issue-tracking`} component={IssueTracking} />
    <Route path={`${match.url}/task-reports`} component={TaskReport} />
    <Route path={`${match.url}/user-reports`} component={UserReport} />
    <Route path={`${match.url}/employee-reports`} component={EmployeeReport} />
    <Route path={`${match.url}/payslip-reports`} component={PayslipReport} />
    <Route
      path={`${match.url}/attendance-reports`}
      component={AttendanceReport}
    />
    <Route path={`${match.url}/leave-reports`} component={LeaveReport} />
    <Route path={`${match.url}/daily-reports`} component={DailyReport} />
    <Route path={`${match.url}/sales-by-agent`} component={AgentSale} />
    <Route path={`${match.url}/balance-sheet`} component={BalanceSheet} />
    <Route path={`${match.url}/sales-by-customer`} render={(props)=><CustomerSale {...props} invoices={data} tempu={tempu} tempuSize={tempu?.length}/>}/>
    <Route path={`${match.url}/customer-bal-summary`} render={(props)=><CustomerBalSummary {...props} invoices={data} tempu={tempu}/>}/>
    <Route path={`${match.url}/sales-order-details`} component={SaleOrderDetails} />
    <Route path={`${match.url}/profit-and-loss`} component={ProfitLoss} />
    <Route path={`${match.url}/cash-flow-statement`} component={CashFlow} />
    <Route path={`${match.url}/sales-by-product`} component={ProductSale} />
  </Switch>
  </>
)};

export default ReportsRoute;
