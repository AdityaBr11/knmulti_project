import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Table } from 'antd';
import 'antd/dist/antd.css';
import { itemRender, onShowSizeChange } from '../../paginationfunction';
import '../../antdstyle.css';
import httpService from '../../../lib/httpService';

const Category = () => {
  const [data, setData] = useState([]);
  const [categoryToAdd, setCategoryToAdd] = useState({});
  const [categoryToModify, setCategoryToModify] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const categories = await httpService.get('/category');
    setData(categories.data.map((category, i) => ({ ...category, id: i + 1 })));
  };

  const handleAdd = async () => {
    await httpService.post('/category', categoryToAdd);
    fetchCategories();
  };

  const handleModify = async () => {
    if (!categoryToModify.name.length || !categoryToModify.description.length)
      return;
    await httpService.put(`/category/${categoryToModify.id}`, categoryToModify);
    fetchCategories();
  };

  const handleDelete = async () => {
    await httpService.delete(`/category/${categoryToModify._id}`);
    fetchCategories();
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      sorter: (a, b) => a.id.length - b.id.length,
    },
    {
      title: 'Category Name',
      dataIndex: 'name',
      sorter: (a, b) => a.category.length - b.category.length,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      sorter: (a, b) => a.subcategory.length - b.subcategory.length,
    },
    {
      title: 'Action',
      render: (text, record) => (
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
              data-target="#edit_categories"
              onClick={() => {
                setCategoryToModify(record);
              }}
            >
              <i className="fa fa-pencil m-r-5" /> Edit
            </a>
            <Link className="dropdown-item" to="/app/accounts/sub-category">
              <i className="fa fa-object-ungroup m-r-5" /> Sub-Category{' '}
            </Link>
          </div>
        </div>
      ),
    },
  ];
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <Helmet>
          <title>Categories </title>
          <meta name="description" content="Login page" />
        </Helmet>
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row align-items-center">
              <div className="col">
                <h3 className="page-title">Categories</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/app/main/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Accounts</li>
                </ul>
              </div>
              <div className="col-auto float-right ml-auto">
                <a
                  href="#"
                  className="btn add-btn"
                  data-toggle="modal"
                  data-target="#add_categories"
                >
                  <i className="fa fa-plus" /> Add Categories
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
        {/* Add Holiday Modal */}
        <div
          className="modal custom-modal fade"
          id="add_categories"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Categories</h5>
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
                    handleAdd();
                  }}
                >
                  <div className="form-group">
                    <label>
                      Categories Name <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      onChange={(e) =>
                        setCategoryToAdd((s) => ({
                          ...s,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      rows={4}
                      className="form-control"
                      defaultValue={''}
                      onChange={(e) => {
                        setCategoryToAdd((s) => ({
                          ...s,
                          description: e.target.value,
                        }));
                      }}
                    />
                  </div>
                  <div className="submit-section">
                    <button className="btn btn-primary submit-btn">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* /Add Holiday Modal */}
        {/* Add Holiday Modal */}
        <div
          className="modal custom-modal fade"
          id="edit_categories"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Categories</h5>
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
                    handleModify();
                  }}
                >
                  <div className="form-group">
                    <label>
                      Categories Name <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      defaultValue={categoryToModify.name}
                      onChange={(e) => {
                        setCategoryToModify((s) => ({
                          ...s,
                          name: e.target.value,
                        }));
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      rows={4}
                      className="form-control"
                      defaultValue={categoryToModify.description}
                      onChange={(e) => {
                        setCategoryToModify((s) => ({
                          ...s,
                          description: e.target.value,
                        }));
                      }}
                    />
                  </div>
                  <div className="submit-section">
                    <button className="btn btn-primary submit-btn">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* /Add Holiday Modal */}
      </div>
      {/* /Page Wrapper */}
    </>
  );
};

export default Category;
