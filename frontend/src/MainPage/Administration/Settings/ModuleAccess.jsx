import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { putRoleAccessPrem } from '../../../features/roleAccessPerm/roleAccessPremSlice';

const ModuleAccess = () => {

  const dispatch = useDispatch();

  const { isLoading, current } = useSelector(state => state.roleAccessParams);

  const { moduleAccess : mA, modulePermission : mP, _id, role } = useSelector( state => state.roleAccessParams.current);



  const [ moduleAccess, setModuleAccess ] = useState({
    employee: true,
    holidays: false,
    leaves: false,
    events: false,
    chat: false,
    jobs: false,
  });

  const crud = {
    read: false,
    write: false,
    create: false,
    delete: false,
    import: false,
    export: false
  }

  const [modulePermission, setModulePermission] = useState({
    employee: crud,
    holidays: crud,
    leaves: crud,
    events: crud
  });

  useEffect(() => {
    setModuleAccess(mA);
    setModulePermission(mP);
  }, [mA, mP, current]);


  const handleModuleAccess = (e) => {
    setModuleAccess(prevState => ({ ...prevState, [e.target.name] : e.target.checked }));
  }

  let moduleArr = ["employee", "holidays", "leaves", "events"];
 

  const handleModPer = (e, a) => {
    // let b = e.target.name;
    const c = { ...modulePermission[a], [e.target.name] : e.target.checked };
    setModulePermission({ ...modulePermission, [a] : c });
  }

  const handleUpdateRoleAccessPrem = (e) => {
    e.preventDefault();
    const accessPermData = { ...current };
    accessPermData.moduleAccess = { ...current.moduleAccess };
    accessPermData.modulePermission = { ...current.modulePermission };
    accessPermData.moduleAccess = { ...moduleAccess };
    accessPermData.modulePermission = { ...modulePermission };

    dispatch(putRoleAccessPrem(accessPermData));
  }

  console.log(moduleAccess);
  console.log(modulePermission);


  if(isLoading && current){
    return(
      <div>Loading...</div>
    )
  }


  return (
    <div className="col-sm-8 col-md-8 col-lg-8 col-xl-9">
      <div className="row justify-content-between">
      <span className="col card-title m-b-20">Module Access</span>
      <div className="col-2 btn btn-primary m-b-20"
                    onClick={handleUpdateRoleAccessPrem}
      >Update</div>
      </div>
        {/* <button onClick={handleUpdateRoleAccessPrem}>Update</button> */}
  
      <div className="m-b-30">
        <ul className="list-group notification-list">
          <li className="list-group-item">
            Employee
            <div className="status-toggle">
              <input
                type="checkbox"
                id="staff_module"
                className="check"
                onChange={handleModuleAccess}
                name='employee'
                checked={moduleAccess.employee}
              />
              <label htmlFor="staff_module" className="checktoggle">
                checkbox
              </label>
            </div>
          </li>
          <li className="list-group-item">
            Holidays
            <div className="status-toggle">
              <input
                type="checkbox"
                id="holidays_module"
                className="check"
                onChange={handleModuleAccess}
                name='holidays'
                checked={moduleAccess.holidays}
                // defaultChecked
              />
              <label htmlFor="holidays_module" className="checktoggle">
                checkbox
              </label>
            </div>
          </li>
          <li className="list-group-item">
            Leaves
            <div className="status-toggle">
              <input
                type="checkbox"
                id="leave_module"
                className="check"
                onChange={handleModuleAccess}
                name='leaves'
                // defaultChecked
                checked={moduleAccess.leaves}
              />
              <label htmlFor="leave_module" className="checktoggle">
                checkbox
              </label>
            </div>
          </li>
          <li className="list-group-item">
            Events
            <div className="status-toggle">
              <input
                type="checkbox"
                id="events_module"
                className="check"
                onChange={handleModuleAccess}
                name='events'
                // defaultChecked
                checked={moduleAccess.events}
              />
              <label htmlFor="events_module" className="checktoggle">
                checkbox
              </label>
            </div>
          </li>
          <li className="list-group-item">
            Chat
            <div className="status-toggle">
              <input
                type="checkbox"
                id="chat_module"
                className="check"
                onChange={handleModuleAccess}
                name='chat'
                // defaultChecked
                checked={moduleAccess.chat}
              />
              <label htmlFor="chat_module" className="checktoggle">
                checkbox
              </label>
            </div>
          </li>
          <li className="list-group-item">
            Jobs
            <div className="status-toggle">
              <input type="checkbox" id="job_module" className="check"
                onChange={handleModuleAccess}
                name='jobs'
                checked={moduleAccess.jobs}
              />
              <label htmlFor="job_module" className="checktoggle">
                checkbox
              </label>
            </div>
          </li>
        </ul>
      </div>
      <div className="table-responsive">
        <table className="table table-striped custom-table">
          <thead>
            <tr>
              <th>Module Permission</th>
              <th className="text-center">Read</th>
              <th className="text-center">Write</th>
              <th className="text-center">Create</th>
              <th className="text-center">Delete</th>
              <th className="text-center">Import</th>
              <th className="text-center">Export</th>
            </tr>
          </thead>
          <tbody>
            { moduleArr.map((a, index) => (
              <tr>
              <td>{a}</td>
              <td className="text-center">
                <input type="checkbox"
                  name='read'
                  onChange={(e) => handleModPer(e, a)}
                  checked={modulePermission[a].read}
               />
              </td>
              <td className="text-center">
                <input type="checkbox" 
                  name='write'
                  onChange={(e) => handleModPer(e, a)}
                  checked={modulePermission[a].write}
                />
              </td>
              <td className="text-center">
                <input type="checkbox" 
                  name='create'
                  onChange={(e) => handleModPer(e, a)}
                  checked={modulePermission[a].create}
                />
              </td>
              <td className="text-center">
                <input type="checkbox" 
                  name='delete'
                  onChange={(e) => handleModPer(e, a)}
                  checked={modulePermission[a].delete}
                />
              </td>
              <td className="text-center">
                <input type="checkbox" 
                  name='import'
                  onChange={(e) => handleModPer(e, a)}
                  checked={modulePermission[a].import}
                />
              </td>
              <td className="text-center">
                <input type="checkbox" 
                  name='export'
                  onChange={(e) => handleModPer(e, a)}
                  checked={modulePermission[a].export}
                />
              </td>
            </tr>
            )) }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ModuleAccess