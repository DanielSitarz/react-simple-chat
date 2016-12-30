import React, { PropTypes } from 'react';

const ChatControl = ({handleSendMessage}) => (
  <form onSubmit={handleSendMessage} autoComplete="off">
      <input placeholder="Type..." name="message"/>
      <button type="submit">Send</button>
    </form>
)

ChatControl.PropTypes = {
  handleSendMessage: PropTypes.func.isRequired
}

export default ChatControl;