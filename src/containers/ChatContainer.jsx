import React from 'react'
import { connect } from 'react-redux'

import style from '../style/Chat.scss'

/* Components */
import Header from '../components/Header'
import Messages from '../components/Messages'
import Control from '../components/Control'
import AreTyping from '../components/AreTyping'

import NewMessageNotification from '../helpers/NewMessageNotification'
import messagesCreator from '../helpers/messagesCreator'

import store from '../store/store'
import { addMessage, userEnterTheRoom, setMessages, setRoomName, stoppedTyping } from '../store/actionCreators'
import socket from '../modules/socket'
import pendingMessage from '../modules/pendingMessage'

import bots from '../bots/bots'

class ChatContainer extends React.Component {
  constructor (props) {
    super(props)

    this.isTypingTimeout = null

    this.newMessageNotification = new NewMessageNotification()

    this.handleMessageTyping = this.handleMessageTyping.bind(this)

    this.setupCallbacks()
    this.enterRoom()
  }
  setupCallbacks () {
    socket.callbacks.add('onReceiveMessage', (data) => {
      let wasBotModifierTag = false
      // if received message was just a bot command to modify message
      bots.some((bot) => {
        let r = bot.isTag(data.content)
        if (r && r.type === 'modify') {
          bot.parseTag(r)
          wasBotModifierTag = true
          return true
        }
      })
      // we don't send it to the user
      if (!wasBotModifierTag) {
        store.dispatch(addMessage(data))
        this.newMessageNotification.notify()
      }
    })
    pendingMessage.callbacks.add('onSend', (msg) => {
      bots.forEach((bot) => bot.check(msg.content))
    })
  }
  enterRoom () {
    this.loadMessagesFromLocalStorage()
    store.dispatch(setRoomName(this.props.params.roomName))
    store.dispatch(userEnterTheRoom(this.props.userName))
    socket.userEnterRoom(this.props.userName, this.props.params.roomName)
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
  handleMessageTyping (e) {
    if (this.isTypingTimeout) {
      this.clearTypingTimeout()
      this.startTypingTimeout()
      return
    }

    this.startTypingTimeout()
    socket.userIsTyping(this.props.userName)
  }
  startTypingTimeout () {
    this.isTypingTimeout = window.setTimeout(() => {
      store.dispatch(stoppedTyping(this.props.userName))
      socket.userStoppedTyping(this.props.userName)
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
        <Messages messages={messages} bots={this.bots} />
        <AreTyping areTyping={this.props.areTyping} />
        <Control handleMessageTyping={this.handleMessageTyping} />
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
