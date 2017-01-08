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
import { addMessage, userSetName, userEnterTheRoom, setMessages, setRoomName } from '../store/actionCreators'
import Socket from '../helpers/Socket'

class ChatContainer extends React.Component {
  constructor (props) {
    super(props)

    this.chatMessages = null

    this.isTypingTimeout = null
    this.youAreTyping = false

    this.newMessageNotification = new NewMessageNotification()

    this.socket = new Socket()

    window.addEventListener('resize', this.scrollToBottom.bind(this))

    this.bindEvents()
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
  enterRoom () {
    this.loadMessagesFromLocalStorage()
    this.socket.userEnterRoom({
      userName: this.props.userName,
      roomName: this.props.params.roomName
    })
    store.dispatch(setRoomName(this.props.params.roomName))
    store.dispatch(userEnterTheRoom(this.props.userName))
  }
  loadMessagesFromLocalStorage () {
    let loadedMessages = JSON.parse(window.localStorage.getItem(this.props.params.roomName + '_messages'))
    store.dispatch(setMessages(loadedMessages))
  }

  /**
   * Message send
   */

  handleSendMessage (inputField) {
    let msg = inputField.value
    if (msg === '') return

    const newMessage = messagesCreator.create({
      sender: this.props.userName,
      content: msg
    })

    store.dispatch(addMessage(newMessage))
    store.dispatch({
      type: 'TYPING_STOP',
      who: this.props.userName
    })

    this.socket.userSentMessage(newMessage)
    this.socket.userStoppedTyping(this.props.userName)

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

    this.socket.userIsTyping(this.props.userName)
  }
  startTypingTimeout () {
    window.clearTimeout(this.isTypingTimeout)
    this.isTypingTimeout = window.setTimeout(() => {
      this.youAreTyping = false
      this.socket.userStoppedTyping(this.props.userName)
    }, 3000)
  }

  handleNameChange (newName) {
    this.socket.userChangedName(newName)

    store.dispatch(userSetName(newName))

    this.sendUserChangedNameMessage(this.props.userName, newName)
  }

  /**
   * Notifiers
   */
  sendUserChangedNameMessage (oldName, newName) {
    let msg = messagesCreator.fromServer(oldName + ' changes name to ' + newName + '.')

    store.dispatch(addMessage(msg))
  }
  sendUserConnectedMessage (userName) {
    let msg = messagesCreator.fromServer(userName + ' connected.')

    store.dispatch(addMessage(msg))
  }
  sendUserDisconnectedMessage (userName) {
    let msg = messagesCreator.fromServer(userName + ' disconnected.')

    store.dispatch(addMessage(msg))
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

export default connect(mapStateToProps)(ChatContainer)
