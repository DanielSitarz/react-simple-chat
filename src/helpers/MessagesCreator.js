import store from '../store/store'

const messagesCreator = {
  create: (data) => {
    return Object.assign({
      key: new Date().getTime(),
      sender: 'Anonymous',
      content: '',
      power: 1.0,
      roomName: store.getState().chatState.roomName,
      isFromServer: false
    }, data)
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
