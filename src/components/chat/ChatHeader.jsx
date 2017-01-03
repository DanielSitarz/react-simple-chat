import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import style from '../../style/chat/header.scss';

const ChatHeader = ({userName, roomName, handleNameChangeModalOpen}) => (
  <header className={style.header}>      
    <div className={style.userName}>{userName}</div>  
    <button onClick={handleNameChangeModalOpen}>Change name</button>
    <div className={style.roomName}>Room: {roomName}</div>
  </header>
)

ChatHeader.PropTypes = {
  userName: PropTypes.string.isRequired,
  roomName: PropTypes.string.isRequired,
  handleNameChangeModalOpen: PropTypes.func.isRequired
}

export default ChatHeader;