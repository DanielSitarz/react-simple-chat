export default class Bot {
  constructor (cmd) {
    this.cmd = cmd
  }
  check (msg) {
    this.lastMsg = msg

    if (msg[0] !== '!') return false
    if (msg.indexOf(this.cmd) === -1) return false

    msg = this.removeExtraSpaces(msg)
    msg = this.removeCmd(this.cmd, msg)

    let params = this.getParams(msg)
    this.parseParams(params)
  }
  removeCmd (cmd, msg) {
    return msg.slice(2 + cmd.length)
  }
  removeExtraSpaces (msg) {
    return msg.replace(/ {2,}/g, ' ').replace(/\s+$/g, '')
  }
  getParams (msg) {
    return msg.split(' ')
  }
  parseParams (params) {

  }
}