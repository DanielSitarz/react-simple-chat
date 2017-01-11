import React, { Component } from 'react'
import style from '../../style/Chat.scss'

class Control extends Component {
  constructor () {
    super()
    document.addEventListener('keypress', this.handleKeyPress.bind(this))
  }
  componentWillInmount () {
    document.removeEventListener('keypress')
  }
  handleKeyPress (e) {
    if (e.keyCode === 13) {
      this.handleSendClick()
    }
  }
  handleSendClick () {
    this.props.handleSendMessage(this.refs.message)
  }
  render () {
    return (
      <div autoComplete='off' className={style.chatControl}>
        <input
          placeholder='Type...'
          ref='message'
          onChange={this.props.handleMessageTyping} />
        <button
          onClick={this.handleSendClick.bind(this)}>
          Send
        </button>
      </div>
    )
  }
}

export default Control
