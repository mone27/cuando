import React from 'react'
import FullCalendar, { formatDate } from '@fullcalendar/react'
import { toMoment, toMomentDuration } from '@fullcalendar/moment'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'


class DemoApp extends React.Component {
        calendarRef = React.createRef()

        constructor(props) {
                super(props);
                this.state = {events:  this.props.events}
                this.eventDuration = "01:00"
        }

        render() {
        return (
            <div className='demo-app'>
                <CalendarSidebar events={this.state.events} changeEventDuration={this.changeEventDuration}/>
                <div className='demo-app-main'>
                    <FullCalendar
                        plugins={[ timeGridPlugin, interactionPlugin]}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'timeGridWeek,timeGridDay'
                        }}
                        ref={this.calendarRef}
                        initialView='timeGridWeek'
                        editable={true}
                        selectable={true}
                        select={this.handleDateSelect}
                        events={this.props.events}
                        eventContent={renderEventContent} // custom render function
                        eventClick={this.handleEventClick}
                        eventAdd={this.handleEventChange}
                        eventChange={this.handleEventChange}
                        eventRemove={this.handleEventChange}
                    />
                </div>
            </div>

        )
    }

    // handlers for user actions
    // ------------------------------------------------------------------------------------------

    handleDateSelect = (selectInfo) => {
        let calendarApi = this.calendarRef.current.getApi()
        let title = "Event title"

        calendarApi.unselect() // clear date selection
        let start= toMoment(selectInfo.start, calendarApi)
        let end= toMoment(selectInfo.end, calendarApi)
        let duration = toMomentDuration(this.eventDuration)

        calendarApi.batchRendering( () => {
                for (let event = start; event.isBefore(end); ) {
            calendarApi.addEvent({
                title,
                start: event.format(),
                end: event.add(duration).format()
            })
        }})


    }

    handleEventClick = (clickInfo) => {
            clickInfo.event.remove() // will render immediately. will call handleEventRemove
    }

    handleEventChange = (AddInfo) => {
        this.setState({events: this.calendarRef.current.getApi().getEvents()});
    }

    changeEventDuration = (event) => {
        this.eventDuration = event.target.value
    }


}

function CalendarSidebar(props) {
    return (
        <div className='demo-app-sidebar'>
            <div className='demo-app-sidebar-section'>
                <h2>Instructions</h2>
                <ul>
                    <li>Select dates and ou will be prompted to create a new event</li>
                    <li>Drag, drop, and resize events</li>
                    <li>Click an event to delete it</li>
                </ul>
            </div>
            <div className='demo-app-sidebar-section'>
                <label htmlFor="pet-select">Event duration</label>

                <select name="event-duration" onChange={props.changeEventDuration}>
                    <option value="01:00">1h</option>
                    <option value="02:00">2h</option>
                    <option value="03:00">3h</option>

                </select>
            </div>
            {/*<div className='demo-app-sidebar-section'>*/}
            {/*    <h2>All Events ({props.events.length})</h2>*/}
            {/*    <ul>*/}
            {/*        {props.events.map(renderSidebarEvent)}*/}
            {/*    </ul>*/}
            {/*</div>*/}
        </div>
    )
}


function renderEventContent(eventInfo) {
    return (
        <>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </>
    )
}

function renderSidebarEvent(event) {
    let plainEventObject = event.toPlainObject();
    return (
        <li key={plainEventObject.id}>
            <b>{formatDate(plainEventObject.start, {year: 'numeric', month: 'short', day: 'numeric'})}</b>
            <i>{plainEventObject.title}</i>
        </li>
    )
}


export default DemoApp
