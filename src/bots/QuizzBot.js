import Bot from './Bot'

export default class QuizzBot extends Bot {
  constructor () {
    super('quizz', 'Quizz Bot')

    this.countries = null

    this.isWaitingForAnswer = false
    this.waitingForAnswerAbout = null
    this.lastAskedCountry = null
  }

  getResponse (params, resolve) {
    this.resolve = resolve
    this.parseParams(params)
  }

  parseParams (params) {
    if (!params) return false

    if (this.isWaitingForAnswer) {
      this.checkAnswer(params.join(' '))
      return false
    }

    switch (params.length) {
      case 2:
        if (params[0] === 'ask') {
          if (params[1] === 'capital') this.askAboutCapital()
          if (params[1] === 'country') this.askAboutCountry()
        }
        break
    }
  }

  checkAnswer (answer) {
    this.isWaitingForAnswer = false

    let goodAnswer
    switch (this.waitingForAnswerAbout) {
      case 'capital': goodAnswer = this.lastAskedCountry.capital; break
      case 'country': goodAnswer = this.lastAskedCountry.name.common; break
    }

    let response = (answer === goodAnswer) ? 'Correct!' : `Wrong! Correct answer is ${goodAnswer}.`
    this.resolve(response)
  }

  askAboutCapital () {
    this.getCountries((data) => {
      let randomCountry = this.getRandomCountry()
      let countryName = randomCountry.name.common

      let question = `What is the capital city of ${countryName}?`

      this.isWaitingForAnswer = true
      this.waitingForAnswerAbout = 'capital'
      this.lastAskedCountry = randomCountry

      this.resolve(question)
    })
  }

  askAboutCountry () {
    this.getCountries((data) => {
      let randomCountry = this.getRandomCountry()
      let countryCapital = randomCountry.capital

      let question = `${countryCapital} is the capital city of what country?`

      this.isWaitingForAnswer = true
      this.waitingForAnswerAbout = 'country'
      this.lastAskedCountry = randomCountry

      this.resolve(question)
    })
  }

  getRandomCountry () {
    return this.countries[Math.floor(Math.random() * this.countries.length)]
  }

  getCountries (callback) {
    if (this.countries) return callback(this.countries)

    window.fetch('https://gist.githubusercontent.com/DanielSitarz/f896e575dee5daa810d219dd944b7df2/raw/c77bbbdd0195e4ffbd6d2dafa63843977b58613e/countries.json')
      .then((res) => {
        res.json()
          .then((json) => {
            this.countries = json
            callback(this.countries)
          })
      })
  }
}
