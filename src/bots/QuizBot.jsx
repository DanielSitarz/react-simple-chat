import React from 'react'
import store from '../store/store'
import Bot, { TAG_SYMBOL } from './Bot'
import shuffle from 'lodash/shuffle'
import countries from './data/countries.js'
import messagesCreator from '../helpers/messagesCreator'
import QuizzBotQuestion from '../components/bots/QuizzBotQuestion'

import {COUNTRY, CAPITAL, NO_ANSWER} from './quizzBotConsts'

export class QuizBot extends Bot {
  constructor () {
    super('quiz', 'Quiz Bot')

    this.isWaitingForAnswer = false
    this.waitingForAnswerAbout = null
    this.lastAskedCountryIndex = null

    this.points = 0

    this.questionsMessages = []
  }

  getResponse () {
    let response = this.parseParams(this.getParams(this.msg))
    return response
  }

  parseParams (params) {
    let response = ''
    if (!params) {
      return false
    }

    if (this.isWaitingForAnswer) {
      return this.checkAnswer(params.join(' '))
    }

    switch (params.length) {
      case 2:
        if (params[0] === 'ask') {
          if (params[1] === CAPITAL) response = this.askAbout(CAPITAL, COUNTRY)
          if (params[1] === COUNTRY) response = this.askAbout(COUNTRY, CAPITAL)
        }
        break
    }
    return response
  }

  checkAnswer (answer) {
    this.isWaitingForAnswer = false

    let ok = answer === this.lastAskedCountryIndex
    console.log(answer, this.lastAskedCountryIndex)

    let msg = this.questionsMessages[this.questionsMessages.length - 1]
    console.log(msg)
    store.dispatch({
      type: 'MODIFY_MSG',
      payload: {
        key: msg.key,
        content: msg.content.replace(NO_ANSWER, answer)
      }
    })

    let response = (ok)
    ? 'Correct!'
    : `Wrong! Correct answer is ${this.getCountryProperty(this.lastAskedCountryIndex, this.waitingForAnswerAbout)}.`

    return this.createMessage(response)
  }

  askAbout (questionType, answerType) {
    let randomCountry = this.getRandomCountry()
    let countryIndex = countries.indexOf(randomCountry)

    this.awaitAnswer(questionType, countryIndex)

    let answersIndices = this.getRandomAnswers(3, randomCountry)

    let tag = this.createTag(questionType, answerType, countryIndex, answersIndices, NO_ANSWER)
    let msg = this.createMessage(tag)

    this.questionsMessages.push(msg)

    return msg
  }

  createTag (questionType, answerType, countryIndex, answersIndices, answerIndex) {
    let tag = {
      cmd: this.cmd,
      questionType: questionType,
      answerType: answerType,
      countryIndex: countryIndex,
      answersIndices: answersIndices,
      chosenAnswerIndex: answerIndex
    }
    return TAG_SYMBOL + JSON.stringify(tag) + TAG_SYMBOL
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
      handleAnswer={(a) => this.handleAnswer(a)}
      getCountryProperty={(c, p) => this.getCountryProperty(c, p)}
    />
  }

  awaitAnswer (type, countryIndex) {
    this.isWaitingForAnswer = true
    this.waitingForAnswerAbout = type
    this.lastAskedCountryIndex = countryIndex
  }

  handleAnswer (answer) {
    if (!this.isWaitingForAnswer) return false
    return this.checkAnswer(answer)
  }

  getRandomCountry () {
    return countries[Math.floor(Math.random() * countries.length)]
  }

  getRandomAnswers (count, correctCountry) {
    let answers = []

    for (let i = 0; i < count; i++) {
      let country = this.getRandomCountry()
      while (country === correctCountry) {
        country = this.getRandomCountry()
      }
      answers.push(countries.indexOf(country))
    }

    answers.push(countries.indexOf(correctCountry))

    return shuffle(answers)
  }

  getCountryProperty (countryIndex, property) {
    let country = countries[countryIndex]
    switch (property) {
      case CAPITAL: return country.capital
      case COUNTRY: return country.name.official
    }

    return false
  }

  renderTag (msg) {
    let params = JSON.parse(msg.replace(new RegExp(TAG_SYMBOL, 'g'), ''))

    let question = this.createQuestionElement(params)

    return question
  }
}

const quizBot = new QuizBot()

export default quizBot

