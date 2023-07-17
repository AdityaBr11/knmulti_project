import { Delete } from '@mui/icons-material';
import React, { useState } from 'react'
import { updateEmployee } from '../../../lib/api';

const EditEmpContact = ({ empId, conData, setEmployee, userName }) => {

  const personContactTemplate = {
    name : "",
    relationship: "",
    phone: ""
  };

  const [ personContact, setPersonContact ] = useState(conData || [personContactTemplate]);

  const addPersonContactField = () => {
    setPersonContact([...personContact, personContactTemplate]);
  }

  const removePersonContactField = (e, index) => {
    if(index !== 0){
      const updatedPersonContact = personContact.filter((pct, i) => index !== i );
      setPersonContact(updatedPersonContact);
    }
  }

  const handlePersonContact = (e, index) => {
    const updatedPersonContact = personContact.map((pct, i) => index == i ? Object.assign(pct, {[e.target.name]: e.target.value }) : pct);
    setPersonContact(updatedPersonContact);
  }

  const toInputUppercase = e => {
    e.target.value = ("" + e.target.value).toUpperCase();
  };

  const toCapitalize = e => {
    e.target.value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalCon = personContact.filter(exp => exp.phone !== "");
    updateEmployee(empId, { userName, emergencyContact: finalCon }).then((res) => {
      setEmployee();
    });
    document.querySelectorAll('.close')?.forEach((e) => e.click());
  }

  return (
    <div id="edit_emp_contact" className="modal custom-modal fade" role="dialog">
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Contact</h5>
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
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-12 col-sm-12">
                  <div className="table-responsive">
                    <table className="table table-hover table-white">
                      <thead>
                        <tr className="text-center">
                          <th>Name</th>
                          <th>relationship</th>
                          <th>Phone</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody> 
                        {
                          personContact?.map((p, index) => (
                            <tr className="text-center" 
                            key={index}
                            >
                              <td>
                                <input className="form-control" type="text"
                                name='name'
                                value={p?.name} 
                                onChange={(e) => handlePersonContact(e, index)}
                                onInput={toCapitalize}
                                />
                              </td>
                              <td>
                                <input className="form-control" type="text"
                                name='relationship'
                                value={p?.relationship} 
                                onChange={(e) => handlePersonContact(e, index)}
                                onInput={toCapitalize}
                                />
                              </td>
                              <td>
                                <input className="form-control" type="number" maxLength={10}
                                name='phone'
                                value={p?.phone} 
                                onChange={(e) => handlePersonContact(e, index)}
                                />
                              </td>
                              <td>
                                { index === 0 ? 
                                  <span></span>
                                : 
                                  
                                <div className=""
                                    onClick={(e) => removePersonContactField(e, index)}
                                  ><Delete /></div>
                                }
                              </td>
                            </tr>
                            )) 
                          }
                      </tbody>
                    </table>
                    <div className="btn btn-primary"
                      onClick={addPersonContactField}
                    >+ Add Contacts</div>
                  </div>
                </div>
              </div>

              <div className="submit-section">
                    <button className="btn btn-primary submit-btn" type="submit">
                      Submit
                    </button>
                  </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditEmpContact