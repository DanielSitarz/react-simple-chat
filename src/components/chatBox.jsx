import React from 'react';
import styles from '../style/index.scss';

import ChatMessages from './chatMessages.jsx';
import ChatControl from './chatControl.jsx';

import Language from '../language.js';

//import language from '../language.js';

class ChatBox extends React.Component {
  constructor(){
    super();
    this.state = {
      messageToSend: ""
    }
  }
  render() {
    return (
      <div className={styles.chatBox}>
        <header><h2>{Language.getLang().texts.chatBox.header.room}: {this.props.roomName}</h2></header>
        <ChatMessages messages={this.props.messages} />
        <ChatControl handleSendMessage={this.props.handleSendMessage} />
      </div>
    )
  }
}

export default ChatBox;