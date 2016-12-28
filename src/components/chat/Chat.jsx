import React from 'react';
import chatStyle from '../../style/Chat.scss';

import ChatHeader from './ChatHeader.jsx';
import ChatMessages from './ChatMessages.jsx';
import ChatControl from './ChatControl.jsx';

class Chat extends React.Component {
  render() {
    return (
      <div className={chatStyle.Chat}>
        <ChatHeader roomName={this.props.roomName}></ChatHeader>        
        <ChatMessages messages={this.props.messages} />
        <ChatControl handleSendMessage={this.props.handleSendMessage} />
      </div>
    )
  }
}

export default Chat;