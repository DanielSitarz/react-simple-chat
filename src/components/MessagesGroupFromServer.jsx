import React, {PropTypes} from 'react'

import messegesGroupStyle from '../../style/chat/messagesGroup.scss'

import Message from './Message.jsx'

const MessagesGroupFromServer = ({msgs}) => (
  <li className={messegesGroupStyle.group + ' ' + messegesGroupStyle.fromServer}>
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

MessagesGroupFromServer.PropTypes = {
  msgs: PropTypes.array
}

export default MessagesGroupFromServer
