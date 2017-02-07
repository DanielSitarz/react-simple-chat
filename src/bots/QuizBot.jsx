import React from 'react'
import store from '../store/store'
import Bot, { TAG_SYMBOL } from './Bot'
import shuffle from 'lodash/shuffle'
import messagesCreator from '../helpers/messagesCreator'
import QuizzBotQuestion from '../components/bots/QuizzBotQuestion'

import {COUNTRY, CAPITAL, NO_ANSWER} from './quizzBotConsts'

var countries

export class QuizBot extends Bot {
  constructor () {
    super('quiz', 'Quiz Bot')

    this.ready = false

    this.isWaitingForAnswerId = undefined
    this.waitingForAnswerAbout = null
    this.lastAskedCountryIndex = null

    this.points = 0

    this.questionsMessages = {}

    this.isDownloadingData = {
      countries: false
    }
  }

  getData (type) {
    return new Promise((resolve, reject) => {
      switch (type) {
        case 'countries':
          if (countries) {
            resolve(countries)
            return
          } else {
            if (this.isDownloadingData[type]) {
              setTimeout(() => { resolve(this.getData(type)) }, 100) // try again until downloaded
            } else {
              this.isDownloadingData[type] = true
              window.fetch('https://gist.githubusercontent.com/DanielSitarz/f896e575dee5daa810d219dd944b7df2/raw/c77bbbdd0195e4ffbd6d2dafa63843977b58613e/countries.json')
              // window.fetch('http://danielsi.linuxpl.info/chat/countries.json')
                .then((r) => r.json()
                  .then((r) => {
                    countries = r
                    resolve(countries)
                  }))
            }
          }
          break
      }
    })
  }

  parseParams (params) {
    if (!params || this.isWaitingForAnswerId) {
      return false
    }

    switch (params.length) {
      case 1:
        if (params[0] === CAPITAL) this.askAboutCountry(CAPITAL, COUNTRY)
        if (params[0] === COUNTRY) this.askAboutCountry(COUNTRY, CAPITAL)
        break
    }
  }

  askAboutCountry (questionType, answerType) {
    this.getData('countries').then((countries) => {
      let randomCountry = this.getRandomFromArray(countries)
      let countryIndex = countries.indexOf(randomCountry)

      let answersIndices = this.getRandomAnswers(3, randomCountry, countries)

      let tag = this.createQuestionTag(questionType, answerType, countryIndex, answersIndices, NO_ANSWER)
      let msg = this.createMessage(tag)

      this.questionsMessages[msg.key] = msg

      this.awaitAnswer(questionType, countryIndex, msg.key)

      this.sendResponse(msg)
    })
  }

  checkAnswer (answer, id) {
    this.isWaitingForAnswerId = undefined

    let thisQuestion = this.questionsMessages[id]

    this.sendAnswerModifierTag(thisQuestion, answer)
    this.updateQuestionAnswer({
      id: id,
      content: thisQuestion.content,
      answer: answer
    })
  }

  sendAnswerModifierTag (questionMsg, answer) {
    let tag = {
      cmd: this.cmd,
      type: 'modify',
      payload: {
        id: questionMsg.key,
        content: questionMsg.content,
        answer: answer
      }
    }
    this.sendResponseOnlyToOthers(this.createMessage(TAG_SYMBOL + JSON.stringify(tag)))
  }

  awaitAnswer (type, countryIndex, id) {
    this.isWaitingForAnswerId = id
    this.waitingForAnswerAbout = type
    this.lastAskedCountryIndex = countryIndex
  }

  createQuestionTag (questionType, answerType, countryIndex, answersIndices, answerIndex) {
    let tag = {
      cmd: this.cmd,
      type: 'question',
      payload: {
        userName: store.getState().chatState.userName,
        questionType: questionType,
        answerType: answerType,
        answerIndex: countryIndex,
        answersIndices: answersIndices,
        chosenAnswerIndex: answerIndex
      }
    }
    return TAG_SYMBOL + JSON.stringify(tag)
  }

  createMessage (content) {
    return messagesCreator.create({
      sender: this.name,
      isFromBot: true,
      content: content
    })
  }

  createQuestionElement (data) {
    return <QuizzBotQuestion
      {...data}
      handleAnswer={(answer, id) => this.handleAnswer(answer, id)}
      getCountryProperty={(c, p) => this.getCountryProperty(c, p)}
    />
  }

  handleAnswer (answer, id) {
    if (this.isWaitingForAnswerId !== id) return false
    return this.checkAnswer(answer, id)
  }

  getRandomFromArray (arr) {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  getRandomAnswers (count, correct, arr) {
    let answers = []

    for (let i = 0; i < count; i++) {
      let answer = this.getRandomFromArray(arr)
      while (answer === correct || answers.indexOf(answer) !== -1) {
        answer = this.getRandomFromArray(arr)
      }
      answers.push(arr.indexOf(answer))
    }

    answers.push(arr.indexOf(correct))

    return shuffle(answers)
  }

  getCountryProperty (countryIndex, property) {
    return new Promise((resolve, reject) => {
      this.getData('countries').then((countries) => {
        let country = countries[countryIndex]
        switch (property) {
          case CAPITAL: resolve(country.capital); break
          case COUNTRY: resolve(country.name.official); break
        }
      })
    })
  }

  parseTag (data) {
    switch (data.type) {
      case 'question': return this.renderTag(data.payload)
      case 'modify': return this.updateQuestionAnswer(data.payload)
      default: return false
    }
  }

  renderTag (data) {
    let question = this.createQuestionElement(data)

    return question
  }

  updateQuestionAnswer (data) {
    let {id, content, answer} = data
    store.dispatch({
      type: 'MODIFY_MSG',
      payload: {
        id: id,
        content: content.replace(NO_ANSWER, answer)
      }
    })
  }
}

const quizBot = new QuizBot()

export default quizBot

