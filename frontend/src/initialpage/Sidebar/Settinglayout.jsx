/**
 * App Routes
 */
import React, { Component } from 'react';
import { Redirect, Route, withRouter } from 'react-router-dom';
import EmployeeProfile from '../../MainPage/Pages/Profile/employeeprofile';

// router service
import settingservice from '../../router_service/settingservice';

import Header from './header';
import SettingsSidebar from './settingsidebar';

const SettingsLayout = (props) => {
  const { match } = props;
  return (
    <>
      <Header />
      <div>
        {settingservice &&
          settingservice.map((route, key) => (
            <Route
              key={key}
              path={`${match.url}/${route.path}`}
              component={route.component}
            />
          ))}
        {/* <Route path={`${match.url}/profile`} component={EmployeeProfile} /> */}
        <Redirect to={`${match.url}/profile`} from={`${match.url}/`} />
      </div>
      <SettingsSidebar />
    </>
  );
};
export default withRouter(SettingsLayout);
