import React, { PureComponent } from 'react'
import store from '../store/store'

import style from '../style/Chat.scss'

class Control extends PureComponent {
  constructor (props) {
    super()

    this.maxSendPower = 500

    this.state = {
      power: 100
    }

    this.sendStart = 0
    this.isSendingMsg = false
    this.raiseInterval = null

    this.startMessageSend = this.startMessageSend.bind(this)

    document.addEventListener('keypress', this.handleKeyPress.bind(this))
    document.addEventListener('keyup', this.handleKeyUp.bind(this))
  }
  handleKeyPress (e) {
    if (this.isSendingMsg) {
      return
    }
    if (e.keyCode === 13) {
      this.startMessageSend()
      e.preventDefault()
    }
  }
  handleKeyUp (e) {
    if (e.keyCode === 13) {
      this.handleSendButtonRelease()
    }
  }
  resetPower () {
    this.setState({
      power: 100
    })
  }
  easeOutElastic (t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b
  }
  raisePower () {
    var t = new Date().getTime() - this.sendStart
    if (t > 5000) this.sendStart = new Date().getTime()
    var newPower = 100 + 500 * this.easeOutElastic(t, 0, 1, 5000)

    if (newPower > this.maxSendPower) {
      this.abortSendingMessage()
    } else {
      this.setState({
        power: newPower
      })
    }
  }
  abortSendingMessage () {
    this.isSendingMsg = false
    this.resetPower()
    this.stopRaising()
    store.dispatch({
      type: 'DELETE_PENDING_MSG'
    })
  }
  handleSendButtonDown () {
    this.startMessageSend()
  }
  startMessageSend () {
    if (this.messageInput.textContent === '') return

    this.sendStart = new Date().getTime()

    this.setPendingMessage()
    this.repeatRaisingPower()

    this.isSendingMsg = true
  }
  setPendingMessage () {
    this.props.setPendingMessage({
      content: this.messageInput.textContent
    })
  }
  repeatRaisingPower () {
    this.raiseInterval = setInterval(() => {
      this.raisePower()
      store.dispatch({
        type: 'UPDATE_PENDING_MSG_POWER',
        power: this.state.power
      })
    }, 100)
  }
  handleSendButtonRelease () {
    if (!this.isSendingMsg) return

    this.stopRaising()

    this.isSendingMsg = false

    this.resetPower()

    this.messageInput.textContent = ''
    this.messageInput.focus()

    this.props.acceptMessage(this.state.power)
  }
  stopRaising () {
    window.clearInterval(this.raiseInterval)
    this.raiseInterval = null
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
          onMouseUp={(e) => { this.handleSendButtonRelease(e) }}
          onMouseDown={(e) => { this.handleSendButtonDown(e) }}
        >
          Send {this.state.power}
        </button>
      </div>
    )
  }
}

export default Control
