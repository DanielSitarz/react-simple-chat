import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import style from '../../style/chat/header.scss';

const ChatHeader = ({roomName}) => (
  <header className={style.header}>        
    <Link to="/">Change name</Link>
    <h2>Room: {roomName}</h2>
  </header>
)

ChatHeader.PropTypes = {
  roomName: PropTypes.string.isRequired
}

export default ChatHeader;