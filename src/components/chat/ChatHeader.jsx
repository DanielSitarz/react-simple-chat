import React from 'react';
import {Link} from 'react-router';
import style from '../../style/chat/header.scss';

class ChatHeader extends React.Component {  
  render() {
    return (
      <header className={style.header}>        
        <Link to="/">Change name</Link>
        <h2>Room: {this.props.roomName}</h2>
      </header>
    )
  }
}

export default ChatHeader;