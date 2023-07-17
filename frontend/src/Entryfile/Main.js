import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import App from '../initialpage/App';
import config from 'config';

import 'font-awesome/css/font-awesome.min.css';

import '../assets/css/font-awesome.min.css';
import '../assets/css/line-awesome.min.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/bootstrap.min.css';

// Custom Style File
import '../assets/js/bootstrap.min.js';
import '../assets/css/select2.min.css';

import '../assets/js/popper.min.js';
// import '../assets/js/app.js';
import '../assets/js/select2.min.js';
import '../assets/js/jquery-3.2.1.min.js';

import '../assets/js/jquery.slimscroll.min.js';

import '../assets/js/bootstrap-datetimepicker.min.js';
import '../assets/js/jquery-ui.min.js';
import '../assets/js/task.js';
import '../assets/js/multiselect.min.js';
import '../assets/plugins/bootstrap-tagsinput/bootstrap-tagsinput.css';
import '../assets/css/bootstrap-datetimepicker.min.css';
import '../assets/css/style.css';
import { ModalContainer } from 'reoverlay';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainApp = () => (
  <Router>
    <Switch basename={`${config.publicPath}`}>
      <Route path="/" component={App} />
    </Switch>
    <ToastContainer hideProgressBar={true} />
    <ModalContainer />
  </Router>
);

export default MainApp;
