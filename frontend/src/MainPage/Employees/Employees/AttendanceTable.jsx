import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { fetchAttendance } from '../../../lib/api';
import { MIN_WORKING_HOURS } from '../../../misc/constants';
import { daysInMonth } from '../../../misc/helpers';
import AttendanceModal from './AttendanceModal';
import { AttendanceTableContext } from './index';

const attendanceFormatter = (
  month = new Date().getMonth(),
  year = new Date().getFullYear(),
  attendanceList
) => {
  // if (month && year) {
  console.log(attendanceList, 'attendanceList')
  if (year) {
    let resArr = [];
    let newList = attendanceList.filter((a, index) => {
      const date = new Date(a.date);
      if (date.getMonth() === month && date.getFullYear() === year) {
        // return date.getDate();
        return a;
      }
    });
    // newList = newList.map((element) => new Date(element?.date).getDate());
    let dateList = newList.map((element) => new Date(element?.date).getDate());
    for (let index = 1; index <= daysInMonth(month, year); index++) {
      if (dateList.includes(index)) {
        // resArr.push(1);
        resArr.push({
          date: new Date(year, month, index),
          timesheet: newList.filter(
            (element) => new Date(element?.date).getDate() === index
          )[0],
          isPresent: true,
        });
      } else {
        resArr.push({
          date: new Date(year, month, index),
          timesheet: null,
          isPresent: false,
        });
      }
    }
    return resArr;
  }
  return new Array(daysInMonth(month, year)).fill(0);
};

const AttendanceTable = ({ employee, filterQueries }) => {
  const { attendanceState, setFilteredAttendanceState, filteredAttendanceState } = useContext(AttendanceTableContext);

  const [attendance, setAttendance] = useState([]);
  const [data, setData] = useState({
    date: null,
    timesheet: null,
    isPresent: null,
  });

  useEffect(() => {
    let isApiSubscribed = true;
    fetchAttendance(employee?._id).then((res) => {
      if (isApiSubscribed) setAttendance(res);
    });
    // setAttendance(res);
    return () => {
      isApiSubscribed = false;
    };
  }, [attendanceState, employee?._id]);

  // var startdate = employee?.joinDate?.split('-').startdate[1];
  // const month = startdate[1];
  // const year = startdate[0];
  // console.log(startdate, 'Employee ', employee?.joinDate, ' Attendance = ', attendance);

  // console.log(attendanceFormatter(1, 2023, attendance), 'sssssss'); //month - april, year - 2022

  return (
    <>
      <tr>
        <td>
          <h2 className="table-avatar">
            <Link
              className="avatar avatar-xs"
              to={`/app/profile/employee-profile/${employee?._id}`}
            >
              <img alt="" src="" />
            </Link>
            <a onClick={() => setFilteredAttendanceState({
              ...filteredAttendanceState,
              state: true, fId: employee?.firstName
            })} >
              {employee?.firstName} {employee?.lastName} [{employee?._id}]
            </a>
          </h2>
        </td>

        {attendanceFormatter(
          filterQueries?.month?.value,
          filterQueries?.year?.value,
          attendance
        ).map((a) => (
          <td>
            {/* {a} */}
            {a.isPresent ? (
              <a
                href=""
                data-toggle={a ? 'modal' : ''}
                data-target={a ? '#attendance_info' : ''}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                }}
              >
                <i
                  className="fa fa-check text-success"
                  onClick={() => {
                    if (!a)
                      setData({
                        date: null,
                        timesheet: null,
                        isPresent: null,
                      });
                    setData(a);
                  }}
                />
                {a?.timesheet?.hours <= MIN_WORKING_HOURS && (
                  <i
                    className="fa fa-close text-danger"
                    onClick={() => {
                      if (!a)
                        setData({
                          date: null,
                          timesheet: null,
                          isPresent: null,
                        });
                      setData(a);
                    }}
                  />
                )}
              </a>
            ) : (
              <a
                href="#attendance_info"

                data-toggle={a ? 'modal' : 'modal'}
                data-target={a ? '#attendance_info' : '#attendance_info'}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                }}
                attendanceFormatter
              >
                <i
                  className="fa fa-close text-danger"
                  onClick={() => {
                    if (!a)
                      setData({
                        date: null,
                        timesheet: null,
                        isPresent: null,
                      });
                    setData(a);
                  }}
                />
              </a>
            )}
          </td>
        ))}
      </tr>
      {data?.date && (
        <AttendanceModal
          data={data}
          timesheet={data?.timesheet}
          setData={setData}
          employeeId={employee?._id}
        />
      )}
    </>
  );
};

export default AttendanceTable;
