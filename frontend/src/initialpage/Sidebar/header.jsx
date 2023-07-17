/**
 * App Header
 */
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  headerlogo,
  Avatar_02,
  Avatar_03,
  Avatar_06,
  Avatar_13,
  Avatar_17,
} from '../../Entryfile/imagepath';
import { getNotify } from '../../features/notify/notifySlice';
import { editAttendance, fetchAttendance } from '../../lib/api';
import { checkIsEmployeePresent, timeDifference } from '../../misc/helpers';

//logout method
export const handleLogout = async (e) => {
  const { user } = JSON.parse(localStorage.getItem('auth'));
  localStorage.removeItem('auth');
  console.log('Logging Out...');
  const res = await fetchAttendance(user?._id);
  const dailyLoginData = checkIsEmployeePresent(user?._id, new Date(), res);
  // console.log('Daily Login Data', dailyLoginData);
  const sessionsList = dailyLoginData?.sessions;
  // console.log(sessionsList);
  const currentSession = sessionsList?.filter(
    (session) => session.from && !session.upto
  )[0];
  // console.log('Current Session', currentSession);
  const res2 = await editAttendance(dailyLoginData?._id, {
    date: dailyLoginData?.date,
    employee: dailyLoginData?.employee,
    hours:
      dailyLoginData?.hours +
      timeDifference(
        new Date(currentSession?.from).getTime(),
        new Date().getTime()
      ),
    sessions: [
      ...sessionsList.filter((s) => s !== currentSession),
      { ...currentSession, upto: new Date() },
    ],
  });
  // console.log(res2);
  console.log(
    timeDifference(
      new Date(currentSession?.from).getTime(),
      new Date().getTime()
    ),
    ' hours!'
  );
  localStorage.removeItem('lastLoginAt');
};

