import React from 'react';
import styles from '../../style/index.scss';

class ChatHeader extends React.Component {  
  render() {
    return (
      <header>
        <button>P</button>
        <h2>Room: {this.props.roomName}</h2>
      </header>
    )
  }
}

export default ChatHeader;