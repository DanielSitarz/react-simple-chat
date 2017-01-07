import React, {PropTypes} from 'react'
import style from '../../style/chat/header.scss'

const ChatHeader = ({userName, roomName, handleChangeName, handleChangeRoom}) => (
  <header className={style.header}>
    <div className={style.userName}>{userName}</div>
    <div className={style.roomName}>{roomName}</div>
  </header>
)

ChatHeader.PropTypes = {
  userName: PropTypes.string.isRequired,
  roomName: PropTypes.string.isRequired,
  handleChangeName: PropTypes.func.isRequired,
  handleChangeRoom: PropTypes.func.isRequired
}

export default ChatHeader
