import React from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';

function AdminSettingSidebar(props) {
  let pathname = props.location.pathname;
  console.log(pathname)

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
                <i className="la la-user" /> <span>Profile</span>
              </Link>
            </li> */}
            {/* <li className={pathname.includes('companysetting') ? 'active' : ''}>
              <Link to="/settings/companysetting">
                <i className="la la-building" /> <span>Company Settings</span>
              </Link>
            </li> */}
            {/* <li className={pathname.includes('role') ? 'active' : ''}>
              <Link
                onClick={() => localStorage.setItem('selectbox', 'true')}
                to="/settings/role"
              >
                <i className="la la-search-location" /> <span>Role</span>
              </Link>
            </li> */}
            
            <li className={pathname.includes('localization') ? 'active' : ''}>
              <Link
                onClick={() => localStorage.setItem('selectbox', 'true')}
                to="/settings/localization"
              >
                <i className="la la-search-location" /> <span>Locations</span>
              </Link>
            </li>
            <li
              className={pathname.includes('department') ? 'active' : ''}
            >
              <Link to="/settings/department">
                <i className="la la-key" /> <span>Departments</span>
              </Link>
            </li>
            {/* <li
              className={pathname.includes('roles-permissions') ? 'active' : ''}
            >
              <Link to="/settings/roles-permissions">
                <i className="la la-key" /> <span>Permissions</span>
              </Link>
            </li> */}
            {/* <li className={pathname.includes('-password') ? 'active' : ''}>
              <Link to="/settings/change-password">
                <i className="la la-lock" /> <span>Change Password</span>
              </Link>
            </li> */}
            <li className={pathname.includes('-holidays') ? 'active' : ''}>
              <Link to="/settings/custom-holidays">
                <i className="la la-calendar" /> <span>Custom Holidays</span>
              </Link>
            </li>
            <li className={pathname.includes('-type') ? 'active' : ''}>
              <Link to="/settings/leave-type">
                <i className="la la-cogs" /> <span>Leave Type</span>
              </Link>
            </li>
            <li className={pathname.includes('employee') ? 'active' : ''}>
              <Link to="/settings/employee-type">
                <i className="la la-cogs" /> <span>Employee Type</span>
              </Link>
            </li>
            {/* <li className={pathname.includes('lead') ? 'active' : ''}>
              <Link to="/settings/lead-setting">
                <i className="la la-cogs" /> <span>Lead Status</span>
              </Link>
            </li> */}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default withRouter(AdminSettingSidebar);
