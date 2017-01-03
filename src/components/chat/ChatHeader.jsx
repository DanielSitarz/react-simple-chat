import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import style from '../../style/chat/header.scss';

const ChatHeader = ({userName, roomName, handleNameChangeModalOpen}) => (
  <header className={style.header}>      
    <span>{userName}</span>  
    <button onClick={handleNameChangeModalOpen}>Change name</button>
    <h2>Room: {roomName}</h2>
  </header>
)

ChatHeader.PropTypes = {
  userName: PropTypes.string.isRequired,
  roomName: PropTypes.string.isRequired,
  handleNameChangeModalOpen: PropTypes.func.isRequired
}

export default ChatHeader;