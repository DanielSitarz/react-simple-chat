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
    if (msg.match(TAG_SYMBOL)) {
      return true
    }
    return false
  }
}