// class Header extends Component {
const Header = (props) => {
  // render() {
  const { location } = props;
  const dispatch = useDispatch();
  const empId = useSelector((state) => state?.authentication?.value?.user?._id);
  const authentication = useSelector((state) => state.authentication.value);

  let pathname = location.pathname;
  const { user } = JSON.parse(localStorage.getItem('auth'));

  const isAdmin = authentication?.user?.jobRole?.authorities.includes('ADMIN');

  // console.log({isAdmin});

  const [notifyItems, setnotifyItems] = useState([]);

  const notifyData = useSelector(({ notification }) => notification?.notify);


  useEffect(() => {
    dispatch(getNotify(empId));
  }, [])
  // console.log(notifyData, getNotify(empId), "notifyData");
  useEffect(() => {
    if (notifyData) {
      setnotifyItems([...notifyData]);
    }
  }, [notifyData]);


  return (
    <div className="header" style={{ right: '0px' }}>
      {/* Logo */}
      <div className="header-left">
        <Link to="/app/dashboard" className="logo">
          <img src={headerlogo} width={40} height={40} alt="" />
        </Link>
      </div>
      {/* /Logo */}
      <a
        id="toggle_btn"
        href=""
        style={{
          display: pathname.includes('tasks')
            ? 'none'
            : pathname.includes('compose')
              ? 'none'
              : '',
        }}
      >
        <span className="bar-icon">
          <span />
          <span />
          <span />
        </span>
      </a>
      {/* Header Title */}
      <div className="page-title-box">
        <h3>KN Multiprojects</h3>
      </div>
      {/* /Header Title */}
      <a id="mobile_btn" className="mobile_btn" href="#sidebar">
        <i className="fa fa-bars" />
      </a>
      {/* Header Menu */}
      <ul className="nav user-menu">
        {/* Search */}
        <li className="nav-item dropdown">
          <a
            href="#"
            className="dropdown-toggle nav-link"
            data-toggle="dropdown"
          >
            <i className="fa fa-bell-o" />{' '}
            <span className="badge badge-pill badge-purple">{notifyItems?.length || 0}</span>
          </a>
          <div className="dropdown-menu notifications">
            <div className="topnav-dropdown-header">
              <span className="notification-title">Notifications</span>
              {/* <a href="" className="clear-noti">
                {' '}
                Clear All{' '}
              </a> */}
            </div>
            <div className="noti-content">
              <ul className="notification-list">
                {notifyItems?.length && notifyItems?.map((n, index) => (
                  <li key={index} className="notification-message">
                    <Link
                      onClick={() => localStorage.setItem('minheight', 'true')}
                      to="/app/employees/notification"
                    >
                      <div className="media">
                        <span className="avatar">
                          {/* <img alt="" src={Avatar_03} /> */}
                        </span>
                        <div className="media-body">
                          <p className="noti-details mx-2">
                            <h6>{n?.notifyHead}</h6>
                            <span className="noti-title">{n?.notifyBody}</span>
                          </p>
                          <p className="noti-time mx-2">
                            <span className="notification-time">{n?.notifyDate?.split("T")[0]}</span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
                {/* <li className="notification-message">
                  <Link
                    onClick={() => localStorage.setItem('minheight', 'true')}
                    to="/app/employees/notification"
                  >
                    <div className="media">
                      <span className="avatar">
                        <img alt="" src={Avatar_03} />
                      </span>
                      <div className="media-body">
                        <p className="noti-details">
                          <span className="noti-title">Tarah Shropshire</span>{' '}
                          changed the task name{' '}
                          <span className="noti-title">
                            Appointment booking with payment gateway
                          </span>
                        </p>
                        <p className="noti-time">
                          <span className="notification-time">6 mins ago</span>
                        </p>
                      </div>
                    </div>
                  </Link>
                </li> */}
              </ul>
            </div>
            <div className="topnav-dropdown-footer">
              <Link
                onClick={() => localStorage.setItem('minheight', 'true')}
                to="/app/employees/notification"
              >
                View all Notifications
              </Link>
            </div>
          </div>
        </li>
        {/* /Notifications */}
        {/* Message Notifications */}
        {/* <li className="nav-item dropdown">
            <a
              href="#"
              className="dropdown-toggle nav-link"
              data-toggle="dropdown"
            >
              <i className="fa fa-comment-o" />{' '}
              <span className="badge badge-pill badge-purple">8</span>
            </a>
            <div className="dropdown-menu notifications">
              <div className="topnav-dropdown-header">
                <span className="notification-title">Messages</span>
                <a href="" className="clear-noti">
                  {' '}
                  Clear All{' '}
                </a>
              </div>
              <div className="noti-content">
                <ul className="notification-list">
                  <li className="notification-message">
                    <Link
                      onClick={() => localStorage.setItem('minheight', 'true')}
                      to="/conversation/chat"
                    >
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">
                            <img alt="" src={Avatar_09} />
                          </span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">
                            Bhupesh Audichya
                          </span>
                          <span className="message-time">12:28 AM</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li className="notification-message">
                    <Link
                      onClick={() => localStorage.setItem('minheight', 'true')}
                      to="/conversation/chat"
                    >
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">
                            <img alt="" src={Avatar_02} />
                          </span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">Prateek Tiwari</span>
                          <span className="message-time">6 Mar</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li className="notification-message">
                    <Link
                      onClick={() => localStorage.setItem('minheight', 'true')}
                      to="/conversation/chat"
                    >
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">
                            <img alt="" src={Avatar_03} />
                          </span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">
                            {' '}
                            Tarah Shropshire{' '}
                          </span>
                          <span className="message-time">5 Mar</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li className="notification-message">
                    <Link
                      onClick={() => localStorage.setItem('minheight', 'true')}
                      to="/conversation/chat"
                    >
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">
                            <img alt="" src={Avatar_05} />
                          </span>
                        </div>
                        <div className="list-body">
                          <span className="message-author">Jeet Khatri</span>
                          <span className="message-time">3 Mar</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li className="notification-message">
                    <Link
                      onClick={() => localStorage.setItem('minheight', 'true')}
                      to="/conversation/chat"
                    >
                      <div className="list-item">
                        <div className="list-left">
                          <span className="avatar">
                            <img alt="" src={Avatar_08} />
                          </span>
                        </div>
                        <div className="list-body">
                          <span className="message-author"> Chinki Singh </span>
                          <span className="message-time">27 Feb</span>
                          <div className="clearfix" />
                          <span className="message-content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="topnav-dropdown-footer">
                <Link
                  onClick={() => localStorage.setItem('minheight', 'true')}
                  to="/conversation/chat"
                >
                  View all Messages
                </Link>
              </div>
            </div>
          </li> */}
        {/* /Message Notifications */}
        <li className="nav-item dropdown has-arrow main-drop">
          <a
            href="#"
            className="dropdown-toggle nav-link"
            data-toggle="dropdown"
          >

            <span className="user-img">
              {/* <img src={Avatar_03} alt="" />
              
              <span className="status online" /> */}
              {/* {user?.fileInfoPic[0]?.filePath ? <span>
                <img src={user?.fileInfoPic[0]?.filePath} alt="" />
                <span className="status online" /> </span>  :<span>
                <img src={Avatar_03} alt="" />
                <span className="status online" /> 
                </span>} */}
              {/* <img src={user?.fileInfoPic[0]?.filePath} alt="" /> */}

            </span>
            <span>{user?.firstName}</span>
          </a>
          <div className="dropdown-menu">
            <Link
              className="dropdown-item"
              to={`/app/profile/employee-profile/${user?._id}`}
            >
              My Profile
            </Link>
            {isAdmin &&
              <Link className="dropdown-item" to="/settings/">
                Settings
              </Link>
            }
            <Link onClick={handleLogout} className="dropdown-item" to="/login">
              Logout
            </Link>
          </div>
        </li>
      </ul>
      {/* /Header Menu */}
      {/* Mobile Menu */}
      <div className="dropdown mobile-user-menu">
        <a
          href="#"
          className="nav-link dropdown-toggle"
          data-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="fa fa-ellipsis-v" />
        </a>
        <div className="dropdown-menu dropdown-menu-right">
          {/* <Link className="dropdown-item" to="/app/profile/employee-profile"> */}
          <Link
            className="dropdown-item"
            to={`/app/profile/employee-profile/${user?._id}`}
          >
            My Profile
          </Link>
          {isAdmin &&

            <Link className="dropdown-item" to="/settings/companysetting">
              Settings
            </Link>
          }
          <Link onClick={handleLogout} className="dropdown-item" to="/login">
            Logout
          </Link>
        </div>
      </div>
      {/* /Mobile Menu */}
    </div>
  );
};
// }

export default withRouter(Header);
