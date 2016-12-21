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
    let previousSender = null;    
  
    let messagesGroups = [];
    let messagesToGroup = [];

    console.log(msgs);
    
    for(let i = 0; i < msgs.length;){               
      while(1){                    
        messagesToGroup.push(msgs[i]);

        i++;                

        if(i >= msgs.length) break;        
        if(msgs[i].sender != msgs[i-1].sender) break;        
      }                
      if(messagesToGroup.length > 0){        
        messagesGroups.push(
          <ChatMessageGroup messages={messagesToGroup} key={messagesToGroup[0].key} />
        );
        messagesToGroup = [];
      }                  
    }

    console.log(messagesGroups);
    
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