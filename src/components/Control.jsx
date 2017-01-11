import React, { Component } from 'react'
import style from '../style/Chat.scss'

class Control extends Component {
  constructor (props) {
    super()

    this.minSendPower = 100
    this.sendPower = this.minSendPower
    this.isHolding = false
    this.keyDownStartTime = 0

    this.sendPowerMaxChange = props.maxSendPower - 100

    document.addEventListener('keydown', this.handleKeyDown.bind(this))
    document.addEventListener('keyup', this.handleKeyUp.bind(this))
  }
  componentWillUnmount () {
    document.removeEventListener('keydown')
    document.removeEventListener('keyup')
  }
  handleKeyDown (e) {
    if (e.keyCode === 13) {
      if (this.isHolding === false) {
        this.keyDownStartTime = new Date().getTime()
        this.isHolding = true
      }
      this.sendPower = this.props.messagePowerGainEaseFunc(new Date().getTime() - this.keyDownStartTime, this.minSendPower, this.sendPowerMaxChange, this.props.sendDuration)
      if (this.sendPower > this.props.maxSendPower) {
        this.sendPower = this.minSendPower
        this.isHolding = false
        return false
      }
    }
  }
  handleKeyUp (e) {
    if (e.keyCode === 13) {
      this.sendMessage()
    }
  }
  sendMessage () {
    this.isHolding = false

    this.props.handleSendMessage({
      content: this.refs.message.value,
      power: this.sendPower
    })
    this.sendPower = this.minSendPower
    this.refs.message.value = ''
    this.refs.message.focus()
  }
  handleSendClick () {
    this.sendMessage()
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
