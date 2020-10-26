import { useEffect, useState} from 'react'
import React from 'react'
import { Calendar, momentLocalizer} from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'


import {BrowserRouter, Route, NavLink, Switch, Link, useHistory} from "react-router-dom";

import firebase from './firebase'
import SignInScreen from "./account";
import CreatePoll from "./createPoll";
import VotePoll from "./votePoll";
import ViewPoll from "./viewPoll"

let database =  firebase.database();

const localizer = momentLocalizer(moment)

Array.prototype.uniqueEvents = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i].start.getTime() === a[j].start.getTime())
                a.splice(j--, 1);
        }
    }

    return a;
};

function App(props) {
        return (
        <BrowserRouter>
            <header className="header">
                <NavLink to="/">Home</NavLink>
                <div className='header-right'>
                    <NavLink to="/create">Create Poll</NavLink>
                    <NavLink to="/login">Account</NavLink>
                </div>
            </header>
            <Switch>
                <Route path="/create" render={(props) => {return <CreatePoll history={props.history} match={props.match}/>}} /> //can remove this quick hack
                <Route path="/vote/:pollId" component={VotePoll} />
                <Route path="/view/:pollId" component={ViewPoll} />
                <Route path="/login/:redirect?" component={SignInScreen}/>
                <Route path="/" render={(props) => <Home history={props.history} match={props.match}/>} />
                <Route render={() => <h1>404: page not found</h1>} />
            </Switch>
            <button onClick={() => firebase.auth().signOut()} className="footer">Logout</button>
        </BrowserRouter>
        )
}

function Home(props){

    let [polls, setPolls] = useState([])

    useEffect(()=> {
        database.ref('/polls').once('value').then((polls) => {
            polls = polls.val()
            let pollsList = []
            for (const key in polls){
                pollsList.push({key: key, title: polls[key].title})
            }
            setPolls(pollsList)
        }, (error) => {
            console.log(error)
        })
    }, [])

    return(
        <div className='home'>
            Select a poll
            <ul>
                {polls.map(poll =>
                    <li key={poll.key}>{poll.title}&nbsp;
                    <Link to={'/vote/' + poll.key}>Vote</Link>&nbsp;
                    <Link to={'/view/' + poll.key}>View Results</Link></li>)}
            </ul>
        </div>)
}
// function eventNotPresent(eventStart, events){
//     console.log(events)
//     events.forEach(
//         (ev) => {
//             if (ev.start === eventStart) {
//                 return false
//             }}
//     )
//     return true
// }


export default App
