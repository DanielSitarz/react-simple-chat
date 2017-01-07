import React from 'react'
import { Router, Route, browserHistory } from 'react-router'

/* My Components */
import ChatContainer from './containers/ChatContainer'

let baseURL = '/chat/'

export default (
  <Router history={browserHistory}>
    <Route path={baseURL} component={ChatContainer} />
    <Route path={baseURL + 'room'} component={ChatContainer} />
    <Route path={baseURL + 'room/:roomName'} component={ChatContainer} />
  </Router>
)
