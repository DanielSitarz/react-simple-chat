import React from 'react'
import Immutable from 'immutable'

import style from '../style/Chat.scss'

import MessagesGroup from './MessagesGroup'

class Messages extends React.Component {
  constructor () {
    super()
    window.addEventListener('resize', () => this.scrollToBottom())
  }
  groupMessages (msgs = []) {
    return msgs
      .reduce((groups, msg) => {
        if (groups.length > 0) {
          if (msg.sender && groups[groups.length - 1][0].sender === msg.sender) {
            groups[groups.length - 1].push(msg)
          } else {
            groups[groups.length] = [msg]
          }
        } else {
          groups[0] = [msg]
        }
        return groups
      }, [])
      .map((msgs) => {
        return (<MessagesGroup key={msgs[0].key} msgs={msgs} bots={this.props.bots} />)
      })
  }
  scrollToBottom () {
    this.container.scrollTop = this.container.scrollHeight
  }
  shouldComponentUpdate (prevProps) {
    return !Immutable.is(this.props.messages, prevProps.messages)
  }
  componentDidUpdate () {
    this.scrollToBottom()
  }
  render () {
    return (
      <ul className={style.messagesContainer} ref={(ref) => { this.container = ref }}>
        {
          this.groupMessages(this.props.messages.toJS())
        }
      </ul>
    )
  }
}

export default Messages
