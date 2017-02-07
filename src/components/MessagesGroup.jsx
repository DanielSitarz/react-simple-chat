import React, {PropTypes} from 'react'
import store from '../store/store'

import messegesGroupStyle from '../style/chat/messagesGroup.scss'

import Message from './Message.jsx'

const getStyle = (msgs = []) => {
  let style = [messegesGroupStyle.group]

  if (msgs.length > 0) {
    if (store.getState().chatState.userName === msgs[0].sender) style.push(messegesGroupStyle.your)
    if (msgs[0].isFromBot) style.push(messegesGroupStyle.fromBot)
    if (msgs[0].isFromServer) style.push(messegesGroupStyle.fromServer)
  }

  return style.join(' ')
}

function parseTime (ms) {
  return new Date(ms).toLocaleTimeString()
}

function MessageGroup ({msgs, bots}) {
  return (
    <li className={getStyle(msgs)}>
      <div className={messegesGroupStyle.sender}>
        <strong>{msgs[0].sender}</strong> - <span>{parseTime(msgs[msgs.length - 1].time)}</span>
      </div>
      <ul>
        {
          msgs.map((msg) => {
            return (
              <Message {...msg} id={msg.key} bots={bots} />
            )
          })
        }
      </ul>
    </li>
  )
}

MessageGroup.PropTypes = {
  msgs: PropTypes.array
}

export default MessageGroup
