import io from 'socket.io-client'
import store from '../store/store.js'
import { addMessage, userEnterTheRoom } from '../store/actionCreators'

const events = {
  USER_ENTER_ROOM: 'user enter room',
  USER_LEFT_ROOM: 'user left room',
  USER_SENT_MESSAGE: 'user sent message',
  USER_IS_TYPING: 'user is typing',
  USER_STOPPED_TYPING: 'user stopped typing',
  USER_CHANGED_NAME: 'user changed name'
}

export default class Socket {
  constructor () {
    this.ioSocket = io('https://socket-chat-server-to-react.herokuapp.com/')

    this.ioSocket.on(events.USER_SENT_MESSAGE, onReceiveMessage)
    this.ioSocket.on(events.USER_IS_TYPING, onTypingStart)
    this.ioSocket.on(events.USER_STOPPED_TYPING, onTypingStop)

    this.ioSocket.on(events.USER_ENTER_ROOM, onUserEnterTheRoom)
    this.ioSocket.on(events.USER_LEFT_ROOM, onUserDisconnected)
    this.ioSocket.on(events.USER_CHANGED_NAME, onUserChangedName)
  }

  userEnterRoom (data) {
    this.ioSocket.emit(events.USER_ENTER_ROOM, data)
  }
  userSentMessage (msg) {
    this.ioSocket.emit(events.USER_SENT_MESSAGE, msg)
  }

  userIsTyping (userName) {
    this.ioSocket.emit(events.USER_IS_TYPING, userName)
  }
  userStoppedTyping (userName) {
    this.ioSocket.emit(events.USER_IS_TYPING, userName)
  }
}

/**
 * Events
 */
const onReceiveMessage = (data) => {
  // this.newMessageNotification.notify()

  store.dispatch(addMessage(data))
}
const onUserEnterTheRoom = (userName) => {
  store.dispatch(userEnterTheRoom(userName))
}
const onUserDisconnected = (userName) => {
  // this.sendUserDisconnectedMessage(userName)
}
const onUserChangedName = (data) => {
  // this.sendUserChangedNameMessage(data.oldName, data.newName)
}
const onTypingStart = (who) => {
  store.dispatch({
    type: 'TYPING_START',
    who: who
  })
}
const onTypingStop = (who) => {
  store.dispatch({
    type: 'TYPING_STOP',
    who: who
  })
}
