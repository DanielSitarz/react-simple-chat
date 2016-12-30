import React, {PropTypes} from 'react';

import messegesGroupStyle from '../../style/chat/messagesGroup.scss';

import ChatMessage from './ChatMessage.jsx';

const ChatMessageGroup = ({messages}) => (
  <li className={messegesGroupStyle.group}>
    <div className={messegesGroupStyle.sender}>
      <strong>{messages[0].sender || "Anonymous"}</strong>
    </div>
    <ul>
      {
        messages.map((a) => {                                    
            return (        
              <ChatMessage key={a.key} sender={a.sender} msg={a.msg} />
            )
        })
      }
    </ul>
  </li>
)

export default ChatMessageGroup;