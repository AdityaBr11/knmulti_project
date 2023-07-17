import { Delete } from '@mui/icons-material'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Avatar_02 } from '../../../Entryfile/imagepath'
import { deleteNotify, getNotify } from '../../../features/notify/notifySlice'
import httpService from '../../../lib/httpService'

const EmpNotification = () => {

  const dispatch = useDispatch();

  const [ notifyItems, setnotifyItems ] = useState([]);

  const notifyData = useSelector(({ notification }) => notification?.notify);
  const empId = useSelector((state) => state?.authentication?.value?.user?._id);

  useEffect(() => {
    dispatch(getNotify(empId));
  }, [])

  useEffect(() => {
    if(notifyData){
      setnotifyItems([ ...notifyData ]);
    }
  }, [notifyData]);

  const deleteNotification = async (notifyId) => {
    await dispatch(deleteNotify(notifyId))
  }

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Notification Info</title>
        <meta name="description" content="Notification Info" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row">
            <div className="col">
              <h3 className="page-title">Notification Details</h3>
            </div>
            <div className="col">
              
            </div>
          </div>
        </div>
        <div className="row">

          <div className='col-12'>
            <ul className="list-group col-12">
            { notifyItems && notifyItems?.map((n, index) => (
              <li key={index} className="list-group-item col-12">
              <div className="card col-12">
                <h5 className="card-header d-flex justify-content-between">{n?.notifyHead}
                  <Delete style={{ cursor: "pointer", color: "red" }} onClick={(e) => deleteNotification(n?._id)} />
                </h5>
                <div className="card-body">
                  <h5 className="card-title">{n?.notifyBody}</h5>
                  <small className="text-muted">{n?.notifyDate?.split("T")[0]}</small>
                </div>
              </div>
            </li>
            )) }
          
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmpNotification