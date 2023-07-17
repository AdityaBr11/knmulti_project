/**
 * App Routes
 */
import React, { useEffect } from 'react';
import { Route, withRouter, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import routerService from '../../router_service';
import httpService from '../../lib/httpService';

import Header from './header.jsx';
import SidebarContent from './sidebar';
import { setAuthticationStore } from '../../features/authentication/authenticationSlice';

const DefaultLayout = (props) => {
  const dispatch = useDispatch();
  const { match } = props;
  const authentication = useSelector((state) => state.authentication.value);
  const userAuthorities = authentication.user?.userAuthorites;
  const history = useHistory();
  useEffect(() => {
    if (authentication.token) {
      httpService.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${authentication.token}`;
    } else if (localStorage.getItem('auth')) {
      dispatch(setAuthticationStore(JSON.parse(localStorage.getItem('auth'))));
    } else {
      history.push('/');
    }
  }, [authentication.token]);
  return (
    <>
      <Header />
      <div>
        {routerService &&
          routerService.map((route, key) => (
            <Route
              key={key}
              path={`${match.url}/${route.path}/`}
              component={route.component}
            />
          ))}
      </div>
      <SidebarContent />
    </>
  );
};
export default withRouter(DefaultLayout);
