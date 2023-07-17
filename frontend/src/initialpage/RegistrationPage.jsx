/**
 * Signin Firebase
 */

import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { headerlogo } from '../Entryfile/imagepath.jsx';

const Registrationpage = (props) => {
  /**
   * On User Login
   */
  const onUserLogin = (e) => {
    e.preventDefault();

    if (this.state.email !== '' && this.state.password !== '') {
      this.props.signinUserInFirebase(this.state, this.props.history);
    }
  };

  const onApplyJob = (e) => {
    e.preventDefault();
    localStorage.removeItem('jobview');
    this.props.history.push('/applyjob/joblist');
  };

  const { loading } = props;
  return (
    <>
      <Helmet>
        <title>Register</title>
        <meta name="description" content="Login page" />
      </Helmet>
      <div className="account-content">
        <Link to="/applyjob/joblist" className="btn btn-primary apply-btn">
          Apply Job
        </Link>
        <div className="container">
          {/* Account Logo */}
          <div className="account-logo">
            <Link to="/app/main/dashboard">
              <img src={headerlogo} alt="Oboroi Real Estates" />
            </Link>
          </div>
          {/* /Account Logo */}
          <div className="account-box">
            <div className="account-wrapper">
              <h3 className="account-title">Register</h3>
              <p className="account-subtitle">Access to our dashboard</p>
              {/* Account Form */}
              <div>
                <div className="form-group">
                  <label>Email</label>
                  <input className="form-control" type="text" />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input className="form-control" type="password" />
                </div>
                <div className="form-group">
                  <label>Repeat Password</label>
                  <input className="form-control" type="password" />
                </div>
                <div className="form-group text-center">
                  <button className="btn btn-primary account-btn" type="submit">
                    Register
                  </button>
                </div>
                <div className="account-footer">
                  <p>
                    Already have an account? <Link to="/login">Login</Link>
                  </p>
                </div>
              </div>
              {/* /Account Form */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Registrationpage;
