import React, { useEffect, useState, Component } from 'react';
import httpService from '../../../lib/httpService';
import { useParams } from 'react-router-dom';
import {
  Avatar_02,
  Avatar_04,
  Avatar_05,
  Avatar_07,
  Avatar_08,
  Avatar_09,
} from '../../../Entryfile/imagepath.jsx';

const EmpWeekSprint = ({id,empTask}) => {
  // const  id  = useParams();
  console.log(id,empTask,'id,tsk frm weekSprint');

  // const [empTask, setEmpTask] = useState();
  const [filterEmpTask, setFilterEmpTask] = useState([]);
  const [today, setToday] = useState([]);
  const [tomorrow, setTomorrow] = useState([]);
  const todayDate = new Date().toDateString();
  console.log(empTask, 'empTask//');
  console.log(filterEmpTask, 'filterEmpTask');
  console.log(today, 'today**');
  console.log(tomorrow, 'tomorrow**');

  // useEffect(() => {
  //   filterEmp();
  // }, []);

  const filterEmp = () => {
    empTask?.filter((e) => {
          console.log(id,'id frm filter');
          console.log(e?.id,'e?.id frm filter');
          return id === e?.id;
      }).map((e) => {
        console.log(e,'frm-map');
        setFilterEmpTask((oldArray) => [...oldArray, e]);
      });
  };

  useEffect(() => {
    filterEmp();
  }, [empTask]);

  const filterToday = (e) => {
    filterEmpTask
      ?.filter((e) => {
        if (new Date(e?.start).toDateString() === todayDate) {
          return e;
        }
      })
      .map((e) => {
        setToday((oldArray) => [...oldArray, e]);
      });
  };
  const filterTomorrow = (e) => {
    const tomorrow = new Date(todayDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    filterEmpTask
      ?.filter((e) => {
        if (new Date(e?.start).toDateString() === tomorrow.toDateString()) {
          return e;
        }
      })
      .map((e) => {
        setTomorrow((oldArray) => [...oldArray, e]);
      });
  };
  useEffect(
    (e) => {
      filterToday();
      filterTomorrow();
    },
    [filterEmpTask]
  );
  //employee task

  return (
    <div className="page-wrapper p-0 m-0">
      {/* Page Content */}
      <div className="content container-fluid">
        <div className="row">
          <div className="col-lg-8 col-md-8">
            <section className="dash-section">
              <h1 className="dash-sec-title">Today's News</h1>
              <div className="dash-sec-content">
                {today?.map((e) => (
                  <div className="dash-info-list">
                    <a href="#" className="dash-card hover-shadow">
                      <div className="dash-card-container">
                        <div className="dash-card-icon">
                          <i className="fa fa-hourglass-o" />
                        </div>
                        <div className="dash-card-content">
                          <p>{e?.title}</p>
                        </div>
                        <div className="dash-card-avatars">
                          <div className="e-avatar">
                            <img src={Avatar_09} alt="" />
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </section>
            <section className="dash-section">
              <h1 className="dash-sec-title">What's Happening Tomorrow</h1>
              <div className="dash-sec-content">
                {tomorrow?.map((e) => (
                  <div className="dash-info-list">
                    <div className="dash-card">
                      <div className="dash-card-container">
                        <div className="dash-card-icon">
                          <i className="fa fa-suitcase" />
                        </div>
                        <div className="dash-card-content">
                          <p>{e?.title}</p>
                        </div>
                        <div className="dash-card-avatars">
                          <a href="#" className="e-avatar">
                            <img src={Avatar_04} alt="" />
                          </a>
                          <a href="#" className="e-avatar">
                            <img src={Avatar_08} alt="" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section className="dash-section">
              <h1 className="dash-sec-title">Next seven days</h1>
              <div className="dash-sec-content">
                {filterEmpTask?.map((e) => (
                  <div className="dash-info-list">
                    <div className="dash-card">
                      <div className="dash-card-container">
                        <div className="dash-card-icon">
                          <i className="fa fa-suitcase" />
                        </div>
                        <div className="dash-card-content">
                          <p>{e?.title}</p>
                        </div>
                        <div className="dash-card-avatars">
                          <a href="#" className="e-avatar">
                            <img src={Avatar_04} alt="" />
                          </a>
                          <a href="#" className="e-avatar">
                            <img src={Avatar_02} alt="" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
      {/* /Page Content */}
    </div>
  );
};

export default EmpWeekSprint;
