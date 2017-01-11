import React, {PropTypes} from 'react'
import store from '../../store/store'

import messegesGroupStyle from '../../style/chat/messagesGroup.scss'

import Message from './Message.jsx'

const getGroupStyle = (sender) => {
  let isYourGroup = store.getState().chatState.userName === sender
  return messegesGroupStyle.group + ' ' + (isYourGroup ? messegesGroupStyle.your : '')
}

const MessageGroup = ({msgs}) => (
  <li className={getGroupStyle(msgs[0].sender)}>
    <div className={messegesGroupStyle.sender}>
      <strong>{msgs[0].sender}</strong>
    </div>
    <ul>
      {
        msgs.map((msg) => {
          return (
            <Message {...msg} />
          )
        })
      }
    </ul>
  </li>
)

MessageGroup.PropTypes = {
  msgs: PropTypes.array
}

export default MessageGroup
