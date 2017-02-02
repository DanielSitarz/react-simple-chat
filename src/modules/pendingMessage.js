import store from '../store/store'
import {stoppedTyping, addMessage} from '../store/actionCreators'
import messagesCreator from '../helpers/messagesCreator'

export default (function () {
  function set (msg) {
    const newMessage = messagesCreator.create({
      sender: store.getState().chatState.userName,
      style: 'rise',
      content: msg
    })

    store.dispatch({
      type: 'SET_PENDING_MSG',
      msg: newMessage
    })
  }

  function rise() {

  }

  function send () {
    let acceptedMsg = store.getState().pendingMessage.toJS()
    acceptedMsg.style = ''

    this.socket.userSentMessage(acceptedMsg)

    store.dispatch(stoppedTyping(this.props.userName))
    store.dispatch({type: 'DELETE_PENDING_MSG'})
    store.dispatch(addMessage(acceptedMsg))

    this.socket.userStoppedTyping(this.props.userName)
    this.clearTypingTimeout()

    if (acceptedMsg[0] === '!') {
      this.checkBots(acceptedMsg.content)
    }
  }

  return {
    set: set,
    send: send
  }
})()
