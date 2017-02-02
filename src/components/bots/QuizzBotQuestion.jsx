import React, { Component } from 'react'
import {COUNTRY, CAPITAL} from '../../bots/quizzBotConsts'

import style from '../../style/quizzBot.scss'

class QuizzBotQuestion extends Component {
  constructor (props) {
    super(props)
    this.correctButton = {}
    this.buttons = {}
  }

  handleAnswerChoose (e, answer) {
    if (!this.props.handleAnswer(answer)) return false
    if (answer === this.props.countryIndex) {
      e.target.className += style.correct
    } else {
      e.target.className += style.wrong
      this.correctButton.className += style.correct
    }
  }
  renderQuestion (questionType, answerType, answerIndex) {
    let q = this.props.getCountryProperty(answerIndex, answerType)
    switch (questionType) {
      case COUNTRY: return <span><b>{q}</b> is the capital city of which country?</span>
      case CAPITAL: return <span>What is the capital city of <b>{q}?</b></span>
    }
  }
  getStyle (answer) {
    if (this.props.chosenAnswerIndex === 900) return ''
    if (this.props.chosenAnswerIndex === this.props.countryIndex) {
      if (answer === this.props.chosenAnswerIndex) return style.correct
    } else {
      if (answer === this.props.countryIndex) return style.correct
      if (answer === this.props.chosenAnswerIndex) return style.wrong
    }
  }
  render () {
    const {questionType, answerType, countryIndex, answersIndices} = this.props
    /*
    if (chosenAnswerIndex !== 900) {
      this.handleAnswerChoose(this.buttons[chosenAnswerIndex], chosenAnswerIndex)
    }
    */
    return (
      <div className={style.quizzBotQuestion}>
        <header>{this.renderQuestion(questionType, answerType, countryIndex)}</header>
        <ul>
          {
            answersIndices.map((answer, i) => {
              return (
                <li key={i}>
                  <button
                    className={this.getStyle(answer)}
                    ref={(ref) => { this.buttons[answer] = (ref); if (answer === countryIndex) this.correctButton = ref }}
                    type='button'
                    onClick={(e) => this.handleAnswerChoose(e, answer)}>
                    {this.props.getCountryProperty(answer, questionType)}
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
