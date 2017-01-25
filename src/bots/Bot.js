export default class Bot {
  constructor (cmd, name) {
    this.cmd = cmd
    this.name = name
  }
  check (msg) {
    this.lastMsg = msg

    if (msg[0] !== '!') return false
    if (msg.indexOf(this.cmd) === -1) return false

    msg = this.removeCmd(this.cmd, msg)

    let params = this.getParams(msg)

    return new Promise((resolve, reject) => {
      this.getResponse(params, resolve)
    })
  }
  removeCmd (cmd, msg) {
    return msg.slice(2 + cmd.length)
  }
  getParams (msg) {
    return msg.match(/\b(\w+)\b/g)
  }
  getResponse (params) {

  }
}
