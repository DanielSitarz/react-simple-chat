import React, { PropTypes } from 'react';
import style from '../../style/Chat.scss';

const ChatControl = ({handleSendMessage, handleMessageTyping}) => (
  <form onSubmit={handleSendMessage} autoComplete="off" className={style.chatControl}>
      <input placeholder="Type..." name="message" onChange={handleMessageTyping}/>
      <button type="submit">Send</button>
    </form>
)

ChatControl.PropTypes = {
  handleSendMessage: PropTypes.func.isRequired,
  handleMessageTyping: PropTypes.func.isRequired
}

export default ChatControl;