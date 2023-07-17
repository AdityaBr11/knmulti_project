import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useEffect } from 'react';
import httpService from '../../lib/httpService';
import Swal from 'sweetalert2';
import { Card } from 'react-bootstrap';

function LeadStatus() {
  const [columns, setColumns] = useState({
    ['New Lead']: {
      name: 'New Lead',
      items: [],
      background: '#fff',
      color: '#000',
    },
    ['Cold Lead']: {
      name: 'Cold Lead',
      items: [],
      background: '#EC453A',
      color: '#fff',
    },
    ['Negotiations']: {
      name: 'Negotiations',
      items: [],
      background: '#1DC5CF',
      color: '#fff',
    },
    ['Lead Won']: {
      name: 'Lead Won',
      items: [],
    },
    ['Lead Lost']: {
      name: 'Lead Lost',
      items: [],
    },
  });

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn?.items];
      const destItems = [...destColumn?.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      Swal.fire({
        title: `Confirming updating`,
        text: `Are you sure you want to update the status of ${removed.name}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Proceed',
        preConfirm: () => {
          return httpService.put(`/lead/${removed._id}`, {
            status: columns[destination.droppableId].id,
          });
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          if (
            destination.droppableId === 'Lead Won' ||
            destination.droppableId === 'Lead Lost'
          ) {
            if (destination.droppableId === 'Lead Won') {
              // create a new customer
              // await httpService.post(`/customer`, {
              //   ...removed,
              //   _id: undefined,
              // });
            }
            setColumns({
              ...columns,
              [source.droppableId]: {
                ...sourceColumn,
                items: sourceItems,
              },
            });
            Swal.fire(
              'Status Updated',
              'Leave status has been updated.',
              'success'
            );
            return;
          }

          setColumns({
            ...columns,
            [source.droppableId]: {
              ...sourceColumn,
              items: sourceItems,
            },
            [destination.droppableId]: {
              ...destColumn,
              items: destItems,
            },
          });
          Swal.fire(
            'Status Updated',
            'Leave status has been updated.',
            'success'
          );
        }
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column?.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  const [projectDetails, setProjectDetails] = useState([]);
  const [projectitem, setProjectitem] = useState([]);
  useEffect(() => {
    fetchLeads();
    fetchLead();
  }, []);


  const fetchLeads = async () => {
    let data = {}
    const status = await httpService.get('lead-status/json');
    data = status.data;
    const leads = await httpService.get('/lead');
    leads.data.splice(0, 3);
    if (leads.status === 200) {
      for (let i = 0; i < leads.data.length; i++) {
        data = {
          ...data,
          [leads.data[i].status.name]: {
            ...data[leads.data[i].status.name],
            items: [
              ...data[leads.data[i].status.name].items || null,
              {
                ...leads.data[i],
                id: leads.data[i]._id,
                content: `${leads.data[i].lead} - ${leads.data[i].firstName} ${leads.data[i].lastName}`,
              },
            ],
          },
        };
      }
      console.log('getting')
      console.log(data)

      setColumns(data)
    }
  };
  const [siteVisit, setSiteVisit] = useState([]);
  // const [siteVisit, setSiteVisit] = useState([]);

  const fetchLead = async () => {
    let data = {};
    const project = await httpService.get('/project');
    if (project.status === 200) {
      setProjectDetails(project.data);
      let data1 = [];
      let data2 = [];
      let data3 = [];
      for (let i = 0; i < project.data.length; i++) {
        if (project.data[i].subPlots[i].leadsInfo[i].leadType === "Site Visit") {
          data1.push((project.data[i]));
        }
        if (project.data[i].subPlots[i].leadsInfo[i].leadType === "Booking") {
          data2.push((project.data[i]));
        }
        if (project.data[i].subPlots[i].leadsInfo[i].leadType === "Site Visit") {
          // data3.push((project.data[i])); 
        }
        setProjectitem(data3);
        console.log("item(data1);", data1);
        console.log("item(data1);", data2);
        setSiteVisit(data1);
        console.log(project.data[i].subPlots[0].leadsInfo[0].leadType, 'ajajajajj');

      }

      console.log(projectDetails, 'data,project');
      // console.log(projectDetails[1],'count11');
      console.log('data,project11', projectDetails);
    }

  }

  const asa = projectDetails;
  console.log(projectitem, "columns", 'count1122', projectDetails);


  return (
    <div className="page-wrapper">
      <Helmet>
        <title>Lead Status</title>
        <meta name="description" content="Login page" />
      </Helmet>
      {/* Page Content */}
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="page-title">Projects</h3>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/app/main/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Lead Status</li>
              </ul>
            </div>
          </div>
        </div>

        {/* /Page Header */}
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, minmax(350px, 1fr))',
              gap: 5,
              overflow: 'auto',
              paddingTop: '20px',
              paddingBottom: '20px',
            }}
          >
            {Object.entries(columns)?.map(([columnId, column], index) => {
              return (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                  key={columnId}
                >
                  <h4
                    style={{
                      fontWeight: 500,
                    }}
                  >
                    {column?.name}

                  </h4>
                  {projectitem.map((project, index) => {
                    if (column.name == "Prospect") {
                      return (
                        <>
                          <Card >
                            <Card.Body>
                              <h1>name1 : <span>{project.name}</span> </h1>
                              {/* <Card.Title>lead name : Ritik</Card.Title> */}
                              {/* <h2>project :  {project.status}</h2> */}
                              <h2>project Type : {project.type}</h2>
                              <h2>subtype : {project.subtype}</h2>

                              {/* <Button variant="primary">Go somewhere</Button> */}
                            </Card.Body>
                          </Card>
                        </>
                        // subPlots[i].leadsInfo[i].leadType
                      );
                    }
                  })}
                  {siteVisit.map((project, index) => {
                    if (column.name == "Site Visit") {
                      return (
                        <>
                          <Card >
                            <Card.Body>
                              <h1>name : <span>{project.name}</span> </h1>
                              {/* <Card.Title>lead name : Ritik</Card.Title> */}
                              {/* <h2>project :  {project.status}</h2> */}
                              <h2>project Type : {project.type}</h2>
                              <h2>subtype : {project.subtype}</h2>

                              {/* <Button variant="primary">Go somewhere</Button> */}
                            </Card.Body>
                          </Card>
                        </>
                        // subPlots[i].leadsInfo[i].leadType
                      );
                    }
                  })}

                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

export default LeadStatus;
