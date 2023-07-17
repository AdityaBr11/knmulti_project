/**
 * Crm Routes
 */
/* eslint-disable */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Admindashboard from './admindashboard';
import Employeedashboard from './employeedashboard';

const DashboardRoute = () => {
  const authentication = useSelector((state) => state.authentication.value);
  const isAdmin =
    !authentication?.user?.jobRole?.authorities.includes('EMPLOYEE');

  return (
    <>
      {isAdmin && <Admindashboard isAdmin={isAdmin} />}
      {!isAdmin && <Employeedashboard isAdmin={isAdmin} />}
    </>
  );
};

export default DashboardRoute;
