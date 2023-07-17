/**
 * Crm Routes
 */
/* eslint-disable */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import ProjectList from '../Employees/Projects/projectlist';
import AddLeads from './AddLeads';
import AllStatus from './AllStatus';
import LeadStatus from './LeadStatus';
import LeadStatusNew from './LeadStatusNew';

const LeadsRoute = ({ match }) => {
  console.log(`${match.url}/lead-status`);
  return (
    <Switch>
      <Route path={`/app/leads/lead-status`} component={AllStatus} />
      <Route path={`${match.url}/add-leads`} component={AddLeads} />
      <Route path={`/app/leads/projects`} component={ProjectList} />
    </Switch>
  );
};

export default LeadsRoute;
