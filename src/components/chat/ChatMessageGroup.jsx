import React from 'react';

import chatStyle from '../../style/Chat.scss';

import ChatMessage from './ChatMessage.jsx';

class ChatMessageGroup extends React.Component {  
  render() {        
    return (
      <li className={chatStyle.group}>
        <p className={chatStyle.groupSender}>
          <strong>{this.props.messages[0].sender}</strong>
        </p>
        <div className={chatStyle.groupMessages + " " + (this.props.messages[0].sender == window.yourName ? styles.mine : "")}>
        {
          this.props.messages.map((a) => {                                    
              return (        
                <ChatMessage key={a.key} sender={a.sender} msg={a.msg} />
              )
          })
        }
        </div>
      </li>
    )
  }
}

export default ChatMessageGroup;