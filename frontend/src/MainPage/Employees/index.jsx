/**
 * Crm Routes
 */
/* eslint-disable */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Clients from './clients';
import ClientsList from './clientslist';
import Leades from './leades';
import Tickets from './tickets';
import TicketView from './ticketview';
import LeaveRequest from './leaveRequest';
import EmpNotification from './Employees/EmpNotification';
import HrleaveRequest from './HRleaveRequest';
import Leades_status from './leades_status';
// import HrleaveRequest from './HRleaveRequest';

const EmployeeRoute = ({ match }) => (
  <Switch>
    <Redirect exact from={`${match.url}/`} to={`${match.url}/clients`} />
    <Route path={`${match.url}/clients`} component={Clients} />
    <Route path={`${match.url}/clients-list`} component={ClientsList} />
    <Route path={`${match.url}/leads`} component={Leades} />
    <Route path={`${match.url}/leads-status`} component={Leades_status} />
    <Route path={`${match.url}/tickets`} component={Tickets} />
    <Route exact path={`${match.url}/notification`} component={EmpNotification} />
    <Route path={`${match.url}/ticket-view`} component={TicketView} />
    <Route path={`${match.url}/leave request`} component={LeaveRequest} />
    <Route path={`${match.url}/hr-leave-request`} component={HrleaveRequest} />
  </Switch>
);

export default EmployeeRoute;
