import React from 'react';

class ChatMessage extends React.Component {
  render() {
    return (
      <div>
        <p>{this.props.msg}</p>
      </div>
    )
  }
}

export default ChatMessage;