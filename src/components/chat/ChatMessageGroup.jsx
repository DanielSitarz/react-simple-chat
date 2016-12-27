import React from 'react';

import styles from '../../style/index.scss';

import ChatMessage from './ChatMessage.jsx';

class ChatMessageGroup extends React.Component {  
  render() {        
    return (
      <li className={styles.chatMessageGroup}>
        <p className={styles.chatMessageGroupSender}>
          <strong>{this.props.messages[0].sender}</strong>
        </p>
        <div className={styles.chatMessageGroupMessages + " " + (this.props.messages[0].sender == window.yourName ? styles.mine : "")}>
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