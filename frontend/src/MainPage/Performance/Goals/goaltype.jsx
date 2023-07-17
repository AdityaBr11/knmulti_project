/**
 * Signin Firebase
 */

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import { Table } from 'antd';
import 'antd/dist/antd.css';
import { itemRender, onShowSizeChange } from '../../paginationfunction';
import '../../antdstyle.css';
import { fetchGoals } from '../../../lib/api';
import httpService from '../../../lib/httpService';




const GoalType = () => {
  const[description,setDescription] = useState("");
  const[status,setStatus]=useState("");
  const[type,setType]=useState("");
  const[modifytype,setModifyType]=useState("");


  useEffect(() => {
    (async () => {
      const res = await fetchGoals();
      console.log('fetch Goals');
      console.log(res);
    setData(res);
    })();
  }, []);
  const handleAddGoals = async () => {
    const data = {
      name: type,
      description: description,
      status: status
    };
    const res = await httpService.post('/goal-type', data);
    fetchGoals();
    console.log(res);
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  };
  const handleEditGoal = async () => {
    const res = await httpService.put(
      `/goal-type/${modifytype._id}`,   //edit 
      modifytype
    );
    fetchGoals();
    console.log(res);
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  };


  const [data, setData] = useState([]);
  useEffect(() => {
    if ($('.select').length > 0) {
      $('.select').select2({
        minimumResultsForSearch: -1,
        width: '100%',
      });
    }
  });

  const columns = [
    {
      title: '#',
      dataIndex: '_id',
      sorter: (a, b) => a.id.length - b.id.length,
    },
    {
      title: 'Type',
      dataIndex: 'name',
      sorter: (a, b) => a.type.length - b.type.length,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      sorter: (a, b) => a.description.length - b.description.length,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text, record) => (
        <div className="dropdown action-label">
          <a
            className="btn btn-white btn-sm btn-rounded dropdown-toggle"
            href="#"
            data-toggle="dropdown"
            aria-expanded="false"
          >
            <i
              className={
                text === 'Inactive'
                  ? 'fa fa-dot-circle-o text-danger'
                  : 'fa fa-dot-circle-o text-success'
              }
            />{' '}
            {text}
          </a>
          <div className="dropdown-menu">
            <a className="dropdown-item" href="#">
              <i className="fa fa-dot-circle-o text-success" /> Active
            </a>
            <a className="dropdown-item" href="#">
              <i className="fa fa-dot-circle-o text-danger" /> Inactive
            </a>
          </div>
        </div>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
    },
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
              data-target="#edit_type"
              onClick={() => {
              setModifyType(record);
              console.log("hello");
                console.log('editing');
                console.log(record);
              }}
            >
              <i className="fa fa-pencil m-r-5" /> Edit
            </a>
            <a
              className="dropdown-item"
              href="#"
              data-toggle="modal"
              data-target="#delete_type"
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
        <title>Goal </title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Goal Type</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Goal Type</li>
              </ul>
            </div>
            <div className="col-auto float-right ml-auto">
              <a
                href="#"
                className="btn add-btn"
                data-toggle="modal"
                data-target="#add_type"
              >
                <i className="fa fa-plus" /> Add New
              </a>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive">
              <Table
                className="table-striped"
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
                // bordered
                dataSource={data}
                rowKey={(record) => record.id}
                // onChange={this.handleTableChange}
              />
            </div>
          </div>
        </div>
      </div>
      {/* /Page Content */}
      {/* Add Goal Modal */}
      <div id="add_type" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Goal Type</h5>
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
                  handleAddGoals();
                }}>
                <div className="form-group">
                  <label>
                    Goal Type <span className="text-danger">*</span>
                  </label>
                  <input className="form-control" type="text"  onChange={(event)=> setType(event.target.value)}/>
                </div>
                <div className="form-group">
                  <label>
                    Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    defaultValue={''}
                    onChange={(event)=>setDescription(event.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="col-form-label">Status</label>
                  <input className="form-control" type="text"  onChange={(event)=> setStatus(event.target.value)}/>

                </div>
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn " type='submit'>Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Goal Modal */}
      {/* Edit Goal Modal */}
      <div id="edit_type" className="modal custom-modal fade" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Goal Type</h5>
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
                  handleEditGoal();
                }}>
                <div className="form-group">
                  <label>
                    Goal Type <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    defaultValue="Invoice Goal"
                    onChange={(e) => {
                      setModifyType({
                        ...modifytype,
                        name: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="form-group">
                  <label>
                    Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    defaultValue={'Lorem ipsum ismap'}
                    onChange={(e) => {
                      setModifyType({
                        ...modifytype,
                        description : e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="col-form-label">Status</label>
                  <input
                    className="form-control"
                    type="text"
                    defaultValue="Invoice Goal"
                    onChange={(e) => {
                      setModifyType({
                        ...modifytype,
                        status: e.target.value,
                      });
                    }}
                  />
                  
                </div>
                <div className="submit-section">
                  <button className="btn btn-primary submit-btn" type='submit'>Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit Goal Modal */}
      {/* Delete Goal Modal */}
      <div className="modal custom-modal fade" id="delete_type" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete Goal Type</h3>
                <p>Are you sure want to delete?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <a href="" className="btn btn-primary continue-btn">
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
      {/* /Delete Goal Modal */}
    </div>
  );
};

export default GoalType;
