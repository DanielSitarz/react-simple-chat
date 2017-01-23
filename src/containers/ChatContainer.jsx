import React from 'react'
import { connect } from 'react-redux'

import style from '../style/Chat.scss'

/* My Components */
import Header from '../components/Header'
import Messages from '../components/Messages'
import Control from '../components/Control'
import AreTyping from '../components/AreTyping'

import NewMessageNotification from '../helpers/NewMessageNotification'
import messagesCreator from '../helpers/messagesCreator'

import store from '../store/store'
import { addMessage, userEnterTheRoom, setMessages, setRoomName, stoppedTyping } from '../store/actionCreators'
import Socket from '../helpers/Socket'

import newsBot from '../bots/newsBot'

class ChatContainer extends React.Component {
  constructor (props) {
    super(props)

    this.isTypingTimeout = null

    this.newMessageNotification = new NewMessageNotification()

    this.setPendingMessage = this.setPendingMessage.bind(this)
    this.handleMessageTyping = this.handleMessageTyping.bind(this)
    this.acceptMessage = this.acceptMessage.bind(this)

    this.setupSocket()
    this.enterRoom()
  }
  setupSocket () {
    this.socket = new Socket()
    this.socket.onReceiveMessage = (data) => {
      this.newMessageNotification.notify()
      newsBot(data.content)
    }
  }
  enterRoom () {
    this.loadMessagesFromLocalStorage()
    store.dispatch(setRoomName(this.props.params.roomName))
    store.dispatch(userEnterTheRoom(this.props.userName))
    this.socket.userEnterRoom(this.props.userName, this.props.params.roomName)
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
      let helloMsg = messagesCreator.create({
        roomName: 'Hello',
        sender: 'Daniel',
        content: 'https://media.giphy.com/media/ASd0Ukj0y3qMM/giphy.gif'
      })
      store.dispatch(addMessage(helloMsg))
    }
  }
  saveMessagesToLocalStorage () {
    window.localStorage.setItem(this.props.params.roomName + '_messages', JSON.stringify(this.props.messages))
  }
  setPendingMessage (data) {
    let msgData = Object.assign({
      sender: this.props.userName,
      style: 'rise'
    }, data)

    const newMessage = messagesCreator.create(msgData)

    store.dispatch({
      type: 'SET_PENDING_MSG',
      msg: newMessage
    })
  }
  acceptMessage () {
    let pendingMsg = store.getState().pendingMessage.toJS()
    pendingMsg.style = ''

    this.socket.userSentMessage(pendingMsg)

    store.dispatch(stoppedTyping(this.props.userName))
    store.dispatch({type: 'DELETE_PENDING_MSG'})
    store.dispatch(addMessage(pendingMsg))

    this.socket.userStoppedTyping(this.props.userName)
    this.clearTypingTimeout()

    newsBot(pendingMsg.content)
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
  }
  render () {
    let messages = this.props.messages

    if (this.props.pendingMessage) {
      messages = messages.push(this.props.pendingMessage)
    }

    return (
      <div className={style.Chat}>
        <Header roomName={this.props.roomName} userName={this.props.userName} />
        <Messages messages={messages} />
        <AreTyping areTyping={this.props.areTyping} />
        <Control
          setPendingMessage={this.setPendingMessage}
          handleMessageTyping={this.handleMessageTyping}
          acceptMessage={this.acceptMessage}
        />
      </div>
    )
  }
}

const mapStateToProps = function (store) {
  return {
    userName: store.chatState.userName,
    roomName: store.chatState.roomName,
    areTyping: store.areTyping,
    pendingMessage: store.pendingMessage,
    messages: store.messages
  }
}

export default connect(mapStateToProps)(ChatContainer)
