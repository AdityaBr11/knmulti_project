/**
 * Signin Firebase
 */

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import httpService from '../../../lib/httpService';
import AddLocationModal from './AddLocationModal';

const Localization = () => {

  const [ locs, setLocs ] = useState([]);
  const [ locName, setLocName ] = useState("");
  const [curr, setCurr] = useState("");

  const fetchLocation = async () => {
    const res = await httpService.get(`/location`);
    setLocs(res?.data);
  }

  const handleLinkClick = (e, locId, locN) => {
    setCurr(locId);
    setLocName(locN);
  }

  const handleLocName = async (e) => {
    e.preventDefault();
    await httpService.put(`/location/${curr}`, { name: locName });
    await fetchLocation();
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    await httpService.delete(`/location/${curr}`);
    await fetchLocation();
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

  useEffect(() => {

    fetchLocation();

    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }
  }, []);

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Localization </title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            {/* Page Header */}
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <h3 className="page-title">Add Work Location</h3>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            {/* <form> */}
              <div className="row">
                <div className="col-sm-6">
                  <Link
                    to="#"
                    className="btn btn-primary btn-block"
                    data-toggle="modal"
                    data-target="#add_loc"
                  >
                    <i className="fa fa-plus" /> Add Location
                  </Link>
                  <div className="roles-menu">
                    <ul>
                    {
                      locs.length && 
                        locs.map((loc, index) => (
                          <li key={loc?._id} 
                            onClick={(e) => handleLinkClick(e, loc?._id, loc?.name)}
                            className={ curr === loc?._id ? "active" : "" }
                          >
                            <Link to="#">
                              {loc?.name}
                              <span className="role-action">
                                <span
                                  className="action-circle large"
                                  data-toggle="modal"
                                  data-target="#edit_loc"
                                >
                                  <i className="material-icons">edit</i>
                                </span>
                                <span
                                  className="action-circle large delete-btn"
                                  data-toggle="modal"
                                  data-target="#delete_loc"
                                >
                                  <i className="material-icons">delete</i>
                                </span>
                              </span>
                            </Link>
                          </li>
                        ))
                    }
                    </ul>
                  </div>
                </div>
              </div>
              <AddLocationModal fetchLocation={fetchLocation} />
              <div id="edit_loc" className="modal custom-modal fade" role="dialog">
                <div className="modal-dialog modal-dialog-centered" role="document">
                  <div className="modal-content modal-md">
                    <div className="modal-header">
                      <h5 className="modal-title">Edit Location</h5>
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
                      <form>
                        <div className="form-group">
                          <label>
                            Location <span className="text-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            // defaultValue="Team Leader"
                            type="text"
                            value={locName}
                            onChange={(e) => setLocName(e.target.value)}
                          />
                        </div>
                        <div className="submit-section">
                          <div className="btn btn-primary"
                            data-dismiss="modal"
                            onClick={handleLocName}
                          >Save</div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              {/* delete  */}
              <div className="modal custom-modal fade" id="delete_loc" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-body">
                      <div className="form-header">
                        <h3>Delete Location</h3>
                        <p>Are you sure want to delete?</p>
                      </div>
                      <div className="modal-btn delete-action">
                        <div className="row text-center">
                          <div className="col-6"
                          
                            onClick={handleDelete}
                          >
                            <Link to="#" className="btn btn-primary" data-dismiss="modal">
                              Delete
                            </Link>
                          </div>
                          <div className="col-6">
                            <Link
                              to="#"
                              data-dismiss="modal"
                              className="btn btn-primary"
                            >
                              Cancel
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Default Country</label>
                    <select className="select">
                      <option>USA</option>
                      <option>United Kingdom</option>
                    </select>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Date Format</label>
                    <select className="select">
                      <option value="d/m/Y">15/05/2016</option>
                      <option value="d.m.Y">15.05.2016</option>
                      <option value="d-m-Y">15-05-2016</option>
                      <option value="m/d/Y">05/15/2016</option>
                      <option value="Y/m/d">2016/05/15</option>
                      <option value="Y-m-d">2016-05-15</option>
                      <option value="M d Y">May 15 2016</option>
                      <option value="d M Y">15 May 2016</option>
                    </select>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Timezone</label>
                    <select className="select">
                      <option>(UTC +5:30) Antarctica/Palmer</option>
                    </select>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Default Language</label>
                    <select className="select">
                      <option>English</option>
                      <option>French</option>
                    </select>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Currency Code</label>
                    <select className="select">
                      <option>USD</option>
                      <option>Pound</option>
                      <option>EURO</option>
                      <option>Ringgit</option>
                    </select>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Currency Symbol</label>
                    <input
                      className="form-control"
                      readOnly
                      defaultValue="$"
                      type="text"
                    />
                  </div>
                </div>
                <div className="col-sm-12">
                  <div className="submit-section">
                    <button className="btn btn-primary submit-btn">Save</button>
                  </div>
                </div>
              </div> */}
            {/* </form> */}
          </div>
        </div>
      </div>
      {/* /Page Content */}
    </div>
  );
};

export default Localization;
