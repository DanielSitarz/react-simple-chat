import store from '../store/store'
import socket from './socket'
import {stoppedTyping, addMessage} from '../store/actionCreators'
import messagesCreator from '../helpers/messagesCreator'
import callbacksController from './callbacksController'

export default (function pendingMessage () {
  var { userName } = store.getState().chatState
  var message = ''
  var power = 100
  var maxSendPower = 500
  var sendPowerDiff = maxSendPower - 100
  var maxSendTime = 3000
  var sendStartTime = 0

  var riseInterval

  function set (msg) {
    callbacks.callAll('onSet')
    const newMessage = messagesCreator.create({
      sender: userName,
      style: 'rise',
      content: msg
    })

    store.dispatch({
      type: 'SET_PENDING_MSG',
      msg: newMessage
    })

    message = newMessage
    sendStartTime = new Date().getTime()

    rise()
  }

  function rise () {
    reset()

    riseInterval = window.setInterval(() => {
      var t = new Date().getTime() - sendStartTime
      if (t > maxSendTime) {
        abort()
        return
      }

      power = 100 + sendPowerDiff * t / maxSendTime
    }, 50)
  }

  function send () {
    callbacks.callAll('onSend', message)

    message.style = ''
    message.power = power

    deleteMessage()

    store.dispatch(addMessage(message))
    socket.userSentMessage(message)

    store.dispatch(stoppedTyping(userName))
    socket.userStoppedTyping(userName)

    reset()
  }

  function abort () {
    callbacks.callAll('onAbort')
    deleteMessage()
    reset()
  }

  function deleteMessage () {
    store.dispatch({type: 'DELETE_PENDING_MSG'})
  }

  function reset () {
    if (riseInterval) window.clearInterval(riseInterval)
    riseInterval = undefined
    power = 100
  }

  var callbacks = callbacksController({
    onSet: [],
    onAbort: [],
    onSend: []
  })

  return {
    set: set,
    send: send,
    callbacks: { add: callbacks.add, remove: callbacks.remove }
  }
})()
