import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import style from '../../style/chat/header.scss';

const ChatHeader = ({userName, roomName, handleChangeName, handleChangeRoom}) => (
  <header className={style.header}>      
    <div className={style.userName}>{userName}</div>  
    <button onClick={handleChangeName}>Change name</button>
    <div className={style.roomName}>Room: {roomName}</div>
    <button onClick={handleChangeRoom}>Change room</button>
  </header>
)

ChatHeader.PropTypes = {
  userName: PropTypes.string.isRequired,
  roomName: PropTypes.string.isRequired,
  handleChangeName: PropTypes.func.isRequired,
  handleChangeRoom: PropTypes.func.isRequired
}

export default ChatHeader;