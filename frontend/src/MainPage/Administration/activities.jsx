/**
 * Signin Firebase
 */

import { CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useHistory, useParams } from 'react-router-dom';
import httpService from '../../lib/httpService';

const Activities = () => {
  const [data, setData] = useState([]);
  const [employeeName, setEmployeeName] = useState('');
  const { id } = useParams();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      history.goBack();
    }
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const employee = await httpService.get('/employee/' + id);
    setEmployeeName(employee.data.firstName + ' ' + employee.data.lastName);
    setData(employee.data.activities);
    setIsLoading(false);
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Activities</title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      {isLoading && (
        <div
          style={{
            height: '90vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          className="content container-fluid"
        >
          <CircularProgress />
        </div>
      )}
      {!isLoading && (
        <div className="content">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <h3 className="page-title">Activities</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/app/main/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Activities</li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-md-12">
              <div className="activity">
                <div className="activity-box">
                  <ul className="activity-list">
                    {data.map((activity) => (
                      <li>
                        <div className="activity-user">
                          <Link
                            title={employeeName}
                            data-toggle="tooltip"
                            className="avatar"
                          >
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                background: '#E43F3B',
                                borderRadius: '50%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontSize: '1rem',
                                color: '#fff',
                              }}
                            >
                              {employeeName
                                .split(' ')[0]
                                .charAt(0)
                                .toUpperCase()}{' '}
                            </div>
                          </Link>
                        </div>
                        <div className="activity-content">
                          <div className="timeline-content">
                            <Link to={'/app' + activity.link} className="name">
                              {activity.activityType} :
                            </Link>{' '}
                            {activity.description}
                            <span className="time">
                              {new Date(activity.dateTime).toLocaleDateString()}{' '}
                              at{' '}
                              {new Date(activity.dateTime).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* /Page Content */}
    </div>
  );
};

export default Activities;
