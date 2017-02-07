import socket from '../modules/socket'
import store from '../store/store'
import { addMessage } from '../store/actionCreators'

export const TAG_SYMBOL = '!!'

export default class Bot {
  constructor (cmd, name) {
    this.cmd = cmd
    this.name = name
  }
  check (msg) {
    if (msg.indexOf(this.cmd) === -1) {
      return false
    }

    this.msg = this.removeCmd(this.cmd, msg)

    this.parseParams(this.getParams(this.msg))

    return true
  }
  removeCmd (cmd, msg) {
    return msg.slice(2 + cmd.length)
  }
  getParams (msg) {
    return msg.match(/\b\w*[\w',-]+\w*\b/g)
  }
  parseParams (params) {

  }
  isTag (msg) {
    if (!msg) return
    if (msg.slice(0, TAG_SYMBOL.length) === TAG_SYMBOL) {
      let data = JSON.parse(msg.slice(TAG_SYMBOL.length))
      if (data.cmd === this.cmd) return data
    }
    return false
  }
  sendResponse (response) {
    if (!response) return
    if (response === '') return
    window.setTimeout(() => {
      store.dispatch(addMessage(response))
      socket.userSentMessage(response)
    }, 200 + 300 * Math.random())
  }
  sendResponseOnlyToOthers (response) {
    socket.userSentMessage(response)
  }
}
