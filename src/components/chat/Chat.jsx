import React, { PropTypes } from 'react';

import ChatHeader from './ChatHeader.jsx';
import ChatMessages from './ChatMessages.jsx';
import ChatControl from './ChatControl.jsx';

import chatStyle from '../../style/Chat.scss';

const Chat = ({roomName, messages, handleSendMessage}) => (
  <div className={chatStyle.Chat}>
    <ChatHeader roomName={roomName}></ChatHeader>        
    <ChatMessages messages={messages} />
    <ChatControl handleSendMessage={handleSendMessage} />
  </div>
)

Chat.PropTypes = {
  roomName: PropTypes.string.isRequired,
  messages: PropTypes.array.isRequired,
  handleSendMessage: PropTypes.func.isRequired
}

export default Chat;