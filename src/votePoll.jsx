import React, {useEffect, useState} from "react";
import {Calendar, momentLocalizer} from "react-big-calendar";
import {
    NavLink,
    useHistory,
    useParams
} from "react-router-dom";

import {deserializeEvents, serializeEvents} from "./utils";
import {Button} from "@material-ui/core";

import moment from "moment";
const localizer = momentLocalizer(moment);

import firebase from "./firebase";
let database =  firebase.database();

function updateEventSelection(ev){
    if (!ev.selected ) {
        ev.selected = true
    }
    else {
        ev.selected = false
    }
    return ev
}
function VotePoll(props){

    let [events, setEvents] = useState([])
    let [title, setTitle] = useState("")
    let [message, setMessage] = useState('')
    let {pollId} = useParams();
    let history = useHistory();

    const notLoggedInMessage = <span style={{color: "red"}}>
        You need to be logged in to submit your vote <NavLink to="/login"> Login </NavLink></span>

    function onSelect(selection) {
        selection.slots.pop() // last slot in selection is not visually selected, so drop it
        setEvents((events) => {
            return events.map((ev) => {
                for (let slot of selection.slots) {
                    if (slot.getTime() === ev.start.getTime()) {
                        return updateEventSelection(ev)
                    }
                }
                return ev
            })
        })
    }

    function onSelectEvent(selEvent){
        setEvents((events) => {
            return events.map( (ev) => {
                if (selEvent.start.getTime() === ev.start.getTime()) {
                    return updateEventSelection(ev);
                }
                return ev
            })
        })
    }

    function submitPoll(){
        let user = firebase.auth().currentUser
        if (!user){
            setMessage(notLoggedInMessage)
            return;
        }
        let userId = user.uid
        let eventsForSubmit = events.map((ev) => {
            if (! ev.available) {ev.available = []}
            if (ev.selected){
                ev.available.push(userId) //WARNING Can have concurrency issues, if multiple clients are updating at the same time
            }
            return {
                start: ev.start.getTime(),
                end: ev.end.getTime(),
                available: ev.available
            };


        })
        let pollEventsRef = database.ref(`/polls/${pollId}/events`)

        console.log(eventsForSubmit)
        pollEventsRef.set(eventsForSubmit, (error) => {
            error && console.log(error)
        })

        alert("Your vote has been successfully submitted");
        history.push('/view/'+pollId)

    }
    useEffect(() => {
        let poll = database.ref('/polls/' + pollId)
        poll.once('value').then((poll) => {
            setTitle(poll.val().title);
            let events = deserializeEvents(poll.val().events)
            setEvents(events);
        })
    }, [])
    return (
            <div className='demo-app-main'>
                <div className='demo-app-sidebar'>
                    <div className='demo-app-sidebar-section'>
                        <h1>Vote for {title}</h1>
                    </div>
                    <div className='demo-app-sidebar-section'>
                        {message}
                    </div>
                    <div className='demo-app-sidebar-section'>
                        <Button onClick={submitPoll} variant="contained" color="primary" >Submit Your vote</Button>
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
                        selectable={true}
                        onSelectSlot={onSelect}
                        onSelectEvent={onSelectEvent}
                        titleAccessor={() => ""}
                        eventPropGetter={selectableEventProps}
                    />
                </div>
        </div>
    )
}


function selectableEventProps(event) {
    if (event.selected) {
        return {className: 'event-selected'}
    }
    else {
        return {}
    }
}

export default VotePoll;