import React from 'react';

import styles from '../style/index.scss';

import ChatMessage from './chatMessage.jsx';

class ChatMessageGroup extends React.Component {  
  render() {
    const msgs = this.props.messages.map((a) => {                                    
      return (        
        <ChatMessage key={a.key} sender={a.sender} msg={a.msg} />
      )
    });

    return (
      <li className={styles.chatMessageGroup}>
        <p className={styles.chatMessageGroupSender}>
          <strong>{this.props.messages[0].sender}</strong>
        </p>
        <div className={styles.chatMessageGroupMessages}>
          {msgs}
        </div>
      </li>
    )
  }
}

export default ChatMessageGroup;