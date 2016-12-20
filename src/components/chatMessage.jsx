import React from 'react';

class ChatMessage extends React.Component {
  render() {
    return (
      <li><p><span>{this.props.sender}:</span>{this.props.msg}</p></li>
    )
  }
}

export default ChatMessage;