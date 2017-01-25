import store from '../store/store'

const messagesCreator = {
  create: (data) => {
    let time = new Date().getTime()
    let key = time.toString(36) + Math.random().toString(36).slice(2)
    return Object.assign({
      key: key,
      time: time,
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
