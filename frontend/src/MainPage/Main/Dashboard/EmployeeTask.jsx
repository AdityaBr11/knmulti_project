import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import React, { useState } from "react";
import { useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from 'react-redux';
import httpService from '../../../lib/httpService';

const locales = {
    "en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const events = [
    {
        title: "Big Meeting",
        allDay: true,
        start: new Date(2021, 6, 0),
        end: new Date(2021, 6, 0),
    },
    {
        title: "Vacation",
        start: new Date(2021, 6, 7),
        end: new Date(2021, 6, 10),
    },
    {
        title: "Conference",
        start: new Date(2021, 6, 20),
        end: new Date(2021, 6, 23),
    },
    {
        title: "Conference sept.",
        start: new Date("2022-09-08T18:30:00.000Z"),
        end: new Date("2022-09-09T18:30:00.000Z"),
    },
    {
        title: "Conf more lorem ipsum aa",
        start: new Date("2022-09-06T18:30:00.000Z"),
        end: new Date("2022-09-08T18:30:00.000Z"),
    },
];
function App({empTask}) {
    console.log(empTask,'empTask..');
    const empTask_2 = [];
    const user = useSelector((state) => state.authentication.value.user);
    console.log(user?._id,'userId');
    const [newEvent, setNewEvent] = useState({id: user?._id, title: "", start: "", end: "" });
    const [allEvents, setAllEvents] = useState(empTask_2); 
    console.log(empTask,'emptask..//');
    // console.log(newEvent,'newEvents');
    // console.log(allEvents,'allEvents../');

    function handleAddEvent() {
        setAllEvents([...allEvents, newEvent]);
        events.push(newEvent);
    }
    const handleSubmit = async (e)=>{
        if(newEvent != ""){
            await httpService.post(`/employeeTask`, newEvent);
        }
    }
    const saveToEmpTask = (e)=>{
        empTask?.map((e)=>{
        empTask_2.push({title:e?.title, start:new Date(e?.start), end:new Date(e?.end)})
      });
      }
      console.log(empTask_2,'emptask_2');
      useEffect(()=>{
        saveToEmpTask();
      },[]);
    return (
        <div className="content container-fluid">
        <div className="text-center">
            <h2>Add New Task</h2>
            <div>
                <div className="row">
                    <div className="col-md-6">
                        <input type="text"  className="form-control"   placeholder="Add Title" style={{  }} value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />              
                    </div>
                    <div className="col-md-6">
                        <DatePicker  className="form-control"   placeholderText="Start Date" style={{ marginRight: "10px" }} selected={newEvent.start} onChange={(start) => setNewEvent({ ...newEvent, start })} />
                
                    </div>
                    <div className="col-md-12">
                        <br></br>
                        <DatePicker  className="form-control"   placeholderText="End Date" selected={newEvent.end} onChange={(end) => setNewEvent({ ...newEvent, end })} />
                
                    </div>
                    <div className="col-md-2" stlye={{ marginRight: "493px" }}> 
                        <br></br>
                        <button className="btn btn-info me-3"  onClick={(e)=>{handleAddEvent();handleSubmit();}}>
                        Add Task
                        </button>
                    </div>
                </div>
                {/* <input type="text"  className="form-control"   placeholder="Add Title" style={{  }} value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
                <DatePicker  className="form-control"   placeholderText="Start Date" style={{ marginRight: "10px" }} selected={newEvent.start} onChange={(start) => setNewEvent({ ...newEvent, start })} />
                <DatePicker  className="form-control"   placeholderText="End Date" selected={newEvent.end} onChange={(end) => setNewEvent({ ...newEvent, end })} />
                <br></br>
                <button stlye={{ marginTop: "10px" }} onClick={(e)=>{handleAddEvent();handleSubmit();}}>
                    Add Task
                </button> */}
            </div>
            <Calendar localizer={localizer} events={allEvents} startAccessor="start" endAccessor="end" style={{ height: 500, margin: "50px" }} />
        </div>
        </div>
    );
}

export default App;
