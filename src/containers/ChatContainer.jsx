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

/**
 * Socket consts
 */
const USER_ENTER_ROOM = 'user enter room'
const USER_LEFT_ROOM = 'user left room'
const USER_SENT_MESSAGE = 'user sent message'
const USER_IS_TYPING = 'user is typing'
const USER_STOPPED_TYPING = 'user stopped typing'
const USER_CHANGED_NAME = 'user changed name'

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

    this.socket.on(USER_SENT_MESSAGE, this.onReceiveMessage.bind(this))
    this.socket.on(USER_IS_TYPING, this.onTypingStart.bind(this))
    this.socket.on(USER_STOPPED_TYPING, this.onTypingStop.bind(this))

    this.socket.on(USER_ENTER_ROOM, this.onUserEnterTheRoom.bind(this))
    this.socket.on(USER_LEFT_ROOM, this.onUserDisconnected.bind(this))
    this.socket.on(USER_CHANGED_NAME, this.onUserChangedName.bind(this))
  }
  enterRoom () {
    this.socket.emit(USER_ENTER_ROOM, {
      userName: this.props.userName,
      roomName: this.props.params.roomName
    })
    this.loadMessagesFromLocalStorage()
    this.sendUserConnectedMessage(this.props.userName)
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
    this.sendUserConnectedMessage(userName)
  }
  onUserDisconnected (userName) {
    this.sendUserDisconnectedMessage(userName)
  }
  onUserChangedName (data) {
    this.sendUserChangedNameMessage(data.oldName, data.newName)
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

    this.socket.emit(USER_SENT_MESSAGE, newMessage)
    this.socket.emit(USER_STOPPED_TYPING, this.props.userName)

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

    this.socket.emit(USER_IS_TYPING, this.props.userName)
  }
  startTypingTimeout () {
    window.clearTimeout(this.isTypingTimeout)
    this.isTypingTimeout = window.setTimeout(() => {
      this.youAreTyping = false
      this.socket.emit(USER_STOPPED_TYPING, this.props.userName)
    }, 3000)
  }

  handleNameChange (newName) {
    this.socket.emit(USER_CHANGED_NAME, newName)

    store.dispatch({
      type: 'USER_SET_NAME',
      name: newName
    })

    this.sendUserChangedNameMessage(this.props.userName, newName)
  }

  /**
   * Notifiers
   */
  sendUserChangedNameMessage (oldName, newName) {
    let msg = this.messagesCreator.fromServer(oldName + ' changes name to ' + newName + '.')

    this.props.addMsg(msg)
  }
  sendUserConnectedMessage (userName) {
    let msg = this.messagesCreator.fromServer(userName + ' connected.')

    this.props.addMsg(msg)
  }
  sendUserDisconnectedMessage (userName) {
    let msg = this.messagesCreator.fromServer(userName + ' disconnected.')

    this.props.addMsg(msg)
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
