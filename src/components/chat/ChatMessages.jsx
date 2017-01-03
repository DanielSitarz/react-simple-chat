import React from 'react';
import chatStyle from '../../style/Chat.scss';

import ChatMessagesGroup from './ChatMessagesGroup';
import ChatMessagesGroupFromServer from './ChatMessagesGroupFromServer';

class ChatMessages extends React.Component {  
  componentDidUpdate(){            
    this.scrollToBottom();    
  }
  scrollToBottom(){
    const chatMessagesBox = this.refs.chatMessagesBox;
    chatMessagesBox.scrollTop = chatMessagesBox.scrollHeight;
  }    
  render(){    
    return(
      <ul className={chatStyle.messages} ref="chatMessagesBox">
        {          
          groupMessages(this.props.messages).map((group) => {
            if(group.msgs[0].power == 0 && group.msgs[0].isServerMsg)
              return(<ChatMessagesGroupFromServer {...group} />)
            else 
              return(<ChatMessagesGroup {...group} />)
          })
        }
      </ul>
    );
  }
}

const groupMessages = (msgs = []) => {
  let groupedMessages = [];                              
  let messagesToGroup = [];    
  
  let i = 0;
  while(i < msgs.length){
    messagesToGroup.push(msgs[i]);    
    if(msgs[i+1] == undefined || msgs[i].sender != msgs[i+1].sender) {
      groupedMessages.push(
        {
          msgs: messagesToGroup,
          key: messagesToGroup[0].key
        }
      );
      messagesToGroup = [];
    }
    i++;
  }    

  return groupedMessages;
}

export default ChatMessages;