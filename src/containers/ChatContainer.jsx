import React from 'react'
import { connect } from 'react-redux'

import chatStyle from '../style/Chat.scss'

/* My Components */
import ChatHeader from '../components/chat/ChatHeader.jsx'
import ChatMessages from '../components/chat/ChatMessages.jsx'
import ChatAreTyping from '../components/chat/ChatAreTyping.jsx'
import ChatControl from '../components/chat/ChatControl.jsx'

import NewMessageNotification from '../helpers/NewMessageNotification'
import messagesCreator from '../helpers/messagesCreator'

import store from '../store/store'
import { addMessage, userEnterTheRoom, setMessages, setRoomName, stoppedTyping } from '../store/actionCreators'
import Socket from '../helpers/Socket'

class ChatContainer extends React.Component {
  constructor (props) {
    super(props)

    this.chatMessagesComponent = null

    this.isTypingTimeout = null

    this.newMessageNotification = new NewMessageNotification()

    window.addEventListener('resize', this.scrollToBottom.bind(this))

    this.setupSocket()
    this.bindEvents()
    this.enterRoom()
  }
  componentDidUpdate () {
    this.saveMessagesToLocalStorage()
  }
  saveMessagesToLocalStorage () {
    window.localStorage.setItem(this.props.params.roomName + '_messages', JSON.stringify(this.props.messages))
  }
  setupSocket () {
    this.socket = new Socket()

    this.socket.onReceiveMessage = (data) => this.newMessageNotification.notify()
  }
  bindEvents () {
    this.handleSendMessage = this.handleSendMessage.bind(this)
    this.handleMessageTyping = this.handleMessageTyping.bind(this)
    this.scrollToBottom = this.scrollToBottom.bind(this)
  }
  enterRoom () {
    this.loadMessagesFromLocalStorage()
    store.dispatch(setRoomName(this.props.params.roomName))
    store.dispatch(userEnterTheRoom(this.props.userName))
    this.socket.userEnterRoom(this.props.userName, this.props.roomName)

    this.sendWelcomeMessage()
  }
  sendWelcomeMessage () {
    store.dispatch(addMessage(messagesCreator.create({
      sender: 'Daniel',
      content: 'https://media.giphy.com/media/ASd0Ukj0y3qMM/giphy.gif'
    })))
  }
  loadMessagesFromLocalStorage () {
    let loadedMessages = JSON.parse(window.localStorage.getItem(this.props.params.roomName + '_messages'))
    if (loadedMessages) {
      store.dispatch(setMessages(loadedMessages))
    }
  }

  handleSendMessage (inputField) {
    let msg = inputField.value
    if (msg === '') return

    const newMessage = messagesCreator.create({
      sender: this.props.userName,
      content: msg
    })

    store.dispatch(addMessage(newMessage))
    this.socket.userSentMessage(newMessage)

    store.dispatch(stoppedTyping(this.props.userName))
    this.socket.userStoppedTyping(this.props.userName)
    this.clearTypingTimeout()

    this.resetMessageInputField(inputField)
  }
  resetMessageInputField (inputField) {
    inputField.value = ''
    inputField.focus()
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

  render () {
    return (
      <div className={chatStyle.Chat}>
        <ChatHeader
          userName={this.props.userName}
          roomName={this.props.roomName}
          handleNameChangeModalOpen={this.handleNameChangeModalOpen} />

        <ChatMessages
          scrollToBottom={this.scrollToBottom}
          messages={this.props.messages.toJS()}
          ref='chatMessages' />

        <ChatAreTyping areTyping={this.props.areTyping} />

        <ChatControl
          handleSendMessage={this.handleSendMessage}
          handleMessageTyping={this.handleMessageTyping} />
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
