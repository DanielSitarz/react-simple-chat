import React, { PropTypes } from 'react';

const ChatControl = ({handleSendMessage, handleMessageTyping}) => (
  <form onSubmit={handleSendMessage} autoComplete="off">
      <input placeholder="Type..." name="message" onChange={handleMessageTyping}/>
      <button type="submit">Send</button>
    </form>
)

ChatControl.PropTypes = {
  handleSendMessage: PropTypes.func.isRequired,
  handleMessageTyping: PropTypes.func.isRequired
}

export default ChatControl;