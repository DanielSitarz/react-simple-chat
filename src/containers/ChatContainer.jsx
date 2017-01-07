import React from 'react'

import { connect } from 'react-redux'
import store from '../store/store'

import chatStyle from '../style/Chat.scss'

/* My Components */
import ChatHeader from '../components/chat/ChatHeader.jsx'
import ChatMessages from '../components/chat/ChatMessages.jsx'
import ChatAreTyping from '../components/chat/ChatAreTyping.jsx'
import ChatControl from '../components/chat/ChatControl.jsx'

import NewMessageNotification from '../helpers/NewMessageNotification'
import MessagesCreator from '../helpers/MessagesCreator'

/* Third Party */
import io from 'socket.io-client'

class ChatContainer extends React.Component {
  constructor (props) {
    super(props)

    this.chatMessages = null

    this.isTypingTimeout = null
    this.youAreTyping = false

    this.newMessageNotification = new NewMessageNotification()
    this.messagesCreator = new MessagesCreator(this.props.params.roomName)

    window.addEventListener('resize', this.scrollToBottom.bind(this))

    this.bindEvents()
    this.setupSocket()
    this.enterRoom()
  }
  componentDidUpdate () {
    this.saveMessagesToLocalStorage()
  }
  saveMessagesToLocalStorage () {
    window.localStorage.setItem(this.props.params.roomName + '_messages', JSON.stringify(this.props.messages))
  }
  bindEvents () {
    this.handleSendMessage = this.handleSendMessage.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleMessageTyping = this.handleMessageTyping.bind(this)
    this.scrollToBottom = this.scrollToBottom.bind(this)
  }
  setupSocket () {
    this.socket = io('https://socket-chat-server-to-react.herokuapp.com/')

    this.socket.on('message', this.onReceiveMessage.bind(this))
    this.socket.on('server message', this.onReceiveServerMessage.bind(this))
    this.socket.on('is typing', this.onTypingStart.bind(this))
    this.socket.on('stopped typing', this.onTypingStop.bind(this))
    this.socket.on('user enter the room', this.onUserEnterTheRoom.bind(this))
  }
  enterRoom () {
    this.socket.emit('enter room', {
      userName: this.props.userName,
      roomName: this.props.params.roomName
    })
    this.loadMessagesFromLocalStorage()
    this.notifyAboutConnectedUser(this.props.userName)
  }
  loadMessagesFromLocalStorage () {
    let loadedMessages = JSON.parse(window.localStorage.getItem(this.props.params.roomName + '_messages'))
    store.dispatch({
      type: 'SET_MSGS',
      msgs: loadedMessages
    })
  }
  /**
   * Socket events
   */
  onReceiveMessage (data) {
    console.log(data)
    let msg = this.messagesCreator.create(data)

    this.newMessageNotification.notify()

    this.props.addMsg(msg)
  }
  onReceiveServerMessage (data) {
    let msg = this.messagesCreator.fromServer(data.content)

    this.props.addMsg(msg)
  }
  onUserEnterTheRoom (userName) {
    this.notifyAboutConnectedUser(userName)
  }
  onTypingStart (who) {
    store.dispatch({
      type: 'TYPING_START',
      who: who
    })
  }
  onTypingStop (who) {
    store.dispatch({
      type: 'TYPING_STOP',
      who: who
    })
  }

  /**
   * Message send
   */

  handleSendMessage (inputField) {
    let msg = inputField.value
    if (msg === '') return

    const newMessage = this.messagesCreator.create({
      sender: this.props.userName,
      content: msg
    })

    this.props.addMsg(newMessage)

    this.socket.emit('message', newMessage)
    this.socket.emit('stopped typing', this.props.userName)

    this.youAreTyping = false

    this.resetMessageInputField(inputField)
  }
  resetMessageInputField (inputField) {
    inputField.value = ''
    inputField.focus()
  }


  scrollToBottom () {
    this.refs.chatMessages.refs.chatMessagesBox.scrollTop = this.refs.chatMessages.refs.chatMessagesBox.scrollHeight
  }

  /**
   * Is typing
   */

  handleMessageTyping (e) {
    if (this.youAreTyping) {
      window.clearTimeout(this.isTypingTimeout)
      this.startTypingTimeout()
      return
    }

    this.youAreTyping = true

    this.startTypingTimeout()

    this.socket.emit('is typing', this.props.userName)
  }
  startTypingTimeout () {
    window.clearTimeout(this.isTypingTimeout)
    this.isTypingTimeout = window.setTimeout(() => {
      this.youAreTyping = false
      this.socket.emit('stopped typing', this.props.userName)
    }, 3000)
  }

  handleNameChange (newName) {
    this.socket.emit('name change', newName)

    store.dispatch({
      type: 'USER_SET_NAME',
      name: newName
    })

    this.notifyAboutNameChange(this.props.userName, newName)
  }

  /**
   * Notifiers
   */
  notifyAboutNameChange (oldName, newName) {
    let notificationMessage = this.messagesCreator.fromServer(oldName + ' changes name to ' + newName + '.')

    this.props.addMsg(notificationMessage)
  }
  notifyAboutConnectedUser (userName) {
    let notificationMessage = this.messagesCreator.fromServer(userName + ' connected.')

    this.props.addMsg(notificationMessage)
  }
  render () {
    return (
      <div className={chatStyle.Chat}>
        <ChatHeader
          userName={this.props.userName}
          roomName={this.props.params.roomName}
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
    messages: store.messages,
    areTyping: store.areTyping
  }
}

const mapDispatchToProps = function (dispatch) {
  return {
    addMsg: (msg) => { dispatch({ type: 'ADD_MSG', msg: msg }) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatContainer)
