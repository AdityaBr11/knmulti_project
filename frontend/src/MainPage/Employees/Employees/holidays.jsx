import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  appendHolidayStore,
  setFetched,
  setHolidayStore,
} from '../../../features/holiday/holidaySlice';
import httpService from '../../../lib/httpService';
import { useAuthority } from '../../../hooks';
import { fetchholiday } from '../../../lib/api';
import { addholiday } from '../../../lib/api';

const Holidays = () => {
  const [data, setData] = React.useState([]);
  const [date, setDate] = useState('');
  const [holidayName, setHolidayName] = useState('');
  const [holiday, setHoliday] = useState([]);
  const [holidayToModify, setHolidayToModify] = React.useState(null);

  useEffect(() => {
    (async () => {
      const res = await fetchholiday();
      setHoliday(res);
    })();
  }, []);

  const handleAddHoliday = async () => {
    console.log(date);
    console.log(holidayName);
    const data = {
      title: holidayName,
      date: date,
    };
    const res = await addholiday(data);
    setHoliday((p) => [...p, res]);
    console.log(res);
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  };

  const handleDelete = async () => {
    const res = await httpService.delete(`/holiday/${holidayToModify._id}`);
    const i = holiday.findIndex((e) => e._id === holidayToModify._id);
    setHoliday((p) => [...p.slice(0, i), ...p.slice(i + 1)]);
    document.querySelectorAll('.cancel-btn')?.forEach((e) => e.click());
  };

  const handleEdit = async () => {
    console.log(holidayToModify);
    const res = await httpService.put(`/holiday/${holidayToModify._id}`, {
      title: holidayToModify.title,
      date: holidayToModify.date,
    });
    const i = holiday.findIndex((e) => e._id === holidayToModify._id);
    setHoliday((p) => [...p.slice(0, i), holidayToModify, ...p.slice(i + 1)]);
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Holidays </title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Holidays</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Holidays</li>
              </ul>
            </div>

            <div className="col-auto float-right ml-auto">
              <a
                href="#"
                className="btn add-btn"
                data-toggle="modal"
                data-target="#add_holiday"
              >
                <i className="fa fa-plus" /> Add Holiday
              </a>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive">
              <table className="table table-striped custom-table mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title </th>
                    <th>Holiday Date</th>
                    <th>Day</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {holiday?.map((holidays, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{holidays.title}</td>
                      <td>{new Date(holidays.date).toLocaleDateString()}</td>
                      <td>
                        {new Date(holidays.date).toLocaleString('en-us', {
                          weekday: 'long',
                        })}
                      </td>
                      <td className="text-right">
                        <div className="dropdown dropdown-action">
                          <a
                            href="#"
                            className="action-icon dropdown-toggle"
                            data-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="material-icons">more_vert</i>
                          </a>
                          <div className="dropdown-menu dropdown-menu-right">
                            <a
                              className="dropdown-item"
                              href="#"
                              data-toggle="modal"
                              data-target="#edit_holiday"
                              onClick={(e) => {
                                console.log('here ');
                                setHolidayToModify(holidays);
                              }}
                            >
                              <i className="fa fa-pencil m-r-5" /> Edit
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              data-toggle="modal"
                              data-target="#delete_holiday"
                              onClick={() => {
                                setHolidayToModify(holidays);
                              }}
                            >
                              <i className="fa fa-trash-o m-r-5" /> Delete
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
      {/* Add Holiday Modal */}
      <div className="modal custom-modal fade" id="add_holiday" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Holiday</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddHoliday();
                }}
              >
                <div className="form-group">
                  <label>
                    Holiday Name <span className="text-danger">*</span>
                  </label>
                  <input
                    onChange={(e) => setHolidayName(e.target.value)}
                    className="form-control"
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <label>
                    Holiday Date <span className="text-danger">*</span>
                  </label>
                  <div>
                    <input
                      className="form-control"
                      type={'date'}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Holiday Modal */}
      {/* Edit Holiday Modal */}
      <div className="modal custom-modal fade" id="edit_holiday" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Holiday</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEdit();
                }}
              >
                <div className="form-group">
                  <label>
                    Holiday Name <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    defaultValue={holidayToModify?.title || ''}
                    onChange={(e) =>
                      setHolidayToModify({
                        ...holidayToModify,
                        title: e.target.value,
                      })
                    }
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <label>
                    Holiday Date <span className="text-danger">*</span>
                  </label>
                  <div>
                    <input
                      className="form-control"
                      value={
                        holidayToModify
                          ? new Date(holidayToModify?.date)
                              .toISOString()
                              .substring(0, 10)
                          : ''
                      }
                      onChange={(e) =>
                        setHolidayToModify({
                          ...holidayToModify,
                          date: e.target.value,
                        })
                      }
                      type="date"
                    />
                  </div>
                </div>
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit Holiday Modal */}
      {/* Delete Holiday Modal */}
      <div
        className="modal custom-modal fade"
        id="delete_holiday"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete Holiday</h3>
                <p>Are you sure want to delete?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete();
                      }}
                      className="btn btn-primary continue-btn"
                    >
                      Delete
                    </a>
                  </div>
                  <div className="col-6">
                    <a
                      href=""
                      data-dismiss="modal"
                      className="btn btn-primary cancel-btn"
                    >
                      Cancel
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Delete Holiday Modal */}
    </div>
  );
};

export default Holidays;
