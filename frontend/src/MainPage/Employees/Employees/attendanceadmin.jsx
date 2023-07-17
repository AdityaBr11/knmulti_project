import React, { useEffect, useState, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { allemployee, fetchAttendance, fetchLeaves, getEmployee } from '../../../lib/api';
import { MONTHS } from '../../../model/shared/months';
import { YEARS } from '../../../model/shared/years';
import AttendanceTable from './AttendanceTable';
import Autocomplete from 'react-autocomplete';
import FilteredAttendanceEmployeeTable from './FilteredAttendanceEmployeeTable';
import { daysInMonth, filterAttendance } from '../../../misc/helpers';
// import { TOTAL_LEAVES } from '../../../misc/constants'; 
import { AttendanceTableContext } from './index';

const AttendanceAdmin = () => {
  const { filteredAttendanceState, setFilteredAttendanceState } = useContext(
    AttendanceTableContext
  );
  const [employeeList, setEmployeeList] = useState([]);
  const [filterQueries, setFilterQueries] = useState({
    name: '',
    date: null,
    month: null,
    year: null,
  });
  // const [filteredByNameList, setFilteredByNameList] = useState([]);
  const [filteredByNameEmployee, setFilteredByNameEmployee] = useState(null);
  const [filterQueries2, setFilterQueries2] = useState({
    month: { value: new Date().getMonth() },
    year: { value: new Date().getFullYear() },
  });
  const [totalLeaves, setTotalLeaves] = useState([]);
  const [TOTAL_LEAVES, setTOTAL_LEAVES] = useState();
  console.log(totalLeaves, 'totalsmallcase');
  console.log(TOTAL_LEAVES, 'totalbigcase');

  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }
  }, []);

  useEffect(async () => {
    const res = await allemployee();
    setEmployeeList(res);
  }, []);

  const DAYS = (() => {
    let days = [];
    for (
      let i = 0;
      i <
      daysInMonth(filterQueries2?.month?.value, filterQueries2?.year?.value);
      i++
    ) {
      days.push(i + 1);
    }
    return days;
  })();

  //get sundays dates
  let d = new Date(filterQueries2?.year?.value, filterQueries2?.month?.value + 1, 0);
  let sun = [];
  for (var i = 1; i <= DAYS.length; i++) {
    //looping through days in month
    let newDate = new Date(d.getFullYear(), d.getMonth(), i);
    if (newDate.getDay() == 0) {
      //if Sunday
      sun.push(i);
    }
  }
  //end

  const onFilterClick = async (e) => {
    if (filteredAttendanceState?.fId) {
      // setFilteredByNameList([
      //   ...employeeList.filter((emp) => emp?.userName === filterQueries?.name),
      // ]);
      const emp =
        employeeList.filter((emp) =>
          emp?.firstName
            .toLowerCase()
            .includes(filteredAttendanceState?.fId.toLowerCase())
        )[0] || null;
      const res = await fetchAttendance(emp?._id);
      const resEmployeeById = await getEmployee(emp?._id);
      setTOTAL_LEAVES(resEmployeeById?.totalLeaves);
      const res22 = await fetchAttendance();
      setFilteredByNameEmployee(filterAttendance(res, filterQueries2));
      const res2 = await fetchLeaves(emp?._id);
      setTotalLeaves(res2);
    } else return;
  };

  const setFalse = () => {
    setFilteredAttendanceState({ ...filteredAttendanceState, state: false });
  };

  if (filteredAttendanceState?.state === true) {
    onFilterClick();
    setFalse();
  } else {
    console.log('state chnaged to false');
  }
  console.log(employeeList, 'employeeList');

  let days2 = DAYS
  let modifiedArr = [];
  for (let i = 0; i < sun.length; i++) {
    var newArr = days2.map((element, index) => {
      if (element === sun[i]) {
        return 'SUN';
      }
      return element;
    });
    modifiedArr = newArr;
    days2 = modifiedArr;
  }
  console.log(days2, 'days2');
  console.log(newArr, 'newArr');
  console.log(totalLeaves, 'total leaves');
  console.log(filterQueries, 'filterQueries leaves');


  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Attendance </title>
        <meta name="description" content="Login page" />
      </Helmet>
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col-sm-12">
              <h3 className="page-title">Attendance</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Attendance</li>
              </ul>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        {/* Leave Statistics */}
        {filteredByNameEmployee && (
          <div className="row">
            <div className="col-md-3">
              <div className="stats-info">
                <h6>Present</h6>
                <h4>
                  {filteredByNameEmployee?.length} /{' '}
                  {daysInMonth(
                    filterQueries2?.month?.value,
                    filterQueries2?.year?.value
                  ) - sun.length}
                </h4>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stats-info">
                <h6>Absent</h6>
                <h4>
                  {(daysInMonth(
                    filterQueries2?.month?.value,
                    filterQueries2?.year?.value
                  ) - sun.length) - filteredByNameEmployee?.length}
                </h4>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stats-info">
                <h6>Leaves</h6>
                <h4>
                  {totalLeaves?.length} <span>applied</span>
                </h4>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stats-info">
                <h6>Remaining Leaves</h6>
                <h4>
                  {TOTAL_LEAVES - totalLeaves?.length > 0
                    ? TOTAL_LEAVES - totalLeaves?.length
                    : 0}
                </h4>
              </div>
            </div>
          </div>
        )}
        {/* /Leave Statistics */}
        {/* Search Filter */}
        <div className="row filter-row">
          <div className="col-sm-6 col-md-3">
            <div className="form-group form-focus focused">
              <input
                type="text"
                value={filterQueries.name}
                className="form-control floating"
                onChange={(e) =>
                  setFilterQueries({ ...filterQueries, name: e.target.value })
                }
              />
              <label className="focus-label">Employee Name</label>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="form-group form-focus focused text-left">
              <a
                className="btn form-control btn-white dropdown-toggle"
                href="#"
                data-toggle="dropdown"
                aria-expanded="false"
              >
                {filterQueries?.month?.name || 'Month'}
              </a>
              <div className="dropdown-menu dropdown-menu-right">
                {MONTHS.filter((month) => {
                  return month.value <= 11;
                })?.map((month, index) => (
                  <span
                    key={index}
                    className="dropdown-item"
                    onClick={() => {
                      setFilterQueries({
                        ...filterQueries,
                        month: month,
                      });
                      setFilterQueries2({
                        ...filterQueries2,
                        month: month,
                      });
                      filteredByNameEmployee &&
                        setFilteredAttendanceState({
                          ...filteredAttendanceState,
                          state: true,
                        });
                    }}
                  >
                    {month?.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="form-group form-focus select-focus">
              <a
                className="btn form-control btn-white dropdown-toggle"
                href="#"
                data-toggle="dropdown"
                aria-expanded="false"
              >
                {filterQueries?.year?.name || 'Year'}
              </a>
              <div className="dropdown-menu dropdown-menu-right">
                {YEARS?.map((year, index) => (
                  <span
                    key={index}
                    className="dropdown-item"
                    onClick={() => {
                      setFilterQueries({
                        ...filterQueries,
                        year: year,
                      });
                      setFilterQueries2({
                        ...filterQueries2,
                        year: year,
                      });
                      filteredByNameEmployee &&
                        setFilteredAttendanceState({
                          ...filteredAttendanceState,
                          state: true,
                        });
                    }}
                  >
                    <i className="fa" /> {year?.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <btn
              className="btn btn-danger btn-block"
              onClick={() =>
                setFilterQueries({
                  ...filterQueries,
                  name: '',
                  date: null,
                  month: null,
                  year: null,

                })

              }
            >
              {' '}
              Reset{' '}
            </btn>
          </div>
        </div>
        {/* /Search Filter */}
        <div className="row">
          <div className="col-sm-12 mb-3">
            <span>
              <span
                className="text text-primary"
                style={{ fontSize: '20px', fontWeight: 'bolder' }}
              >
                Month :{' '}
                {/* {new Date().getMonth()} */}
              </span>
              {'  '}
              <span
                className="ml-1"
                style={{ fontSize: '18px', fontWeight: 'bolder' }}
              >
                {filterQueries?.month?.name ||
                  MONTHS.filter(
                    (month) => month.value === parseInt((new Date().getMonth()))
                  )[0].name}
              </span>
            </span>{' '}
            <span className="ml-4">
              <span
                className="text text-primary"
                style={{ fontSize: '20px', fontWeight: 'bolder' }}
              >
                Year :{' '}
              </span>
              {'  '}
              <span
                className="ml-1"
                style={{ fontSize: '18px', fontWeight: 'bolder' }}
              >
                {filterQueries?.year?.name ||
                  YEARS.filter(
                    (year) => year.value === parseInt(new Date().getFullYear())
                  )[0].name}
              </span>
            </span>{' '}
          </div>
          <div className="col-lg-12">
            <div className="table-responsive">
              {filteredByNameEmployee ? (
                <FilteredAttendanceEmployeeTable
                  data={filteredByNameEmployee}
                />
              ) : (
                <>
                  <table className="table table-striped custom-table table-nowrap mb-0">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        {days2.map((day, index) => {
                          return (
                            <>
                              <th
                                key={index}
                                style={{
                                  backgroundColor:
                                    day === 'SUN' ? 'yellow' : ' ',
                                }}
                              >
                                {day}
                              </th>
                            </>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {filterQueries ? (
                        employeeList
                          ?.filter((emp) => {
                            if (filterQueries.name == '') {
                              return emp;
                            } else if (
                              emp.firstName
                                .toLowerCase()
                                .includes(filterQueries.name.toLowerCase())
                            ) {
                              return emp;
                            }
                          })
                          .map((emp) => (
                            <AttendanceTable
                              employee={emp}
                              filterQueries={filterQueries}
                            />
                          ))
                      ) : (
                        <></>
                      )}
                      {/* filteredByNameList?.map((emp) => (
                        <AttendanceTable
                          employee={emp}
                          filterQueries={filterQueries}
                        />
                      )) */}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
    </div>
  );
};

export default AttendanceAdmin;
