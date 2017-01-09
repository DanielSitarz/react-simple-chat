import io from 'socket.io-client'
import store from '../store/store.js'
import { addMessage, userEnterTheRoom, userDisconnected, isTyping, stoppedTyping } from '../store/actionCreators'

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

    this.ioSocket.on(events.USER_SENT_MESSAGE, this._onReceiveMessage.bind(this))
    this.ioSocket.on(events.USER_IS_TYPING, this._onTypingStart.bind(this))
    this.ioSocket.on(events.USER_STOPPED_TYPING, this._onTypingStop.bind(this))
    this.ioSocket.on(events.USER_ENTER_ROOM, this._onUserEnterTheRoom.bind(this))
    this.ioSocket.on(events.USER_LEFT_ROOM, this._onUserDisconnected.bind(this))
    this.ioSocket.on(events.USER_CHANGED_NAME, this._onUserChangedName.bind(this))
  }

  /**
   * Public methods
   */
  userEnterRoom (userName, roomName) {
    this.ioSocket.emit(events.USER_ENTER_ROOM, { userName: userName, roomName: roomName })
  }
  userSentMessage (msg) {
    this.ioSocket.emit(events.USER_SENT_MESSAGE, msg)
  }
  userIsTyping (userName) {
    this.ioSocket.emit(events.USER_IS_TYPING, userName)
  }
  userStoppedTyping (userName) {
    this.ioSocket.emit(events.USER_STOPPED_TYPING, userName)
  }

  /**
   * Private events
   */
  _onUserEnterTheRoom (userName) {
    store.dispatch(userEnterTheRoom(userName))
    if (this.onUserEnterTheRoom) this.onUserEnterTheRoom(userName)
  }
  _onUserDisconnected (userName) {
    store.dispatch(userDisconnected(userName))
    if (this.onUserDisconnected) this.onUserDisconnected(userName)
  }
  _onUserChangedName (data) {
    if (this.onUserChangedName) this.onUserChangedName(data)
  }
  _onTypingStart (userName) {
    store.dispatch(isTyping(userName))
    if (this.onTypingStart) this.onTypingStart(userName)
  }
  _onTypingStop (userName) {
    store.dispatch(stoppedTyping(userName))
    if (this.onTypingStop) this.onTypingStop(userName)
  }
  _onReceiveMessage (data) {
    store.dispatch(addMessage(data))
    if (this.onReceiveMessage) this.onReceiveMessage(data)
  }
}
