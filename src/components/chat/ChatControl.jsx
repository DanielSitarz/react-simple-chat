import React, { Component } from 'react'
import style from '../../style/Chat.scss'

class ChatControl extends Component {
  render () {
    return (
      <div autoComplete='off' className={style.chatControl}>
        <input
          placeholder='Type...'
          ref='message'
          onChange={this.props.handleMessageTyping} />
        <button
          onClick={(e) => { this.props.handleSendMessage(this.refs.message) }}>
          Send
        </button>
      </div>
    )
  }
}

export default ChatControl
