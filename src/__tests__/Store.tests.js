import { userReducer, messagesReducer } from '../store/store'
import { List } from 'immutable'

describe('User reducer', () => {
  it('Should change only name', () => {
    const initialState = {
      userName: 'Other Name',
      usersInRoom: [],
      roomName: 'DogsLovers'
    }
    const expectedState = {
      userName: 'Not a Dan',
      usersInRoom: [],
      roomName: 'DogsLovers'
    }

    const reducedState = userReducer(initialState, {
      type: 'USER_SET_NAME',
      name: 'Not a Dan'
    })

    expect(reducedState).toEqual(expectedState)
  })
})

describe('Messages reducer', () => {
  const testMessage = {
    key: 12345,
    sender: 'sender',
    content: 'content',
    power: 1.0,
    roomName: 'DogsLovers',
    isFromServer: false
  }

  it('Should add message', () => {
    const initialState = List()
    const expectedState = [testMessage]

    const reducedState = messagesReducer(initialState, {
      type: 'ADD_MSG',
      msg: testMessage
    })

    expect(reducedState.toJS()).toEqual(expectedState)
  })

  it('Should add two messages', () => {
    const initialState = List()
    const expectedState = [testMessage, testMessage]

    let reducedState = messagesReducer(initialState, {
      type: 'ADD_MSG',
      msg: testMessage
    })
    reducedState = messagesReducer(reducedState, {
      type: 'ADD_MSG',
      msg: testMessage
    })

    expect(reducedState.toJS()).toEqual(expectedState)
  })
})
