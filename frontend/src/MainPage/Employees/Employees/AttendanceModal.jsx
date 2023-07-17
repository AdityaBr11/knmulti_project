import React from 'react';
import { DAILY_WORKING_HOURS } from '../../../misc/constants';
import EditAttendanceModal from './EditAttendanceModal';
import ConvertIdToTime from './ConvertIdToTime';

const AttendanceModal = ({ data, timesheet, setData, employeeId }) => {
  console.log('Data =>', data);
  let hours, sessions, _id, employee;
  if (!data) return null;
  if (!timesheet) {
    (hours = 0), (sessions = []), (_id = null), (employee = null);
  } else {
    (hours = timesheet.hours),
      (sessions = timesheet.sessions),
      (_id = timesheet._id),
      (employee = timesheet.employee);
  }
  const { date, isPresent } = data;
  console.log(date,'date from AttModal');
  // const { hours = 0, sessions = [], _id = null, employee = null } = timesheet;
  // hours ||= 0;

  const dateObj = new Date(date);

  return (
    <>
      {/* Attendance Modal */}
      <div
        className="modal custom-modal fade"
        id="attendance_info"
        role="dialog"
        data-backdrop="static"
        data-keyboard={false}
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Attendance Info</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => setData(null)}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="card punch-status">
                    <div className="card-body">
                      <h5 className="card-title">
                        Timesheet{' '}
                        <small className="text-muted">
                          {new Date(date).toLocaleDateString() ||
                            new Date().toLocaleDateString()}
                        </small>
                      </h5>
                      <div className="punch-det">
                        <h6>Punch In at</h6>
                        <p>
                          {timesheet
                            ? (new Date(date).toLocaleDateString().concat(", " + new Date(sessions[0]?.from).toLocaleTimeString()))
                            : '-'}
                        </p>
                      </div>
                      <div className="punch-info">
                        <div className="punch-hours">
                          <span>{Number(hours).toFixed(3) || 0.0} hrs</span>
                        </div>
                      </div>
                      <div className="punch-det">
                        <h6>Punch Out at</h6>
                        <p>
                          {timesheet
                            ? (new Date(date).toLocaleDateString().concat(", " + new Date(sessions[0]?.upto).toLocaleTimeString()))
                            : '-'}
                        </p>
                      </div>
                      <div className="statistics">
                        <div className="row">
                          <div className="col-md-6 col-6 text-center">
                            <div className="stats-box">
                              <p>Break</p>
                              <h6>
                                {DAILY_WORKING_HOURS -
                                  Number(hours).toFixed(3) >
                                0
                                  ? (
                                      DAILY_WORKING_HOURS -
                                      Number(hours).toFixed(3)
                                    ).toFixed(3)
                                  : 0}{' '}
                                hrs
                              </h6>
                            </div>
                          </div>
                          <div className="col-md-6 col-6 text-center">
                            <div className="stats-box">
                              <p>Overtime</p>
                              <h6>
                                {DAILY_WORKING_HOURS -
                                  Number(hours).toFixed(3) <
                                0
                                  ? Math.abs(
                                      DAILY_WORKING_HOURS -
                                        Number(hours).toFixed(3)
                                    ).toFixed(3)
                                  : 0}{' '}
                                hrs
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card recent-activity">
                    <div className="card-body">
                      <h5 className="card-title">History</h5>
                      <ul className="res-activity-list">
                        {timesheet?.description?.map((session) => {
                          console.log(session,'session from-AttModal');
                          const reasonId = session._id;
                          if (session) {
                            return (
                              <>
                                <li>
                                <p className="mb-0">User&nbsp; : &nbsp; &nbsp;
                                {session?.loggedUser ? session?.loggedUser : 'N/A'}
                                </p>
                                  <p className="mb-0">Reason :</p>
                                {session.description}
                                <p className="mb-0">Edited At :</p>
                                  <p className="res-activity-time">
                                    <i className="fa fa-clock-o" />{' '}
                                    {ConvertIdToTime(`${reasonId}`).toLocaleDateString()},
                                    {' '}
                                    {ConvertIdToTime(`${reasonId}`).toLocaleTimeString()}
                                  </p>
                                </li>
                              </>
                            );
                          } else {
                            return (
                              <li>
                                <p className="mb-0">no Data available</p>
                                <p className="res-activity-time">
                                  <i className="fa fa-clock-o" />{' '}
                                  {new Date(session?.from).toLocaleTimeString()}
                                </p>
                              </li>
                            );
                          }
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* test */}
            <div className="modal-footer">
              {/* <a >Edit</a> */}
              <a
                href=""
                className="btn btn-primary"
                data-target="#edit-attendance"
                data-toggle="modal"
                data-dismiss="modal"
              >
                Edit
              </a>
            </div>
            {/* test */}
          </div>
        </div>
      </div>
      {/* /Attendance Modal */}
      <EditAttendanceModal
        date={date}
        timesheet={timesheet}
        employeeId={employeeId}
        setData={setData}
      />
    </>
  );
};

export default AttendanceModal;
