import React from 'react';
import styles from '../../style/index.scss';

import ChatMessageGroup from './ChatMessageGroup.jsx';

class ChatMessages extends React.Component {    
  componentDidUpdate(){        
    this.scrollChatToBottom();
  }
  scrollChatToBottom(){
    const chatMessagesBox = this.refs.chatMessagesBox;
    chatMessagesBox.scrollTop = chatMessagesBox.scrollHeight;
  }  
  groupMessagesBySender(){
    let msgs = this.props.messages;    
  
    let groupedMessages = [];
    let messagesToGroup = [];    
    
    let i = 0;
    while(i < msgs.length){
      messagesToGroup.push(msgs[i]);
      
      if(msgs[i+1] == undefined || msgs[i].sender != msgs[i+1].sender) {
        groupedMessages.push(
          <ChatMessageGroup messages={messagesToGroup} key={messagesToGroup[0].key} />
        );
        messagesToGroup = [];
      }
      i++;
    }

    return groupedMessages;
  }
  render(){
    return(
      <div className={styles.chatMessages} ref="chatMessagesBox">
          <ul>
            {this.groupMessagesBySender()}
          </ul>
      </div>
    );
  }
}

export default ChatMessages;