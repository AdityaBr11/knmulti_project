import React, { useState } from 'react';
import { useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import httpService from '../../lib/httpService';

const AllStatus = () => {
  const [prospectList, setprospectList] = useState([]);
  const [siteVisitList, setsiteVisitList] = useState([]);
  const [discussionList, setdiscussionList] = useState([]);
  const [negotiationsList, setnegotiationsList] = useState([]);
  const [wonList, setwonList] = useState([]);
  const [lostList, setlostList] = useState([]);
  const [bookingList, setbookingList] = useState([]);
  const [registrationList, setregistrationList] = useState([]);

  const fetchAllStatus = async () => {
    const { data } = await httpService.get('/project/allstatus');
    console.log(data);

    const prospect = await data.filter((d) => d?.leadType == 'New Lead');
    setprospectList(prospect);
    // const id = prospect[0].customer.cId;
    // const res = await httpService.get('/customer/' + id);
    // console.log(res, 'res');
    // console.log(res.data.phone);
    const siteVisit = await data.filter((d) => d?.leadType == 'Site Visit');
    setsiteVisitList(siteVisit);
    const discussion = await data.filter((d) => d?.leadType == 'Discussion');
    setdiscussionList(discussion);
    const negotiations = await data.filter(
      (d) => d?.leadType == 'Negotiations'
    );
    setnegotiationsList(negotiations);
    const won = await data.filter((d) => d?.leadType == 'Won');
    setwonList(won);
    const lost = await data.filter((d) => d?.leadType == 'Lost');
    setlostList(lost);
    const booking = await data.filter((d) => d?.leadType == 'Booking');
    setbookingList(booking);
    const registration = await data.filter(
      (d) => d?.leadType == 'Registration'
    );
    setregistrationList(registration);
  };

  useEffect(() => {
    fetchAllStatus();
  }, []);

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>All Status</title>
        <meta name="description" content="All Status" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Status</h3>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, minmax(350px, 1fr))',
          gap: 5,
          overflow: 'auto',
          paddingTop: '20px',
          paddingBottom: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '400px'
          }}
          key={1}
        >
          <h4
            style={{
              fontWeight: 600,
              color: '#8a27b3',
              fontSize: '23px',
            }}
          >
            Prospect
          </h4>
          <div style={{ margin: 8 }}>
            {prospectList.map((data) => {
              return (
                <>
                  <div className="col-sm-12">
                    <div
                      style={{
                        padding: '2px 0px',
                        background: 'rgb(2,0,36)',
                        background:
                          'radial-gradient(circle, #4e54c8 0%,#8f94fb 100%)',
                        borderRadius: '5px',
                      }}
                    ></div>
                    <div className="card text-center">
                      <div
                        className="card-body"
                        style={{
                          boxShadow:
                            'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
                        }}
                      >
                        {data?.isCustomer ? (
                          <h5
                            className="card-title text-danger"
                            style={{
                              color: '#8a27b3',
                            }}
                          >
                            <span
                              style={{
                                color: '#8a27b3',
                              }}
                            >
                              <i
                                className="fa fa-area-chart"
                                aria-hidden="true"
                              ></i>
                            </span>{' '}
                            <Link
                              to={`/app/profile/customer-profile/${data?.customer?.cId}`}
                            >
                              <span style={{ color: '#8a27b3' }}>
                                {' '}
                                {data?.customer?.name}{' '}
                              </span>
                            </Link>
                          </h5>
                        ) : (
                          <h5
                            className="card-title"
                            style={{ color: '#8a27b3' }}
                          >
                            <span
                              style={{
                                color: '#8a27b3',
                              }}
                            >
                              <i
                                className="fa fa-area-chart"
                                aria-hidden="true"
                              ></i>
                            </span>{' '}
                            <Link
                              to={`/app/profile/lead-profile/${data?.lead?.lId}`}
                            >
                              {data?.lead?.name}
                            </Link>
                          </h5>
                        )}
                        <p className="card-text" style={{ fontSize: '15px' }}>
                          <Link
                            style={{ color: '#8a27b3' }}
                            to={`/app/projects/projects-view/${data?.projectData?.pId}`}
                          >
                            {data?.projectData?.pName}
                          </Link>{' '}
                          : {data?.projectData?.pType} /{' '}
                          {data?.projectData?.pSubType}
                        </p>
                        <p className="card-text" style={{ fontSize: '15px' }}>
                          {data?.subPlot?.spName} &nbsp;|&nbsp;
                          {data?.subPlot?.spArea} &nbsp;|&nbsp; ₹
                          {data?.subPlot?.cost}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          key={2}
        >
          <h4
            style={{
              fontWeight: 600,
              color: '#F37335',
            }}
          >
            Site Visit
          </h4>
          <div style={{ margin: 8 }}>
            {siteVisitList.map((data) => {
              return (
                <>
                  <div className="col-sm-12">
                    <div
                      style={{
                        padding: '2px 0px',
                        background: 'rgb(2,0,36)',
                        background:
                          'radial-gradient(circle, #FDC830 0%,  #F37335 100%)',
                        borderRadius: '5px',
                      }}
                    ></div>
                    <div className="card text-center">
                      <div
                        className="card-body"
                        style={{
                          boxShadow:
                            'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
                        }}
                      >
                        {data?.isCustomer ? (
                          <h5 className="card-title">
                            <span style={{ color: '#F37335' }}>
                              <i className="fa fa-eye" aria-hidden="true"></i>
                            </span>{' '}
                            <Link
                              to={`/app/profile/customer-profile/${data?.customer?.cId}`}
                            >
                              <span style={{ color: '#F37335' }}>
                                {data?.customer?.name}
                              </span>
                            </Link>
                          </h5>
                        ) : (
                          <h5 className="card-title">
                            <Link
                              to={`/app/profile/lead-profile/${data?.lead?.lId}`}
                            >
                              {data?.lead?.name}
                            </Link>
                          </h5>
                        )}
                        <p className="card-text">
                          <Link
                            style={{ color: '#F37335' }}
                            to={`/app/projects/projects-view/${data?.projectData?.pId}`}
                          >
                            {data?.projectData?.pName}
                          </Link>{' '}
                          : {data?.projectData?.pType} /{' '}
                          {data?.projectData?.pSubType}
                        </p>
                        <p className="card-text">
                          {data?.subPlot?.spName} &nbsp;|&nbsp;{' '}
                          {data?.subPlot?.spArea} &nbsp;|&nbsp; ₹{' '}
                          {data?.subPlot?.cost}
                        </p>
                        {/* <span
                          style={{
                            marginRight: '15px',
                          }}
                        >
                          <a href="tel:+" style={{ color: 'black' }}>
                            <i className="fa fa-phone fa-lg"></i>
                          </a>
                        </span>
                        <span style={{ marginLeft: '15px' }}>
                          <a href="mailto:" style={{ color: 'black' }}>
                            <i className="fa fa-envelope-o fa-lg"></i>
                          </a>
                        </span> */}
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          key={3}
        >
          <h4
            style={{
              fontWeight: 600,
              color: '#292E49',
            }}
          >
            Discussion
          </h4>
          <div style={{ margin: 8 }}>
            {discussionList.map((data) => {
              return (
                <>
                  <div className="col-sm-12">
                    <div
                      style={{
                        padding: '2px 0px',
                        background: 'rgb(2,0,36)',
                        background:
                          'radial-gradient(circle, #1F1C2C 0%,  #928DAB 100%)',
                        borderRadius: '5px',
                      }}
                    ></div>
                    <div className="card text-center">
                      <div
                        className="card-body"
                        style={{
                          boxShadow:
                            'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
                        }}
                      >
                        {data?.isCustomer ? (
                          <h5 className="card-title">
                            <span style={{ color: '#292E49' }}>
                              <i className="fa fa-users" aria-hidden="true"></i>
                            </span>{' '}
                            <Link
                              to={`/app/profile/customer-profile/${data?.customer?.cId}`}
                            >
                              <span style={{ color: '#292E49' }}>
                                {data?.customer?.name}
                              </span>
                            </Link>
                          </h5>
                        ) : (
                          <h5 className="card-title">
                            <Link
                              to={`/app/profile/lead-profile/${data?.lead?.lId}`}
                            >
                              {data?.lead?.name}
                            </Link>
                          </h5>
                        )}
                        <p className="card-text">
                          <Link
                            style={{ color: '#292E49' }}
                            to={`/app/projects/projects-view/${data?.projectData?.pId}`}
                          >
                            {data?.projectData?.pName}
                          </Link>{' '}
                          : {data?.projectData?.pType} /{' '}
                          {data?.projectData?.pSubType}
                        </p>
                        <p className="card-text">
                          {data?.subPlot?.spName} &nbsp;|&nbsp;{' '}
                          {data?.subPlot?.spArea} &nbsp;|&nbsp; ₹{' '}
                          {data?.subPlot?.cost}
                        </p>
                        {/* <span
                          style={{
                            marginRight: '15px',
                          }}
                        >
                          <a href="tel:+" style={{ color: 'black' }}>
                            <i className="fa fa-phone fa-lg"></i>
                          </a>
                        </span>
                        <span style={{ marginLeft: '15px' }}>
                          <a href="mailto:" style={{ color: 'black' }}>
                            <i className="fa fa-envelope-o fa-lg"></i>
                          </a>
                        </span> */}
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          key={4}
        >
          <h4
            style={{
              fontWeight: 600,
              color: '#E100FF',
            }}
          >
            Negotiations
          </h4>
          <div style={{ margin: 8 }}>
            {negotiationsList.map((data) => {
              return (
                <>
                  <div className="col-sm-12">
                    <div
                      style={{
                        padding: '2px 0px',
                        background: 'rgb(2,0,36)',
                        background:
                          'radial-gradient(circle, #7F00FF 0%, #E100FF 100%)',
                        borderRadius: '5px',
                      }}
                    ></div>
                    <div className="card text-center">
                      <div
                        className="card-body"
                        style={{
                          boxShadow:
                            'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
                        }}
                      >
                        {data?.isCustomer ? (
                          <h5 className="card-title">
                            <span style={{ color: '#1F1C2C' }}>
                              <i className="fa fa-phone" aria-hidden="true"></i>
                            </span>{' '}
                            <Link
                              to={`/app/profile/customer-profile/${data?.customer?.cId}`}
                            >
                              <span style={{ color: '#1F1C2C' }}>
                                {data?.customer?.name}
                              </span>
                            </Link>
                          </h5>
                        ) : (
                          <h5 className="card-title">
                            <Link
                              to={`/app/profile/lead-profile/${data?.lead?.lId}`}
                            >
                              {data?.lead?.name}
                            </Link>
                          </h5>
                        )}
                        <p className="card-text">
                          <Link
                            style={{ color: '#1F1C2C' }}
                            to={`/app/projects/projects-view/${data?.projectData?.pId}`}
                          >
                            {data?.projectData?.pName}
                          </Link>{' '}
                          : {data?.projectData?.pType} /{' '}
                          {data?.projectData?.pSubType}
                        </p>
                        <p className="card-text">
                          {data?.subPlot?.spName}&nbsp;|&nbsp;{' '}
                          {data?.subPlot?.spArea}&nbsp;|&nbsp; ₹{' '}
                          {data?.subPlot?.cost}
                        </p>
                        {/* <span
                          style={{
                            marginRight: '15px',
                          }}
                        >
                          <a href="tel:+" style={{ color: 'black' }}>
                            <i className="fa fa-phone fa-lg"></i>
                          </a>
                        </span>
                        <span style={{ marginLeft: '15px' }}>
                          <a href="mailto:" style={{ color: 'black' }}>
                            <i className="fa fa-envelope-o fa-lg"></i>
                          </a>
                        </span> */}
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          key={5}
        >
          <h4
            style={{
              fontWeight: 600,
              color: 'green',
            }}
          >
            Won
          </h4>
          <div style={{ margin: 8 }}>
            {wonList.map((data) => {
              return (
                <>
                  <div className="col-sm-12">
                    <div
                      style={{
                        padding: '2px 0px',
                        background: 'rgb(2,0,36)',
                        background:
                          'radial-gradient(circle, #11998e 0%, #38ef7d 100%)',
                        borderRadius: '5px',
                      }}
                    ></div>
                    <div className="card text-center">
                      <div
                        className="card-body"
                        style={{
                          boxShadow:
                            'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
                        }}
                      >
                        {data?.isCustomer ? (
                          <h5 className="card-title">
                            <span style={{ color: 'green' }}>
                              <i className="fa fa-check" aria-hidden="true"></i>
                            </span>{' '}
                            <Link
                              to={`/app/profile/customer-profile/${data?.customer?.cId}`}
                            >
                              <span style={{ color: 'green' }}>
                                {data?.customer?.name}
                              </span>
                            </Link>
                          </h5>
                        ) : (
                          <h5 className="card-title">
                            <Link
                              to={`/app/profile/lead-profile/${data?.lead?.lId}`}
                            >
                              {data?.lead?.name}
                            </Link>
                          </h5>
                        )}
                        <p className="card-text">
                          <Link
                            style={{ color: 'green' }}
                            to={`/app/projects/projects-view/${data?.projectData?.pId}`}
                          >
                            {data?.projectData?.pName}
                          </Link>{' '}
                          : {data?.projectData?.pType} /{' '}
                          {data?.projectData?.pSubType}
                        </p>
                        <p className="card-text">
                          {data?.subPlot?.spName} &nbsp;|&nbsp;{' '}
                          {data?.subPlot?.spArea} &nbsp;|&nbsp; ₹{' '}
                          {data?.subPlot?.cost}
                        </p>
                        {/* <span
                          style={{
                            marginRight: '15px',
                          }}
                        >
                          <a href="tel:+" style={{ color: 'black' }}>
                            <i className="fa fa-phone fa-lg"></i>
                          </a>
                        </span>
                        <span style={{ marginLeft: '15px' }}>
                          <a href="mailto:" style={{ color: 'black' }}>
                            <i className="fa fa-envelope-o fa-lg"></i>
                          </a>
                        </span> */}
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          key={6}
        >
          <h4
            style={{
              fontWeight: 600,
              color: '#C779D0',
            }}
          >
            Booking
          </h4>
          <div style={{ margin: 8 }}>
            {bookingList.map((data) => {
              return (
                <>
                  <div className="col-sm-12">
                    <div
                      style={{
                        padding: '2px 0px',
                        background: 'rgb(2,0,36)',
                        background:
                          'radial-gradient(circle, #FEAC5E 0%, #C779D0 35%, #4BC0C8 100%)',
                        borderRadius: '5px',
                      }}
                    ></div>
                    <div className="card text-center">
                      <div
                        className="card-body"
                        style={{
                          boxShadow:
                            'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
                        }}
                      >
                        {data?.isCustomer ? (
                          <h5 className="card-title">
                            <span style={{ color: '#C779D0' }}>
                              <i className="fa fa-book" aria-hidden="true"></i>
                            </span>{' '}
                            <Link
                              to={`/app/profile/customer-profile/${data?.customer?.cId}`}
                            >
                              <span style={{ color: '#C779D0' }}>
                                {data?.customer?.name}
                              </span>
                            </Link>
                          </h5>
                        ) : (
                          <h5 className="card-title">
                            <Link
                              to={`/app/profile/lead-profile/${data?.lead?.lId}`}
                            >
                              {data?.lead?.name}
                            </Link>
                          </h5>
                        )}
                        <p className="card-text">
                          <Link
                            style={{ color: '#C779D0' }}
                            to={`/app/projects/projects-view/${data?.projectData?.pId}`}
                          >
                            {data?.projectData?.pName}
                          </Link>{' '}
                          : {data?.projectData?.pType} /{' '}
                          {data?.projectData?.pSubType}
                        </p>
                        <p className="card-text">
                          {data?.subPlot?.spName} &nbsp;|&nbsp;{' '}
                          {data?.subPlot?.spArea} &nbsp;|&nbsp; ₹{' '}
                          {data?.subPlot?.cost}
                        </p>
                        {/* <span
                          style={{
                            marginRight: '15px',
                          }}
                        >
                          <a href="tel:+" style={{ color: 'black' }}>
                            <i className="fa fa-phone fa-lg"></i>
                          </a>
                        </span>
                        <span style={{ marginLeft: '15px' }}>
                          <a href="mailto:" style={{ color: 'black' }}>
                            <i className="fa fa-envelope-o fa-lg"></i>
                          </a>
                        </span> */}
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          key={7}
        >
          <h4
            style={{
              fontWeight: 600,
              color: '#7F7FD5',
            }}
          >
            Registration
          </h4>
          <div style={{ margin: 8 }}>
            {registrationList.map((data) => {
              return (
                <>
                  <div className="col-sm-12">
                    <div
                      style={{
                        padding: '2px 0px',
                        background: 'rgb(2,0,36)',
                        background:
                          'radial-gradient(circle, #7F7FD5 0%, #86A8E7 35%, #91EAE4 100%)',
                        borderRadius: '5px',
                      }}
                    ></div>
                    <div className="card text-center">
                      <div
                        className="card-body"
                        style={{
                          boxShadow:
                            'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
                        }}
                      >
                        {data?.isCustomer ? (
                          <h5 className="card-title">
                            <span style={{ color: '#7F7FD5' }}>
                              <i
                                className="fa fa-user-plus"
                                aria-hidden="true"
                              ></i>
                            </span>{' '}
                            <Link
                              to={`/app/profile/customer-profile/${data?.customer?.cId}`}
                            >
                              <span style={{ color: '#7F7FD5' }}>
                                {data?.customer?.name}
                              </span>
                            </Link>
                          </h5>
                        ) : (
                          <h5 className="card-title">
                            <Link
                              to={`/app/profile/lead-profile/${data?.lead?.lId}`}
                            >
                              {data?.lead?.name}
                            </Link>
                          </h5>
                        )}
                        <p className="card-text">
                          <Link
                            style={{ color: '#7F7FD5' }}
                            to={`/app/projects/projects-view/${data?.projectData?.pId}`}
                          >
                            {data?.projectData?.pName}
                          </Link>{' '}
                          : {data?.projectData?.pType} /{' '}
                          {data?.projectData?.pSubType}
                        </p>
                        <p className="card-text">
                          {data?.subPlot?.spName} &nbsp;|&nbsp;{' '}
                          {data?.subPlot?.spArea} &nbsp;|&nbsp; ₹{' '}
                          {data?.subPlot?.cost}
                        </p>
                        {/* <span
                          style={{
                            marginRight: '15px',
                          }}
                        >
                          <a href="tel:+" style={{ color: 'black' }}>
                            <i className="fa fa-phone fa-lg"></i>
                          </a>
                        </span>
                        <span style={{ marginLeft: '15px' }}>
                          <a href="mailto:" style={{ color: 'black' }}>
                            <i className="fa fa-envelope-o fa-lg"></i>
                          </a>
                        </span> */}
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          key={8}
        >
          <h4
            style={{
              fontWeight: 600,
              color: 'red',
            }}
          >
            Lost
          </h4>
          <div style={{ margin: 8 }}>
            {lostList.map((data) => {
              return (
                <>
                  <div className="col-sm-12">
                    <div
                      style={{
                        padding: '2px 0px',
                        background: 'rgb(2,0,36)',
                        background:
                          'radial-gradient(circle, #ee0979 0%, #ee0979 100%)',
                        borderRadius: '5px',
                      }}
                    ></div>
                    <div className="card text-center">
                      <div
                        className="card-body"
                        style={{
                          boxShadow:
                            'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
                        }}
                      >
                        {data?.isCustomer ? (
                          <h5 className="card-title">
                            <span style={{ color: 'red' }}>
                              <i className="fa fa-times" aria-hidden="true"></i>
                            </span>{' '}
                            <Link
                              to={`/app/profile/customer-profile/${data?.customer?.cId}`}
                            >
                              <span style={{ color: 'red' }}>
                                {data?.customer?.name}
                              </span>
                            </Link>
                          </h5>
                        ) : (
                          <h5 className="card-title">
                            <Link
                              style={{ color: 'red' }}
                              to={`/app/profile/lead-profile/${data?.lead?.lId}`}
                            >
                              {data?.lead?.name}
                            </Link>
                          </h5>
                        )}
                        <p className="card-text">
                          <Link
                            style={{ color: 'red' }}
                            to={`/app/projects/projects-view/${data?.projectData?.pId}`}
                          >
                            {data?.projectData?.pName}
                          </Link>{' '}
                          : {data?.projectData?.pType} /{' '}
                          {data?.projectData?.pSubType}
                        </p>
                        <p className="card-text">
                          {data?.subPlot?.spName} &nbsp;|&nbsp;{' '}
                          {data?.subPlot?.spArea} &nbsp;|&nbsp; ₹{' '}
                          {data?.subPlot?.cost}
                        </p>
                        {/* <span
                          style={{
                            marginRight: '15px',
                          }}
                        >
                          <a href="tel:+" style={{ color: 'black' }}>
                            <i className="fa fa-phone fa-lg"></i>
                          </a>
                        </span>
                        <span style={{ marginLeft: '15px' }}>
                          <a href="mailto:" style={{ color: 'black' }}>
                            <i className="fa fa-envelope-o fa-lg"></i>
                          </a>
                        </span> */}
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllStatus;