import io from 'socket.io-client'
import store from '../store/store.js'
import callbacksController from './callbacksController'
import { addMessage, userEnterTheRoom, userDisconnected, isTyping, stoppedTyping } from '../store/actionCreators'

const events = {
  USER_ENTER_ROOM: 'user enter room',
  USER_LEFT_ROOM: 'user left room',
  USER_SENT_MESSAGE: 'user sent message',
  USER_IS_TYPING: 'user is typing',
  USER_STOPPED_TYPING: 'user stopped typing',
  USER_CHANGED_NAME: 'user changed name'
}

export default (function socket () {
  const ioSocket = io('https://socket-chat-server-to-react.herokuapp.com/')

  ioSocket.on(events.USER_SENT_MESSAGE, _onReceiveMessage)
  ioSocket.on(events.USER_IS_TYPING, _onTypingStart)
  ioSocket.on(events.USER_STOPPED_TYPING, _onTypingStop)
  ioSocket.on(events.USER_ENTER_ROOM, _onUserEnterTheRoom)
  ioSocket.on(events.USER_LEFT_ROOM, _onUserDisconnected)
  ioSocket.on(events.USER_CHANGED_NAME, _onUserChangedName)

  var callbacks = callbacksController({
    onReceiveMessage: [],
    onTypingStop: [],
    onTypingStart: [],
    onUserEnterTheRoom: [],
    onUserDisconnected: [],
    onUserChangedName: []
  })

  /**
   * Public methods
   */
  function userEnterRoom (userName, roomName) {
    ioSocket.emit(events.USER_ENTER_ROOM, { userName: userName, roomName: roomName })
  }
  function userSentMessage (msg) {
    ioSocket.emit(events.USER_SENT_MESSAGE, msg)
  }
  function userIsTyping (userName) {
    ioSocket.emit(events.USER_IS_TYPING, userName)
  }
  function userStoppedTyping (userName) {
    ioSocket.emit(events.USER_STOPPED_TYPING, userName)
  }

  /**
   * Private events
   */
  function _onUserEnterTheRoom (userName) {
    store.dispatch(userEnterTheRoom(userName))
    callbacks.callAll('onUserEnterTheRoom', userName)
  }
  function _onUserDisconnected (userName) {
    store.dispatch(userDisconnected(userName))
    callbacks.callAll('onUserDisconnected', userName)
  }
  function _onUserChangedName (data) {
    callbacks.callAll('onUserChangedName', data)
  }
  function _onTypingStart (userName) {
    store.dispatch(isTyping(userName))
    callbacks.callAll('onTypingStart', userName)
  }
  function _onTypingStop (userName) {
    store.dispatch(stoppedTyping(userName))
    callbacks.callAll('onTypingStop', userName)
  }
  function _onReceiveMessage (data) {
    callbacks.callAll('onReceiveMessage', data)
  }

  return {
    userEnterRoom: userEnterRoom,
    userSentMessage: userSentMessage,
    userIsTyping: userIsTyping,
    userStoppedTyping: userStoppedTyping,
    callbacks: { add: callbacks.add, remove: callbacks.remove }
  }
})()
