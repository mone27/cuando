import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import firebase from "./firebase";
import moment from "moment";
import {Calendar, momentLocalizer} from "react-big-calendar";

import {serializeEvents, serializeNewEvents} from "./utils"
import {Button, TextField} from "@material-ui/core";

let database =  firebase.database();
const localizer = momentLocalizer(moment)

function slotNotInEvents(eventsList, slotFind){
    for (let ev of eventsList){
        if (ev.start.getTime() === slotFind.getTime()){
            return false;
        }
    }
    return true;
}

function eventNotInSlots(slotsList, eventFind){
    for (let ev of slotsList){
        if (ev.getTime() === eventFind.start.getTime()){
            return false;
        }
    }
    return true;
}

function CreatePoll(props){
    let [events, setEvents] = useState([])
    let [eventDuration, setEventDuration] = useState(60) //duration is expressed in minutes
    let [title, setTitle] = useState("Untitled Poll") // can find a cooler default name here
    let history = useHistory()

    function slotsToEvents(slots){
        return slots.map((slot) => {
            return {
                start: slot,
                    end: toEventEnd(slot)
            }
        });
    }
    function toEventEnd(start){
        return moment(start).add(eventDuration, 'minutes').toDate();
    }

    function onSelect(selection) {
        let slots = selection.slots
        slots.pop() // last slot in selection is not visually selected, so drop it

        setEvents((events) => {
            let newEvents = events.filter((ev) => eventNotInSlots(slots, ev));
            let newSlots = slots.filter(ev => slotNotInEvents(events, ev));
            return [...newEvents, ...slotsToEvents(newSlots)]
        })
    }

    function onSelectEvent(selEvent, _){
        setEvents((events)=> {
            events.push()
            return events.filter((ev)=> ev.start !== selEvent.start)
        })
    }

    function submitPoll () {
        let pollRef = database.ref('/polls/').push()
        let pollInfo = {
            title: title,
            events: serializeNewEvents(events), //should move events to a different subtree for performance reasons
            owner: firebase.auth().currentUser.uid
        }
        console.log(pollInfo)
        pollRef.set(pollInfo, (error) => {
            error && console.log(error)
        })

        alert("created poll " + title + " with n events: " +events.length);
        history.push('/');

    }



    return (
        <div className='demo-app'>
            <CreatePollTopBar
                changeEventDuration={(ev) => setEventDuration(ev.target.value)}
                changeTitle={(ev) => setTitle(ev.target.value)}
                title={title}
                onSubmitPoll={submitPoll}
            />
            <div className='demo-app-main'>
                <div>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        views={['week']}
                        defaultView='week'
                        step={eventDuration}
                        timeslots={1}
                        style={{height: "75vh"}}
                        selectable={true}
                        onSelectSlot={onSelect}
                        onSelectEvent={onSelectEvent}
                        titleAccessor={() => ""}

                    />
                </div>
            </div>
        </div>
    )
}


function CreatePollTopBar(props){
    return (
        <div className='demo-app-sidebar'>
            <div className='demo-app-sidebar-section'>
                <label htmlFor="event-duration">Event duration</label>

                <select name="event-duration" onChange={props.changeEventDuration}>
                    <option value="60">1h</option>
                    <option value="120">2h</option>
                    <option value="180">3h</option>

                </select>
            </div>
            <div className='demo-app-sidebar-section'>
                <TextField label="Poll Title" onChange={props.changeTitle} placeholder={props.title}/>
            </div>
            <div className='demo-app-sidebar-section'>
                <Button onClick={props.onSubmitPoll} variant="contained" color="primary" > Create form </Button>
            </div>
        </div>
    )
}

export default CreatePoll