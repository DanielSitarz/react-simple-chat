import React, { PureComponent } from 'react'
import store from '../store/store'

import style from '../style/Chat.scss'

class Control extends PureComponent {
  constructor (props) {
    super()

    this.state = {
      power: 100
    }

    this.mouseDown = false

    document.addEventListener('keydown', this.handleKeyDown.bind(this))
    document.addEventListener('keyup', this.handleKeyUp.bind(this))
  }
  componentWillUnmount () {
    document.removeEventListener('keydown')
  }
  handleKeyDown (e) {
    if (this.mouseDown) return
    if (e.keyCode === 13) {
      this.handleMouseDown()
    }
  }
  handleKeyUp (e) {
    if (e.keyCode === 13) {
      this.handleMouseUp()
    }
  }
  resetPower () {
    this.mouseDown = false
    this.setState({
      power: 100
    })
  }
  raisePower () {
    this.setState({
      power: this.state.power + 5
    })
    if (this.state.power > 500) {
      store.dispatch({
        type: 'DELETE_LAST_MSG'
      })
      this.resetPower()
    }
  }
  handleMouseDown () {
    if (this.messageInput.textContent === '') return

    this.mouseDown = true

    this.handleSendMessage()

    this.repeatMouseDown()
  }
  repeatMouseDown () {
    setTimeout(() => {
      if (this.mouseDown) {
        this.raisePower()
        this.repeatMouseDown()
        store.dispatch({
          type: 'SET_LAST_MESSAGE_POWER',
          power: this.state.power
        })
      }
    }, 2000 / this.state.power)
  }
  handleMouseUp () {
    if (!this.mouseDown) return
    this.resetPower()

    this.messageInput.textContent = ''
    this.messageInput.focus()

    this.props.acceptMessage(this.state.power)
  }
  handleSendMessage () {
    this.props.handleSendMessage({
      content: this.messageInput.textContent
    })
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
          onMouseUp={(e) => { this.handleMouseUp(e) }}
          onMouseDown={(e) => { this.handleMouseDown(e) }}
        >
          Send {this.state.power}
        </button>
      </div>
    )
  }
}

export default Control
