import React, {PropTypes} from 'react';
import store from '../../store/store'

import messegesGroupStyle from '../../style/chat/messagesGroup.scss';

import ChatMessage from './ChatMessage.jsx';

const ChatMessagesGroupFromServer = ({msgs}) => (
  <li className={messegesGroupStyle.group + " " + messegesGroupStyle.fromServer}>    
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

export default ChatMessagesGroupFromServer;