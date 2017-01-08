export function addMessage (msg) {
  return {
    type: 'ADD_MSG',
    msg: msg
  }
}

export function userSetName (newName) {
  return {
    type: 'USER_SET_NAME',
    name: newName
  }
}

export function setMessages (messages) {
  return {
    type: 'SET_MSGS',
    msgs: messages
  }
}

export function setRoomName (roomName) {
  return {
    type: 'SET_ROOM_NAME',
    roomName: roomName
  }
}

export function userEnterTheRoom (userName) {
  return {
    type: 'USER_ENTER_THE_ROOM',
    userName: userName
  }
}

