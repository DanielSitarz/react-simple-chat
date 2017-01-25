import _ from 'lodash'
import Bot from './Bot'

export default class RandomBot extends Bot {
  constructor () {
    super('rand', 'Random Bot')
  }

  getResponse (params, resolve) {
    this.resolve = resolve
    this.parseParams(params)
  }

  parseParams (params) {
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
    this.resolve('!rand min max')
  }

  random (max) {
    this.randomRange(1, max)
  }

  randomRange (min, max) {
    let rand = _.random(min, max)
    this.resolve(rand)
  }
}
