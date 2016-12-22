import React from 'react';
import styles from '../style/index.scss';

import ChatMessageGroup from './chatMessageGroup.jsx';

class ChatMessages extends React.Component {    
  componentDidUpdate(){    
    this.scrollChatToBottom();
  }
  scrollChatToBottom(){
    const chatMessagesBox = this.refs.chatMessagesBox;
    chatMessagesBox.scrollTop = chatMessagesBox.scrollHeight;
  }  
  render(){
    let msgs = this.props.messages;    
  
    let messagesGroups = [];
    let messagesToGroup = [];    
    
    let i = 0;
    while(i < msgs.length){
      messagesToGroup.push(msgs[i]);
      
      if(msgs[i+1] == undefined || msgs[i].sender != msgs[i+1].sender) {
        messagesGroups.push(
          <ChatMessageGroup messages={messagesToGroup} key={messagesToGroup[0].key} />
        );
        messagesToGroup = [];
      }

      i++;
    }
    
    return(
      <div className={styles.chatMessages} ref="chatMessagesBox">
          <ul>
            {messagesGroups}
          </ul>
      </div>
    );
  }
}

export default ChatMessages;