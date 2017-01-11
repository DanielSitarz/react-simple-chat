import React from 'react'
import { connect } from 'react-redux'

import style from '../style/Chat.scss'

/* My Components */
import HeaderContainer from './/HeaderContainer'
import MessagesContainer from './/MessagesContainer'
import ControlContainer from './ControlContainer'

import NewMessageNotification from '../helpers/NewMessageNotification'
import messagesCreator from '../helpers/messagesCreator'

import store from '../store/store'
import { addMessage, userEnterTheRoom, setMessages, setRoomName, stoppedTyping } from '../store/actionCreators'
import Socket from '../helpers/Socket'

class ChatContainer extends React.Component {
  constructor (props) {
    super(props)

    this.isTypingTimeout = null

    this.newMessageNotification = new NewMessageNotification()

    this.handleSendMessage = this.handleSendMessage.bind(this)

    this.setupSocket()
    this.enterRoom()
  }
  setupSocket () {
    this.socket = new Socket()
    this.socket.onReceiveMessage = (data) => this.newMessageNotification.notify()
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
    return (
      <div className={style.Chat}>
        <HeaderContainer />
        <MessagesContainer />
        <ControlContainer handleSendMessage={this.handleSendMessage} />
      </div>
    )
  }
}

const mapStateToProps = function (store) {
  return {
    areTyping: store.areTyping
  }
}

export default connect(mapStateToProps)(ChatContainer)
