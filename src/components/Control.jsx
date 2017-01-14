import React, { PureComponent } from 'react'

import style from '../style/Chat.scss'

class Control extends PureComponent {
  constructor (props) {
    super()

    document.addEventListener('keypress', this.handleKeyPress.bind(this))
  }
  componentWillUnmount () {
    document.removeEventListener('keypress')
  }
  handleKeyPress (e) {
    if (e.keyCode === 13) {
      this.handleSendMessage()
    }
  }
  handleSendMessage () {
    this.props.handleSendMessage({
      content: this.messageInput.textContent
    })

    this.messageInput.textContent = ''
    this.messageInput.focus()
  }
  render () {
    return (
      <div autoComplete='off' className={style.chatControl}>
        <div
          className={style.messageInput}
          contentEditable
          placeholder='Type...'
          ref={(ref) => { this.messageInput = ref }}
          onChange={this.props.handleMessageTyping}
        />
        <button onClick={(e) => { this.handleSendMessage(e) }}>
          Send
        </button>
      </div>
    )
  }
}

export default Control
