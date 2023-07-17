/**
 * Signin Firebase
 */

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Table } from 'antd';
import 'antd/dist/antd.css';
import { itemRender, onShowSizeChange } from '../../paginationfunction';
import '../../antdstyle.css';
import {
  getCustomHolidays,
  postCustomHoliday,
  putCustomHoliday,
  removeCustomHoliday,
} from '../../../lib/api';

const CustomHolidays = () => {
  const [data, setData] = useState([
    { id: 1, title: 'H1', date: '1/2/22' },
    { id: 2, title: 'H2', date: '1/3/22' },
    { id: 3, title: 'H3', date: '1/3/22' },
  ]);
  const [addCustomHoliday, setAddCustomHoliday] = useState({
    title: '',
    date: null,
  });
  const [editCustomHoliday, setEditCustomHoliday] = useState(null);
  const [deleteCustomHoliday, setDeleteCustomHoliday] = useState(null);

  useEffect(async () => {
    const res = await getCustomHolidays();
    setData(res.map((holiday, index) => ({ ...holiday, id: index + 1 })));
  }, []);

  const handleAddCustomHoliday = async (e) => {
    // e.preventDefault();
    if (addCustomHoliday.title === '' || !addCustomHoliday.date) return null;
    const res = await postCustomHoliday(addCustomHoliday);
    setData([...data, { ...res, id: data.length + 1 }]);
  };

  const handleEditCustomHoliday = async (e) => {
    // e.preventDefault();
    if (editCustomHoliday.title === '' || !editCustomHoliday.date) return null;
    const res = await putCustomHoliday(
      editCustomHoliday._id,
      editCustomHoliday
    );
    // setData([...data, { ...res, id: data.length + 1 }]);
  };

  const handleDeleteCustomHoliday = async (e) => {
    // e.preventDefault();
    if (!deleteCustomHoliday) return null;
    const res = await removeCustomHoliday(deleteCustomHoliday?._id);
  };

  const columns = [
    {
      title: '#',
      render: (text, record) => <div>{record?.id}</div>,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      sorter: (a, b) => a.leavetype.length - b.leavetype.length,
    },

    {
      title: 'Date',
      dataIndex: 'date',
      render: (text, record) => (
        <div>{new Date(record?.date).toLocaleDateString()}</div>
      ),
      sorter: (a, b) => new Date(b.date) - new Date(a.date),
    },
    // {
    //   title: 'Status',
    //   render: (text, record) => (
    //     <div className="dropdown action-label">
    //       <a
    //         className="btn btn-white btn-sm btn-rounded dropdown-toggle"
    //         href="#"
    //         data-toggle="dropdown"
    //         aria-expanded="false"
    //       >
    //         <i className="fa fa-dot-circle-o text-success" /> Active
    //       </a>
    //       <div className="dropdown-menu dropdown-menu-right">
    //         <a href="#" className="dropdown-item">
    //           <i className="fa fa-dot-circle-o text-success" /> Active
    //         </a>
    //         <a href="#" className="dropdown-item">
    //           <i className="fa fa-dot-circle-o text-danger" /> Inactive
    //         </a>
    //       </div>
    //     </div>
    //   ),
    // },
    {
      title: 'Action',
      render: (text, record) => (
        <div className="dropdown dropdown-action text-right">
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
              data-target="#edit_customholiday"
              onClick={() => setEditCustomHoliday(record)}
            >
              <i className="fa fa-pencil m-r-5" /> Edit
            </a>
            <a
              className="dropdown-item"
              href="#"
              data-toggle="modal"
              data-target="#delete_customholiday"
              onClick={() => setDeleteCustomHoliday(record)}
            >
              <i className="fa fa-trash-o m-r-5" /> Delete
            </a>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Custom Holiday </title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Custom Holidays</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Custom Holidays</li>
              </ul>
            </div>
            <div className="col-auto float-right ml-auto">
              <a
                href="#"
                className="btn add-btn"
                data-toggle="modal"
                data-target="#add_customholiday"
              >
                <i className="fa fa-plus" /> Add Custom Holiday
              </a>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive">
              <Table
                pagination={{
                  total: data.length,
                  showTotal: (total, range) =>
                    `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                  showSizeChanger: true,
                  onShowSizeChange: onShowSizeChange,
                  itemRender: itemRender,
                }}
                style={{ overflowX: 'auto' }}
                columns={columns}
                bordered
                dataSource={data}
                rowKey={(record) => record._id}
                // onChange={this.handleTableChange}
              />
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
      {/* Add CustomHoliday Modal */}
      <div
        id="add_customholiday"
        className="modal custom-modal fade"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Custom Holiday</h5>
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
                    Title <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    onChange={(e) =>
                      setAddCustomHoliday({
                        ...addCustomHoliday,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>
                    Date <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="date"
                    onChange={(e) =>
                      setAddCustomHoliday({
                        ...addCustomHoliday,
                        date: new Date(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    onClick={handleAddCustomHoliday}
                    data-dismiss="modal"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add CustomHoliday Modal */}
      {/* Edit CustomHoliday Modal */}
      <div
        id="edit_customholiday"
        className="modal custom-modal fade"
        role="dialog"
        data-backdrop="static"
        data-keyboard={false}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Custom Holiday</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => setEditCustomHoliday(null)}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label>
                    Title <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    onChange={(e) =>
                      setEditCustomHoliday({
                        ...editCustomHoliday,
                        title: e.target.value,
                      })
                    }
                    defaultValue={editCustomHoliday?.title}
                  />
                </div>

                <div className="form-group">
                  <label>
                    Date <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="date"
                    onChange={(e) =>
                      setEditCustomHoliday({
                        ...editCustomHoliday,
                        date: new Date(e.target.value),
                      })
                    }
                    defaultValue={new Date(editCustomHoliday?.date)}
                  />
                </div>
                <div className="submit-section">
                  <button
                    className="btn btn-primary submit-btn"
                    onClick={handleEditCustomHoliday}
                    data-dismiss="modal"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit CustomHoliday Modal */}
      {/* Delete CustomHoliday Modal */}
      <div
        className="modal custom-modal fade"
        id="delete_customholiday"
        role="dialog"
        data-backdrop="static"
        data-keyboard={false}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete Custom Holiday</h3>
                <p>Are you sure want to delete?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <a
                      href=""
                      className="btn btn-primary continue-btn"
                      onClick={handleDeleteCustomHoliday}
                      data-dismiss="modal"
                    >
                      Delete
                    </a>
                  </div>
                  <div className="col-6">
                    <a
                      href=""
                      data-dismiss="modal"
                      className="btn btn-primary cancel-btn"
                      onClick={() => setDeleteCustomHoliday(null)}
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
      {/* /Delete CustomHoliday Modal */}
    </div>
  );
};

export default CustomHolidays;
