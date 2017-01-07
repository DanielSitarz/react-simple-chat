export default class MessagesCreator {
  constructor (roomName) {
    this.roomName = roomName
  }
  create (data) {
    return {
      key: data.key || new Date().getTime(),
      sender: data.sender || 'Anonymous',
      content: data.content || '',
      power: data.power || 0,
      roomName: this.roomName,
      isFromServer: data.isFromServer || false
    }
  }
  fromServer (content) {
    return this.create({
      sender: 'Chat',
      content: content,
      power: 0,
      isFromServer: true
    })
  }
}
