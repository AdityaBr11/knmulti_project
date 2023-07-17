/**
 * App Routes
 */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';
import httpService from '../../lib/httpService';
import Tasks from '../../MainPage/Employees/Projects/tasks/tasks';

// router service
import taskservice from '../../router_service/taskservice';

import Header from './header';
import SidebarContent from './tasksidebar';

const Tasklayout = (props) => {
  const authentication = useSelector((state) => state.authentication.value);
  const [projects, setProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState({});

  useEffect(() => {
    document
      .querySelector('.page-wrapper')
      .setAttribute('style', 'height: 100vh;');
    fetchProjects();
    console.log('here');
  }, []);

  const fetchProjects = async () => {
    console.log(authentication);
    const projects = await httpService.get(
      `/project?userId=${authentication.user._id}`
    );
    setProjects(projects.data);
    setSelectedProjects(projects.data[0]);
  };

  return (
    <>
      <Header />
      <Tasks selectedProjects={selectedProjects} />
      <SidebarContent
        selectedProjects={selectedProjects}
        setSelectedProjects={setSelectedProjects}
        projects={projects}
      />
    </>
  );
};
export default withRouter(Tasklayout);
