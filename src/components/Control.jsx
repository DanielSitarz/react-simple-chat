import React, { PureComponent } from 'react'
import store from '../store/store'
import pendingMessage from '../modules/pendingMessage'
import style from '../style/Chat.scss'

class Control extends PureComponent {
  constructor (props) {
    super()

    this.maxSendPower = 500
    this.sendPowerDiff = this.maxSendPower - 100
    this.maxSendTime = 3000

    this.state = {
      power: 100
    }

    this.sendStart = 0
    this.isSendingMsg = false
    this.riseInterval = null

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
  resetPower () {
    this.setState({
      power: 100
    })
  }
  getNewPower () {
    var t = new Date().getTime() - this.sendStart
    if (t > this.maxSendTime) this.sendStart = new Date().getTime()

    return 100 + this.sendPowerDiff * t / this.maxSendTime
  }
  risePower () {
    var newPower = this.getNewPower()

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
    this.stopRising()
    store.dispatch({
      type: 'DELETE_PENDING_MSG'
    })
  }
  handleSendButtonDown () {
    if (this.isSendingMsg === true) return
    if (this.messageInput.textContent === '') return
    pendingMessage.set(this.messageInput.textContent)
    // this.startMessageSend()
  }
  startMessageSend () {
    if (this.messageInput.textContent === '') return

    this.sendStart = new Date().getTime()

    this.setPendingMessage()
    this.repeatRisingPower()

    this.isSendingMsg = true
  }
  setPendingMessage () {
    this.props.setPendingMessage({
      content: this.messageInput.textContent
    })
  }
  repeatRisingPower () {
    this.stopRising()
    this.riseInterval = setInterval(() => {
      this.risePower()
    }, 100)
  }
  handleSendButtonRelease () {
    if (!this.isSendingMsg) return

    this.stopRising()

    store.dispatch({
      type: 'UPDATE_PENDING_MSG_POWER',
      power: this.state.power
    })

    this.props.acceptMessage()

    this.cleanupSend()
  }
  cleanupSend () {
    this.isSendingMsg = false
    this.messageInput.textContent = ''
    this.messageInput.focus()
    this.resetPower()
  }
  stopRising () {
    window.clearInterval(this.riseInterval)
    this.riseInterval = null
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
