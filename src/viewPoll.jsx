import React, {useEffect, useState} from "react";
import {Calendar, momentLocalizer} from "react-big-calendar";
import {
    NavLink,
    useHistory,
    useParams
} from "react-router-dom";

import {Button} from "@material-ui/core";

import moment from "moment";
const localizer = momentLocalizer(moment);

import firebase from "./firebase";
let database =  firebase.database();

function viewPoll(props){

    let [events, setEvents] = useState([])
    let [title, setTitle] = useState("")
    let [message, setMessage] = useState('See where people have voted')
    let {pollId} = useParams();
    let history = useHistory();

    useEffect(() => {
        let poll = database.ref('/polls/' + pollId)
        poll.once('value').then((poll) => {
            setTitle(poll.val().title);
            let events = poll.val().events.map((ev) => {
                    let nAvailable = 0
                    if (ev.available) {
                        nAvailable = ev.available.length
                    }

                    return {
                        start: new Date(ev.start),
                        end: new Date(ev.end),
                        title: "Available: " + nAvailable,
                        nAvailable: nAvailable,
                    }
                }
            )
            setEvents(events);
        })
    }, [])
    return (
        <div className='demo-app-main'>
            <div className='demo-app-sidebar'>
                <div className='demo-app-sidebar-section'>
                    <h1>View Results for {title}</h1>
                </div>
                <div className='demo-app-sidebar-section'>
                    {message}
                </div>
            </div>
            <div>
                <Calendar
                    localizer={localizer}
                    events={events}
                    views={['week']}
                    defaultView='week'
                    step={60} //hardcoded for now TODO put in db
                    timeslots={1}
                    style={{height: "75vh"}}
                    eventPropGetter={viewEventProps}
                />
            </div>
        </div>
    )
}


function viewEventProps(event) {
    return {
        className: event.nAvailable > 0 ? "available": "not-available"
    }
}

export default viewPoll;