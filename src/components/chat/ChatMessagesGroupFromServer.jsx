import React, {PropTypes} from 'react'

import messegesGroupStyle from '../../style/chat/messagesGroup.scss'

import ChatMessage from './ChatMessage.jsx'

const ChatMessagesGroupFromServer = ({msgs}) => (
  <li className={messegesGroupStyle.group + ' ' + messegesGroupStyle.fromServer}>
    <ul>
      {
        msgs.map((msg) => {
          return (
            <ChatMessage {...msg} />
          )
        })
      }
    </ul>
  </li>
)

ChatMessagesGroupFromServer.PropTypes = {
  msgs: PropTypes.array
}

export default ChatMessagesGroupFromServer
