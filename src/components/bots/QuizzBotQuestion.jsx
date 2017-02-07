import React, { Component } from 'react'
import {COUNTRY, CAPITAL} from '../../bots/quizzBotConsts'

import style from '../../style/quizzBot.scss'

class QuizzBotQuestion extends Component {
  constructor (props) {
    super(props)
    this.correctButton = {}
    this.buttons = {}

    this.state = {
      question: 'Loading...',
      answers: new Array(this.props.answersIndices.length).fill('Loading...')
    }
    this.renderQuestion(this.props.questionType, this.props.answerType, this.props.answerIndex)

    var answers = []
    this.props.answersIndices.map((index, i) => {
      this.props.getCountryProperty(index, this.props.questionType)
        .then((r) => {
          answers[i] = r
          this.setState({
            answers: answers
          })
        })
    })
  }

  handleAnswerChoose (e, answer) {
    if (!this.props.handleAnswer(answer, this.props.id)) return false
    if (answer === this.props.countryIndex) {
      e.target.className += style.correct
    } else {
      e.target.className += style.wrong
      this.correctButton.className += style.correct
    }
  }
  renderQuestion (questionType, answerType, answerIndex) {
    this.props.getCountryProperty(answerIndex, answerType).then((r) => {
      let el
      switch (questionType) {
        case COUNTRY: el = <span>{this.props.userName} - <b>{r}</b> is the capital city of which country?</span>; break
        case CAPITAL: el = <span>{this.props.userName} - What is the capital city of <b>{r}?</b></span>; break
      }
      this.setState({
        question: el
      })
    })
  }
  getStyle (answer) {
    if (this.props.chosenAnswerIndex === 900) return ''
    if (this.props.chosenAnswerIndex === this.props.answerIndex) {
      if (answer === this.props.chosenAnswerIndex) return style.correct
    } else {
      if (answer === this.props.answerIndex) return style.correct
      if (answer === this.props.chosenAnswerIndex) return style.wrong
    }
  }
  render () {
    const {answerIndex, answersIndices} = this.props

    return (
      <div className={style.quizzBotQuestion}>
        <header>{this.state.question}</header>
        <ul>
          {
            answersIndices.map((answer, i) => {
              return (
                <li key={i}>
                  <button
                    className={this.getStyle(answer)}
                    ref={(ref) => { this.buttons[answer] = (ref); if (answer === answerIndex) this.correctButton = ref }}
                    type='button'
                    onClick={(e) => this.handleAnswerChoose(e, answer)}>
                    {this.state.answers[i]}
                  </button>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
}

export default QuizzBotQuestion
