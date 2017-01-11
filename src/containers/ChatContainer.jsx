import React from 'react'
import { connect } from 'react-redux'

import chatStyle from '../style/Chat.scss'

/* My Components */
import Header from '../components/Header.jsx'
import Messages from '../components/Messages.jsx'
import AreTyping from '../components/AreTyping.jsx'
import Control from '../components/Control.jsx'

import NewMessageNotification from '../helpers/NewMessageNotification'
import messagesCreator from '../helpers/messagesCreator'

import store from '../store/store'
import { addMessage, userEnterTheRoom, setMessages, setRoomName, stoppedTyping } from '../store/actionCreators'
import Socket from '../helpers/Socket'

class ChatContainer extends React.Component {
  constructor (props) {
    super(props)

    this.controlProps = {
      maxSendPower: 500,
      sendDuration: 5000,
      messagePowerGainEaseFunc: function (t, b, c, d) {
        // Circular Easing Out
        t /= d
        t--
        return c * Math.sqrt(1 - t * t) + b
      },
      handleSendMessage: this.handleSendMessage.bind(this),
      handleMessageTyping: this.handleMessageTyping.bind(this)
    }

    this.isTypingTimeout = null

    this.newMessageNotification = new NewMessageNotification()

    this.addEventListeners()
    this.setupSocket()
    this.bindEvents()
    this.enterRoom()
  }
  addEventListeners () {
    window.addEventListener('resize', this.scrollToBottom.bind(this))
  }
  setupSocket () {
    this.socket = new Socket()
    this.socket.onReceiveMessage = (data) => this.newMessageNotification.notify()
  }
  bindEvents () {
    this.scrollToBottom = this.scrollToBottom.bind(this)
  }
  enterRoom () {
    this.loadMessagesFromLocalStorage()
    store.dispatch(setRoomName(this.props.params.roomName))
    store.dispatch(userEnterTheRoom(this.props.userName))
    this.socket.userEnterRoom(this.props.userName, this.props.roomName)
  }
  loadMessagesFromLocalStorage () {
    let loadedMessages = JSON.parse(window.localStorage.getItem(this.props.params.roomName + '_messages'))
    if (loadedMessages) {
      store.dispatch(setMessages(loadedMessages))
    } else {
      this.sendWelcomeMessage()
    }
  }
  sendWelcomeMessage () {
    if (this.props.messages.size === 0) {
      store.dispatch(addMessage(messagesCreator.create({
        roomName: 'Hello',
        sender: 'Daniel',
        content: 'https://media.giphy.com/media/ASd0Ukj0y3qMM/giphy.gif'
      })))
    }
  }
  saveMessagesToLocalStorage () {
    window.localStorage.setItem(this.props.params.roomName + '_messages', JSON.stringify(this.props.messages))
  }
  handleSendMessage (data) {
    const newMessage = messagesCreator.create({
      sender: this.props.userName,
      content: data.content,
      power: data.power
    })

    store.dispatch(addMessage(newMessage))
    this.socket.userSentMessage(newMessage)

    store.dispatch(stoppedTyping(this.props.userName))
    this.socket.userStoppedTyping(this.props.userName)
    this.clearTypingTimeout()
  }
  scrollToBottom () {
    this.refs.chatMessages.refs.chatMessagesBox.scrollTop = this.refs.chatMessages.refs.chatMessagesBox.scrollHeight
  }
  handleMessageTyping (e) {
    if (this.isTypingTimeout) {
      this.clearTypingTimeout()
      this.startTypingTimeout()
      return
    }

    this.startTypingTimeout()
    this.socket.userIsTyping(this.props.userName)
  }
  startTypingTimeout () {
    this.isTypingTimeout = window.setTimeout(() => {
      store.dispatch(stoppedTyping(this.props.userName))
      this.socket.userStoppedTyping(this.props.userName)
      this.clearTypingTimeout()
    }, 3000)
  }
  clearTypingTimeout () {
    window.clearTimeout(this.isTypingTimeout)
    this.isTypingTimeout = null
  }

  componentDidUpdate () {
    this.saveMessagesToLocalStorage()
    this.scrollToBottom()
  }
  render () {
    return (
      <div className={chatStyle.Chat}>
        <Header
          userName={this.props.userName}
          roomName={this.props.roomName}
          handleNameChangeModalOpen={this.handleNameChangeModalOpen} />

        <Messages
          scrollToBottom={this.scrollToBottom}
          messages={this.props.messages.toJS()}
          ref='chatMessages' />

        <AreTyping areTyping={this.props.areTyping} />

        <Control {...this.controlProps} />
      </div>
    )
  }
}

const mapStateToProps = function (store) {
  return {
    userName: store.chatState.userName,
    roomName: store.chatState.roomName,
    messages: store.messages,
    areTyping: store.areTyping
  }
}

export default connect(mapStateToProps)(ChatContainer)
