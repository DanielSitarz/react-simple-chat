import React from 'react';

import messegesGroupStyle from '../../style/chat/messagesGroup.scss';

import ChatMessage from './ChatMessage.jsx';

class ChatMessageGroup extends React.Component {    
  render() {            
    return (
      <li className={messegesGroupStyle.group}>
        <div className={messegesGroupStyle.sender}>
          <strong>{this.props.messages[0].sender || "Anonymous"}</strong>
        </div>
        <ul>
          {
            this.props.messages.map((a) => {                                    
                return (        
                  <ChatMessage key={a.key} sender={a.sender} msg={a.msg} />
                )
            })
          }
        </ul>
      </li>
    )
  }
}

export default ChatMessageGroup;