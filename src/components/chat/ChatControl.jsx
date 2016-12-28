import React from 'react';

class ChatControl extends React.Component {   
  render() {
    return (
      <form onSubmit={this.props.handleSendMessage} autoComplete="off">
          <input placeholder="Type..." ref="message" name="message"/>
          <button type="submit">Send</button>
        </form>
    )
  }
}

export default ChatControl;