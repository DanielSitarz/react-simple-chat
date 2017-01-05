import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import style from '../../style/chat/header.scss';

const ChatHeader = ({userName, roomName, handleChangeName, handleChangeRoom}) => (
  <header className={style.header}>      
    <div className={style.roomName}>{roomName}</div>    
    <div className={style.userName}>{userName}</div>          
  </header>
)

ChatHeader.PropTypes = {
  userName: PropTypes.string.isRequired,
  roomName: PropTypes.string.isRequired,
  handleChangeName: PropTypes.func.isRequired,
  handleChangeRoom: PropTypes.func.isRequired
}

export default ChatHeader;