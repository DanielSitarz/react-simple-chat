import store from '../store/store'

const messagesCreator = {
  create: (data) => {
    return {
      key: data.key || new Date().getTime(),
      sender: data.sender || 'Anonymous',
      content: data.content || '',
      power: data.power || 1.0,
      roomName: store.getState().chatState.roomName,
      isFromServer: data.isFromServer || false
    }
  },
  fromServer: function (content) {
    return this.create({
      sender: 'Chat',
      content: content,
      power: -1,
      isFromServer: true
    })
  }
}

export default messagesCreator
