import Bot from './Bot'

export default class RandomBot extends Bot {
  constructor (sendResponse) {
    super('rand', 'Random Bot', sendResponse)
  }

  getResponse (params) {
    this.parseParams(params)
  }

  parseParams (params) {
    console.log(params)
    if (!params) {
      this.showHelp()
      return false
    }

    switch (params.length) {
      case 1:
        this.random(params[0], params[1])
        break
      case 2:
        this.randomRange(params[0], params[1])
        break
      default:
        this.showHelp()
    }
  }

  showHelp () {
    this.sendResponse(this, '!rand min max')
  }

  random (max) {
    this.randomRange(1, max)
  }

  randomRange (min, max) {
    min = parseInt(min)
    max = parseInt(max)
    let rand = Math.floor(Math.random() * (max - min + 1)) + min
    this.sendResponse(this, rand)
  }
}
