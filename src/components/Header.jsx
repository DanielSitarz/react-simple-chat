import React, {PropTypes} from 'react'
import style from '../style/chat/header.scss'

const Header = ({userName, roomName}) => (
  <header className={style.header}>
    <div className={style.userName}>{userName}</div>
    <div className={style.roomName}>{roomName}</div>
  </header>
)

Header.PropTypes = {
  userName: PropTypes.string.isRequired,
  roomName: PropTypes.string.isRequired
}

export default Header
