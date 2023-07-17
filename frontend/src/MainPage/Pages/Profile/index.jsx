/**
 * Tables Routes
 */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import EmployeeProfile from './employeeprofile';
import ClientProfile from './clientprofile';
import leadprofile from './leadprofile';
import CustomerProfile from './CustomerProfile';
import VendorProfile from './VendorProfile';
import CandidateProfile from './CandidateProfile';
import VendorBill from './panes/VendorBill';
import VendorBillView from './panes/VendorBillView';
import AddEmployee from './AddEmployee';
import LandSaleDetails from './LandSaleDetails';

const subscriptionroute = ({ match }) => (
  <Switch>
    <Redirect
      exact
      from={`${match.url}/`}
      to={`${match.url}/employee-profile`}
    />
    <Route
      path={`${match.url}/employee-profile/:id`}
      component={EmployeeProfile}
    />
    {/* <Route
      exact
      path={`${match.url}/addemployee`}
      component={AddEmployee}
    /> */}
    <Route
      exact
      path={`${match.url}/addemployee/:id`}
      component={AddEmployee}
    />
    <Route
      path={`${match.url}/candidate-profile/:id`}
      component={CandidateProfile}
    />
    <Route path={`${match.url}/client-profile`} component={ClientProfile} />
    <Route
      path={`${match.url}/customer-profile/:id`}
      component={CustomerProfile}
    />
    <Route exact path={`${match.url}/vendor-profile/:id`} component={VendorProfile} />
    <Route exact path={`${match.url}/vendor-profile/:id/createbill`} component={VendorBill} />
    {/* <Route exact path={`/app/purchase/addbill`} component={VendorBill} /> */}
    <Route exact path={`${match.url}/vendor-profile/:id/viewbill`} component={VendorBillView} />
    <Route path={`${match.url}/lead-profile/:id`} component={leadprofile} />
    <Route path={`${match.url}/landsale/:id`} component={LandSaleDetails} />
  </Switch>
);

export default subscriptionroute;
