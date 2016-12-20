import React from 'react';
import styles from '../style/index.scss';

import ChatMessage from './chatMessage.jsx';

class ChatMessages extends React.Component {  
  componentDidUpdate(){    
    this.scrollChatToBottom();
  }
  scrollChatToBottom(){
    const chatMessagesBox = this.refs.chatMessagesBox;
    chatMessagesBox.scrollTop = chatMessagesBox.scrollHeight;
  }  
  render(){
    const msgs = this.props.messages.map((a) => {      
      return (
        <ChatMessage key={a.key} sender={a.sender} msg={a.msg} />
      )
    });
    
    return(
      <div className={styles.chatMessages} ref="chatMessagesBox">
          <ul>
            {msgs}            
          </ul>
        </div>
    );
  }
}

export default ChatMessages;