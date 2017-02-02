import React, { PureComponent } from 'react'
import pendingMessage from '../modules/pendingMessage'
import style from '../style/Chat.scss'

class Control extends PureComponent {
  constructor (props) {
    super()

    this.isSendingMsg = false

    pendingMessage.callbacks.add('onAbort', () => { this.abort() })
    pendingMessage.callbacks.add('onSend', () => { this.cleanupSend() })

    this.startMessageSend = this.startMessageSend.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    document.addEventListener('keypress', this.handleKeyPress.bind(this))
  }
  handleKeyPress (e) {
    if (this.isSendingMsg) {
      e.preventDefault()
      return
    }
    if (e.keyCode === 13) {
      if (this.isSendingMsg || this.aborted) return
      this.startMessageSend()
      document.addEventListener('keyup', this.handleKeyUp)
      e.preventDefault()
    }
  }
  handleKeyUp (e) {
    if (e.keyCode === 13) {
      document.removeEventListener('keyup', this.handleKeyUp)
      this.handleSendButtonRelease()
    }
  }
  handleSendButtonDown () {
    if (this.isSendingMsg === true) return
    if (this.messageInput.textContent === '') return
    this.startMessageSend()
  }
  handleSendButtonRelease () {
    if (!this.isSendingMsg) return
    if (this.aborted) {
      this.isSendingMsg = false
      this.aborted = false
      return
    }
    pendingMessage.send()
  }
  startMessageSend () {
    if (this.isSendingMsg === true) return
    pendingMessage.set(this.messageInput.textContent)
    this.isSendingMsg = true
  }
  cleanupSend () {
    this.isSendingMsg = false
    this.messageInput.textContent = ''
    this.messageInput.focus()
  }
  abort () {
    this.aborted = true
  }
  render () {
    return (
      <div autoComplete='off' className={style.chatControl}>
        <div
          className={style.messageInput}
          contentEditable
          placeholder='Type...'
          ref={(ref) => { this.messageInput = ref }}
          onInput={this.props.handleMessageTyping}
        />
        <button
          type='button'
          onTouchStart={(e) => { this.handleSendButtonDown(e) }}
          onTouchEnd={(e) => { this.handleSendButtonRelease(e) }}
          onMouseDown={(e) => { this.handleSendButtonDown(e) }}
          onMouseUp={(e) => { this.handleSendButtonRelease(e) }}
        >
          Send
        </button>
      </div>
    )
  }
}

export default Control
