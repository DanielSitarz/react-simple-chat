/*React*/
import React, {Component} from 'react';
import { Router, Route, Link, browserHistory } from 'react-router'

/*Styles*/
import styles from './style/index.scss';

/*My Components*/
import ChatContainer from './components/Chat/ChatContainer';
import NameInputContainer from './components/nameInput/NameInputContainer';
import RoomsContainer from './components/rooms/RoomsContainer';


class App extends Component {  
  render() {    
    return (
      <Router history={browserHistory}>
        <Route path="/" component={NameInputContainer}/>
        <Route path="/chat" component={NameInputContainer}/>
        <Route path="/rooms" component={RoomsContainer}/>
        <Route path="/chat/:room" component={ChatContainer}/>
      </Router>        
    )
  }
}

export default App;