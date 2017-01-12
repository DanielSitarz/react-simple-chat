import store from '../store/store'

const messagesCreator = {
  create: (data) => {
    return Object.assign({
      key: new Date().getTime(),
      sender: 'Anonymous',
      content: '',
      power: 100,
      roomName: store.getState().chatState.roomName,
      isFromServer: false
    }, data)
  },
  fromServer: function (content) {
    return this.create({
      sender: 'Chat',
      content: content,
      isFromServer: true
    })
  }
}

export default messagesCreator
