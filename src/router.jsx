import React from 'react';
import { Router, Route, Link, browserHistory } from 'react-router'

/*My Components*/
import ChatContainer from './containers/ChatContainer';

export default (
    <Router history={browserHistory}>
        <Route path="/" component={ChatContainer}/>
        <Route path="/room" component={ChatContainer}/>        
        <Route path="/room/:roomName" component={ChatContainer}/>
    </Router> 
)