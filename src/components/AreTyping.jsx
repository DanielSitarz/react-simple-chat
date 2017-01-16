import React, { PropTypes } from 'react'
import style from '../style/Chat.scss'

function AreTyping ({areTyping}) {
  return (
    <div className={style.isTypingBox}>
      {
          areTyping.map((e, i) => {
            return (<span key={i}>{e} is typing...</span>)
          })
      }
    </div>
  )
}

AreTyping.PropTypes = {
  areTyping: PropTypes.array
}

export default AreTyping
