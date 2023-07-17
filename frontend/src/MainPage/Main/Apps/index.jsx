/**
 * Crm Routes
 */
/* eslint-disable */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Chat from './chat';
import Calendar from './calendar';
import Contacts from './contacts';
import FileManager from './filemanager';
import EmailBox from './EmailBox';

const AppsRoute = ({ match }) => (
   <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/chat`} />
      <Route path={`${match.url}/chat`} component={Chat} />
      <Route path={`${match.url}/calendar`} component={Calendar} />
      <Route path={`${match.url}/contacts`} component={Contacts} />
      <Route path={`${match.url}/file-manager`} component={FileManager} />
      <Route path={`${match.url}/email`} component={EmailBox} />
      
   </Switch>
  
);

export default AppsRoute;
