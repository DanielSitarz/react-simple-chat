import { createStore, combineReducers } from 'redux'
import { List, Map } from 'immutable'

import randomNameGenerator from '../helpers/randomNameGenerator'
import messagesCreator from '../helpers/messagesCreator'

const initialChatUserState = {
  userName: randomNameGenerator(),
  usersInRoom: [],
  roomName: 'DogsLovers'
}
const initialMessages = List()
const initialTypingState = List()

const initialPendingMessage = null

export const pendingMessageReducer = (pendingMessage = initialPendingMessage, action) => {
  switch (action.type) {
    case 'SET_PENDING_MSG':
      return Map(action.msg)
    case 'DELETE_PENDING_MSG':
      return initialPendingMessage
    case 'UPDATE_PENDING_MSG_POWER':
      if (!pendingMessage) return pendingMessage
      return pendingMessage.set('power', action.power)
  }

  return pendingMessage
}

export const messagesReducer = (messages = initialMessages, action) => {
  let msg
  switch (action.type) {
    case 'SET_MSGS':
      return List(action.msgs.map((m) => Map(m))) || List()
    case 'ADD_MSG':
      msg = messagesCreator.create(action.msg)
      return messages.push(Map(msg))
    case 'MODIFY_MSG':
      return messages.update(
        messages.findIndex((m) => m.get('key') === action.payload.id),
        (item) => item.set('content', action.payload.content)
      )
    case 'USER_ENTER_THE_ROOM':
      msg = messagesCreator.fromServer(action.userName + ' connected.')
      return messages.push(Map(msg))
    case 'USER_DISCONNECTED':
      msg = messagesCreator.fromServer(action.userName + ' disconnected.')
      return messages.push(Map(msg))
  }

  return messages
}

export const typingReducer = (state = initialTypingState, action) => {
  switch (action.type) {
    case 'IS_TYPING':
      return state.push(action.userName)
    case 'STOPPED_TYPING':
      return state.delete(state.indexOf(action.userName))
  }
  return state
}

export const userReducer = (state = initialChatUserState, action) => {
  switch (action.type) {
    case 'USER_SET_NAME':
      return Object.assign(state, {userName: action.name})
    case 'SET_ROOM_NAME':
      return Object.assign(state, {roomName: action.roomName})
  }
  return state
}

const reducers = combineReducers({
  chatState: userReducer,
  messages: messagesReducer,
  pendingMessage: pendingMessageReducer,
  areTyping: typingReducer
})

const store = createStore(reducers)

export default store
