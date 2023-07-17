import React from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';

function EmployeeSettingSidebar(props) {
  let pathname = props.location.pathname;

  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-inner slimscroll">
        <div className="sidebar-menu">
          <ul>
            <li>
              <Link
                onClick={() => localStorage.setItem('firstload', 'true')}
                to="/app/dashboard"
              >
                <i className="la la-home" /> <span>Back to Home</span>
              </Link>
            </li>
            <li className="menu-title">Settings</li>
            {/* <li className={pathname.includes('profile') ? 'active' : ''}>
              <Link to="/settings/profile">
                <i className="la la-building" /> <span>Profile</span>
              </Link>
            </li>
            <li className={pathname.includes('-password') ? 'active' : ''}>
              <Link to="/settings/change-password">
                <i className="la la-lock" /> <span>Change Password</span>
              </Link>
            </li> */}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default withRouter(EmployeeSettingSidebar);
