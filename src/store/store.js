import { createStore, combineReducers } from 'redux'
import { List, Map } from 'immutable'

import randomNameGenerator from '../helpers/randomNameGenerator'
import messagesCreator from '../helpers/messagesCreator'

const chatUserInitialState = {
  userName: randomNameGenerator(),
  usersInRoom: [],
  roomName: 'DogsLovers'
}

const initialMessages = List()

const typingInitialState = List()

export const messagesReducer = (messages = initialMessages, action) => {
  let msg
  switch (action.type) {
    case 'SET_MSGS':
      return List(action.msgs) || List()
    case 'ADD_MSG':
      msg = messagesCreator.create(action.msg)
      return messages.push(Map(msg))
    case 'USER_ENTER_THE_ROOM':
      msg = messagesCreator.fromServer(action.userName + ' connected.')
      return messages.push(Map(msg))
    case 'USER_DISCONNECTED':
      msg = messagesCreator.fromServer(action.userName + ' disconnected.')
      return messages.push(Map(msg))
  }

  return messages
}

export const typingReducer = (state = typingInitialState, action) => {
  switch (action.type) {
    case 'IS_TYPING':
      return state.push(action.userName)
    case 'STOPPED_TYPING':
      return state.delete(state.indexOf(action.userName))
  }
  return state
}

export const userReducer = (state = chatUserInitialState, action) => {
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
  areTyping: typingReducer
})

const store = createStore(reducers)

export default store
