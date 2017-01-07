import { createStore, combineReducers } from 'redux'
import { List, Map } from 'immutable'

import randomNameGenerator from '../helpers/randomNameGenerator'

const chatUserInitialState = {
  userName: randomNameGenerator(),
  usersInRoom: [],
  roomName: 'DogsLovers'
}

const initialMessages = List()

const typingInitialState = List()

export const messagesReducer = (messages = initialMessages, action) => {
  switch (action.type) {
    case 'SET_MSGS':
      return List(action.msgs) || List()
    case 'ADD_MSG':
      return messages.push(Map(action.msg))
  }

  return messages
}

export const typingReducer = (state = typingInitialState, action) => {
  switch (action.type) {
    case 'TYPING_START':
      return state.push(action.who)
    case 'TYPING_STOP':
      return state.delete(state.indexOf(action.who))
  }
  return state
}

export const userReducer = (state = chatUserInitialState, action) => {
  switch (action.type) {
    case 'USER_SET_NAME':
      if (!action.name || action.name.length === 0) {
        action.name = 'Anonymous'
      }
      return Object.assign(state, {userName: action.name})
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
